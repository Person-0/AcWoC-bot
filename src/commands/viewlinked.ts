import { ChatInputCommandInteraction, Client, User } from "discord.js";
import { Command, CommandInfos } from "../commands.js";
import ChannelStore from "../misc/channelStore.js";
import { getDiscordByGitHub, getGithubByDiscord } from "../misc/gitlink.js";
import { getBasicEmbed } from "../misc/misc.js";

async function callback(
    info: CommandInfos,
    client: Client,
    args: string[] = [],
    store: ChannelStore
) {
    let username: string | null = null;
    let discordUser: User | null = null;
    if (info instanceof ChatInputCommandInteraction) {
        const pfid = info.options.getString("gitpf");
        const disc = info.options.getUser("discpf");
        if (pfid && pfid.length > 0) {
            username = pfid;
        } else if (disc) {
            discordUser = disc;
        }
    } else {
        if (args.length > 0 && args[0].length > 0) {
            username = args[0];
            let discMntn = username.trim();
            if (discMntn.startsWith("<@") && discMntn.endsWith(">")) {
                discMntn = discMntn.replace("<@", "").replace(">", "");
                try {
                    discordUser = await client.users.fetch(discMntn);
                    username = null;
                } catch (e) {
                    discordUser = null;
                }
            } else {
                username = username.toLowerCase();
            }
        }
    }

    if (!username && !discordUser) {
        await info.reply(
            "## **`ERROR`**\n" +
            "Invalid user provided.\n" +
            "Please provide a valid GitHub username or a discord account."
        );
        return;

    } else if (discordUser) {
        username = getGithubByDiscord(discordUser.id, store)
        if (!username) {
            await info.reply(
                "## **`ERROR`**\n" +
                "Invalid user provided.\n" +
                "This discord account is not linked with any GitHub account!"
            );
            return;
        }

    } else if (username) {
        const discordUserID = getDiscordByGitHub(username, store);
        if (!discordUserID) {
            await info.reply(
                "## **`ERROR`**\n" +
                "Invalid user provided.\n" +
                "This GitHub account is not linked with any discord account!"
            );
            return;
        }
        try {
            discordUser = await client.users.fetch(discordUserID);
        } catch (e) {
            discordUser = null;
        }
        if(!discordUser) {
            await info.reply(
                "## **`ERROR`**\n" +
                "Could not fetch discord account.\n" +
                "Please report this to the devs."
            );
            return;
        }
    }

    username = username as string;
    discordUser = discordUser as User;

    const gitHpfURL = "https://github.com/" + encodeURIComponent(username);

    const embed = getBasicEmbed("AcWoC - Android Club");
    embed.setThumbnail(null);
    embed.setTitle(username);
    embed.setURL(gitHpfURL);
    embed.setDescription(
        `**GitHub: [${username}](${gitHpfURL})**\n` +
        `**Discord: <@${discordUser.id}>**`
    );

    info.reply({
        embeds: [embed],
        allowedMentions: {
            parse: []
        }
    });
}

export default ({
    name: "viewlinked",
    aliases: ["vl", "vlinked", "viewl"],
    description: "View linked profile details by Github username or Discord account",
    options: [
        {
            name: "gitpf",
            type: "string",
            description: "GitHub Username",
            required: false
        },
        {
            name: "discpf",
            type: "user",
            description: "Discord Profile",
            required: false
        }
    ],
    callback
} satisfies Command);