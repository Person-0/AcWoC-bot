import { Channel, ChatInputCommandInteraction, Client } from "discord.js";
import { Command, CommandInfos, CommandOption } from "../commands.js";

import { ParseChannelID } from "../misc/misc.js";
import { clog } from "../misc/misc.js";
const log = clog("cmd: forward");

async function callback(info: CommandInfos, client: Client, args: string[] = []) {
    let channel: Channel | null = null;
    let message: string | null = null;;
    if (info instanceof ChatInputCommandInteraction) {
        channel = info.options.getChannel("channel") as Channel;
        message = info.options.getString("message") as string;
    } else {
        let [channelID, ...rawmessage] = args;
        message = rawmessage.join(" ");
        try {
            channelID = ParseChannelID(channelID);
            channel = await client.channels.fetch(channelID);
        } catch(e) {
            log(e);
        }
    }
    if (
        channel &&
        channel.isSendable() &&
        message &&
        message.length > 0 &&
        message.length <= 2000
    ) {
        const status = await info.reply(
            "Sending Message to <#" + channel.id + ">"
        );
        const sent = await channel.send(message);
        await status.edit("Message sent: " + sent.url);
    } else {
        info.reply("**ERROR**: Invalid arguments provided!");
    }
}

export default ({
    name: "forward",
    aliases: ["send", "say"],
    description: "Forward a predefined message to a channel of your choice",
    options: [
        {
            name: "channel",
            description: "Channel in which the message will be forwarded",
            type: "channel"
        },
        {
            name: "message",
            description: "Message to be forwarded",
            type: "string"
        }
    ],
    callback
} satisfies Command);