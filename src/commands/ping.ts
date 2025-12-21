import { Message } from "discord.js";
import { Command, CommandInfos } from "../commands.js";

async function callback(info: CommandInfos, args: string[] = []) {
    if(info instanceof Message) {
        info.reply("pong");
    }
}

export default ({
    name: "ping",
    description: "ping",
    callback
} satisfies Command);