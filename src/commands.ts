import { Interaction, Message } from "discord.js";

import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";
import { clog } from "./misc/log.js";
const log = clog("cmds");

export type CommandInfos = Message<boolean> | Interaction;

export interface Command {
    name: string;
    description: string;
    callback: (info: CommandInfos, args: string[]) => Promise<void>;
}

export class CommandsBuilder {
    commands: Record<string, Command> = {};

    exists(name: string) {
        return !!this.commands[name];
    }
    
    async execute(name: string, info: CommandInfos, args: string[]) {
        await this.commands[name].callback(info, args);
    }

    async build(rootdir: string) {
        if (!(fs.existsSync(rootdir))) throw "Commands directory does not exist";

        const commandFiles = fs.readdirSync(rootdir)
            .filter(e => e.endsWith(".js"))
            .map(e => path.join(rootdir, e));

        for (const commandFile of commandFiles) {
            const newCommand: Command = (await import(pathToFileURL(commandFile).href)).default;
            this.commands[newCommand.name] = newCommand;

            log("loaded command:", newCommand.name);
        }
    }
}