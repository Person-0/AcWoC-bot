import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command, CommandInfos } from "../commands.js";

import {
    fetchLeaderboard,
    getBasicEmbed,
    LeaderboardRecord
} from "../misc/leaderboard.js";
import { userProfileEmbed } from "./profile.js";
import { rankPositionMedals } from "../misc/misc.js";

async function callback(info: CommandInfos, client: Client, args: string[] = []) {
    let position = null;
    let wasPositionSupplied = false;
    if (info instanceof ChatInputCommandInteraction) {
        const posop = info.options.getString("position");
        if (posop) {
            wasPositionSupplied = true;
            try {
                position = parseInt(posop);
            } catch (e) { }
        }
    } else {
        if (args.length > 0) {
            wasPositionSupplied = true;
            try {
                position = parseInt(args[0]);
            } catch (e) { }
        }
    }

    if (wasPositionSupplied && (!position || position < 1)) {
        await info.reply(
            "## **`ERROR`**\n" +
            "**Invalid position argument provided.**\n" +
            "Position should be an `integer` greater than `0`"
        );
        return;
    }

    const replymsg = await info.reply("`Fetching latest leaderboard...`");

    const res = await fetchLeaderboard(async function onWakingUp() {
        await replymsg.edit("*`This might take a while, please be patient...`*");
    });

    if (res.data) {
        const data = res.data;
        const records = data.leaderboard;

        let embed: EmbedBuilder;
        const maxRank = records.length;
        if (position) {

            if (position > maxRank) {
                await replymsg.edit(
                    "## **`ERROR`**\n" +
                    "**Invalid position argument provided.**\n" +
                    "Position should be an `integer` not greater than `" + 
                    maxRank.toString() + "`\n"
                );
                return;
            }

            const record = records[position - 1];
            embed = userProfileEmbed(position, record, data.updatedTimestring);

        } else {
            embed = topThreeEmbed(records.slice(0, 4), data.updatedTimestring);
        }

        await replymsg.edit({ embeds: [embed], content: "" });

    } else {
        replymsg.edit(
            "## **`ERROR`**\n" +
            "**Could not fetch latest leaderboard data: **`" + res.message +
            "`\nPlease try again later!\n"
        );
    }
}

function topThreeEmbed(
    topThreeRecords: LeaderboardRecord[], footerText: string
) {
    const embed = getBasicEmbed(footerText);
    embed.setTitle("Top 3");
    const fields = [];
    for (let rank = 1; rank <= 3; rank++) {
        const record = topThreeRecords[rank - 1];
        fields.push({
            name: rankPositionMedals(rank) + " " + record.login,
            value: `
            Score: \`${record.score}\`
            Streak: \`${record.streak}\` day${(record.streak > 1 ? "s" : "")}
            PRs: \`${record.pr_urls.length}\`
            [View ${record.login}'s Profile](${record.url})
            `,
            inline: false
        });
        fields.push({
            name: "",
            value: "",
            inline: false
        });
    }
    fields.push({
        name: "\n",
        value: "[*View Full Leaderboard*](https://acwoc.androidclub.tech/)",
        inline: false
    })
    embed.addFields(...fields);
    return embed;
}

export default ({
    name: "leaderboard",
    aliases: ["ld", "leader", "leaders"],
    description: "Shows the AcWoC leaderboard",
    options: [
        {
            name: "position",
            type: "string",
            description: "View the details of the person at nth position on the leaderboad",
            required: false
        }
    ],
    callback
} satisfies Command);