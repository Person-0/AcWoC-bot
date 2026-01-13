import { ChatInputCommandInteraction, Client, User } from "discord.js";
import { Command, CommandInfos } from "../commands.js";

import { fetchLeaderboard, LeaderboardRecord } from "../misc/leaderboard.js";
import { rankPositionMedals, getBasicEmbed } from "../misc/misc.js";
import ChannelStore from "../misc/channelStore.js";
import { getDiscordByGitHub, getGithubByDiscord } from "../misc/gitlink.js";

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
    }

    if (discordUser) username = getGithubByDiscord(discordUser.id, store)
    if (!username) {
        await info.reply(
            "## **`ERROR`**\n" +
            "Invalid user provided.\n" +
            "This discord account is not linked with any GitHub account!"
        );
        return;
    }

    const replymsg = await info.reply("`Searching for User Data...`");

    const res = await fetchLeaderboard(async function onWakingUp() {
        await replymsg.edit("*`This might take a while, please be patient...`*");
    });

    if (res.data) {

        let found: LeaderboardRecord | null = null;
        let rank = 1;
        const data = res.data;
        const records = data.leaderboard;

        for (const record of records) {
            if (record.login.toLowerCase() === username) {
                found = record;
                break;
            }
            rank += 1;
        }

        if (!found) {
            replymsg.edit(
                "## **`ERROR`**\n" +
                "No contributor with specified username found.\n" +
                "If you need to view the profile of a maintainer please use " +
                "the view linked accounts command.\n" +
                "Use the help command to get a list of all available commands."
            );
            return;
        }

        await replymsg.edit({
            embeds: [
                userProfileEmbed(
                    rank,
                    found,
                    data.updatedTimestring,
                    getDiscordByGitHub(found.login, store)
                )
            ],
            allowedMentions: {
                parse: []
            },
            content: ""
        });

    } else {
        replymsg.edit(
            "## **`ERROR`**\n" +
            "**Could not fetch latest leaderboard data: **`" + res.message +
            "`\nPlease try again later!\n"
        );
    }
}

export function userProfileEmbed(
    rank: number,
    record: LeaderboardRecord,
    footerText: string,
    discordID: string | null = null
) {
    const embed = getBasicEmbed(footerText);
    embed.setTitle(rankPositionMedals(rank) + " " + record.login);
    embed.setURL(record.url);
    embed.addFields(
        {
            name: "Rank",
            value: `**#${rank}**`,
            inline: false
        },
        {
            name: "Points",
            value: `\`${record.score}\``,
            inline: false
        },
        {
            name: "Streak",
            value: `\`${record.streak}\` Day` + (record.streak > 1 ? "s" : ""),
            inline: false
        },
        {
            name: "Total PRs",
            value: `\`${record.pr_urls.length}\``,
            inline: false
        },
        {
            name: "Discord Account",
            value: discordID ? `<@${discordID}>` : 'Not Linked',
            inline: false
        },
        {
            name: "GitHub Profile",
            value: record.url,
            inline: false
        }
    );
    embed.setImage(record.avatar_url + "&size=128");
    return embed;
}

export default ({
    name: "profile",
    aliases: ["user", "pf", "contributor", "contrib"],
    description: "View contributor profile by Github username or Discord account",
    options: [
        {
            name: "gitpf",
            type: "string",
            description: "GitHub Username of the contributor",
            required: false
        },
        {
            name: "discpf",
            type: "user",
            description: "Discord Profile of the contributor",
            required: false
        }
    ],
    callback
} satisfies Command);