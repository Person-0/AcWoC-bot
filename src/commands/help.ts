import { Client } from "discord.js";
import { Command, CommandInfos } from "../commands.js";
import ChannelStore from "../misc/channelStore.js";

async function callback(
    info: CommandInfos,
    client: Client,
    args: string[] = [],
    store: ChannelStore
) {
    info.reply(
        `### [View All Commands](<${process.env.HELP_README_URL}>)`
    );
}

export default ({
    name: "help",
    description: "Replies with the help README.md link",
    callback
} satisfies Command);