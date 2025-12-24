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
import { clog } from "./misc/log.js";
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
    description: string;
    options?: CommandOption[]
    callback: (info: CommandInfos, client: Client, args: string[]) => Promise<void>;
}

export class CommandsBuilder {
    commands: Record<string, Command> = {};
    registerCommandsArr: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    exists(name: string) {
        return !!this.commands[name];
    }

    async execute(name: string, info: CommandInfos, args: string[], client: Client) {
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
            this.commands[newCommand.name] = newCommand;

            const cmddata = new SlashCommandBuilder()
                .setName(newCommand.name)
                .setDescription(newCommand.description);

            for(const option of (newCommand.options || [])){
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
            
            this.registerCommandsArr.push(cmddata.toJSON());

            log("loaded command:", newCommand.name);
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