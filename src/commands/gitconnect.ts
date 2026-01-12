import { Client, Message, ChannelType } from "discord.js";
import { Command, CommandInfos } from "../commands.js";
import z from "zod";
import ChannelStore from "../misc/channelStore.js";

const replyInDmMsg = (
    "## **`ERROR`**\n" +
    "This Command is only available in DMs.\n" +
    "Please use it by sending a direct message to the bot" +
    "in the following format:\n`" +
    process.env.PREFIX + "gitconnect <GitHub Profile Name>`"
);

const argSchema = z.tuple([z.string().min(1).max(39)]);

async function callback(
    info: CommandInfos,
    client: Client,
    args: string[] = [],
    store: ChannelStore
) {
    if (info instanceof Message && info.channel.type === ChannelType.DM) {
        const parsed = argSchema.safeParse(args);
        if(parsed.error) {
            info.reply(
                "## **`ERROR`**\n" +
                "Please provide a valid GitHub Profile Name!"
            );
            return;
        }
        const gitUser = parsed.data[0];
        info.reply("Registering " + gitUser);
        store.set("test", "test");
    } else {
        info.reply(replyInDmMsg);
    }
}

export default ({
    name: "gitconnect", // PREFIXcommandName or /commandName
    description: "Connect the contributor / maintainer's GitHub with their discord account",
    aliases: ["gc", "gitc"],
    options: [
        {
            name: "gituser",
            type: "string",
            description: "GitHub Profile Name",
            required: true
        }
    ],
    callback
} satisfies Command);