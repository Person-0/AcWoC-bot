import {
    ChatInputCommandInteraction,
    Message,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandBuilder,
    REST,
    Routes,
    Client
} from "discord.js";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

import { clog } from "./misc/misc.js";

const log = clog("cmds");

export type CommandInfos = Message<boolean> | ChatInputCommandInteraction;

export interface CommandOption {
    name: string;
    description: string;
    type: 'string' | 'channel';
    required?: boolean;
}

export interface Command {
    name: string;
    aliases?: string[],
    description: string;
    options?: CommandOption[]
    callback: (info: CommandInfos, client: Client, args: string[]) => Promise<void>;
}

export class CommandsBuilder {
    aliases: Record<string, string> = {};
    commands: Record<string, Command> = {};
    registerCommandsArr: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    exists(name: string) {
        return (!!this.aliases[name]) || (!!this.commands[name]);
    }

    async execute(cname: string, info: CommandInfos, args: string[], client: Client) {
        let name = cname;
        if (this.aliases[cname]) name = this.aliases[cname];
        await this.commands[name].callback(info, client, args);
    }

    async build(rootdir: string) {
        if (!(fs.existsSync(rootdir)))
            throw "Commands directory does not exist";

        const commandFiles = fs.readdirSync(rootdir)
            .filter(e => e.endsWith(".js"))
            .map(e => path.join(rootdir, e));

        for (const commandFile of commandFiles) {
            const newCommand: Command = (
                await import(pathToFileURL(commandFile).href)
            ).default;

            this.registerCommandsArr.push(
                getBuiltSlashCommand(newCommand).toJSON()
            );
            this.commands[newCommand.name] = newCommand;

            for (const alias of (newCommand.aliases || [])) {
                this.aliases[alias] = newCommand.name;
            }

            log(
                "loaded command:",
                [newCommand.name],
                " with aliases: ",
                newCommand.aliases || []
            );
        }
    }

    async registerSlashCommands(clientId?: string, token?: string) {
        if (!token || !clientId) return log(
            "Could not register slash commands: no client id or token provided"
        );
        const rest = new REST().setToken(token);

        try {

            log(
                `Started refreshing ${this.registerCommandsArr.length} application (/) commands.`
            );

            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: this.registerCommandsArr
            }) as any[];

            log(`Successfully reloaded ${data.length} application (/) commands.`);

        } catch (error) {
            log(error);
        }
    }
}

function getBuiltSlashCommand(command: Command) {
    const cmddata = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description);

    for (const option of (command.options || [])) {
        switch (option.type) {
            case "channel":
                cmddata.addChannelOption(
                    newOp =>
                        newOp.setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required || false)
                );
                break;
            case "string":
            default:
                cmddata.addStringOption(
                    newOp =>
                        newOp.setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required || false)
                );
                break;
        }
    }
    return cmddata;
}