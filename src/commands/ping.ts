import { Client } from "discord.js";
import { Command, CommandInfos } from "../commands.js";
import ChannelStore from "../misc/channelStore.js";

async function callback(
    info: CommandInfos,
    client: Client,
    args: string[] = [],
    store: ChannelStore
) {
    const init = Date.now();
    const replymsg = await info.reply(":ping_pong: _ _");
    await replymsg.edit(
        ":ping_pong:  `[SERVER -> DISCORD]: " + (Date.now() - init) + "ms`"
    );
}

export default ({
    name: "ping",
    description: "Test bot's ping i.e latency",
    callback
} satisfies Command);