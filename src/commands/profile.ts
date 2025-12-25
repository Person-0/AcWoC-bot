import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command, CommandInfos } from "../commands.js";

import { fetchLeaderboard, LeaderboardRecord } from "../misc/leaderboard.js";
import { rankPositionMedals, getBasicEmbed } from "../misc/misc.js";

async function callback(info: CommandInfos, client: Client, args: string[] = []) {
    let username: string | null = null;
    if (info instanceof ChatInputCommandInteraction) {
        const pfid = info.options.getString("pfid");
        if (pfid && pfid.length > 0) {
            username = pfid;
        }
    } else {
        if (args.length > 0 && args[0].length > 0) {
            username = args[0];
        }
    }

    if (!username) {
        await info.reply(
            "## **`ERROR`**\n" +
            "Invalid username provided."
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

        username = username.toLowerCase();
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
                "No contributor with specified username found.\n"
            );
            return;
        }

        await replymsg.edit({ embeds: [
            userProfileEmbed(rank, found, data.updatedTimestring)
        ], content: "" });

    } else {
        replymsg.edit(
            "## **`ERROR`**\n" +
            "**Could not fetch latest leaderboard data: **`" + res.message +
            "`\nPlease try again later!\n"
        );
    }
}

export function userProfileEmbed(
    rank: number, record: LeaderboardRecord, footerText: string
) {
    const embed = getBasicEmbed(footerText);
    embed.setTitle(rankPositionMedals(rank) + " " + record.login);
    embed.setURL(record.url);
    embed.addFields(
        {
            name: "Rank",
            value: `**#${rank}**`,
            inline: true
        },
        {
            name: "Score",
            value: `\`${record.score}\``,
            inline: true
        },
        {
            name: "",
            value: "",
            inline: false
        },
        {
            name: "Streak",
            value: `\`${record.streak}\` Day` + (record.streak > 1 ? "s" : ""),
            inline: true
        },
        {
            name: "Total PRs",
            value: `\`${record.pr_urls.length}\``,
            inline: true
        },
        {
            name: "",
            value: "",
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
    description: "View contributor profile by username",
    options: [
        {
            name: "pfid",
            type: "string",
            description: "Username of the contributor",
            required: true
        }
    ],
    callback
} satisfies Command);