import * as z from "zod";
import { EmbedBuilder } from "discord.js";

import { clog } from "./log.js";
const log = clog("LEADERBOARD_FETCH");

const leaderboardRecord = z.object({
    avatar_url: z.string(),
    login: z.string(),
    url: z.string().startsWith("https://github.com/"),
    score: z.number().int(),
    pr_urls: z.array(z.string().startsWith("https://github.com/")),
    pr_dates: z.array(z.string()),
    streak: z.number().int()
});

const streakDataRecord = z.object({
    login: z.string(),
    streak: z.number().int()
});

const leaderboard = z.object({
    leaderboard: z.array(leaderboardRecord),
    success: z.boolean(),
    updatedAt: z.number().int(),
    generated: z.boolean(),
    updatedTimestring: z.string(),
    streakData: z.array(streakDataRecord)
});

export type LeaderboardRecord = z.infer<typeof leaderboardRecord>;
export type StreakDataRecord = z.infer<typeof streakDataRecord>;
export type Leaderboard = z.infer<typeof leaderboard>;

export async function fetchLeaderboard(wakeCB = () => { }) {
    try {
        const response = await wakeAndFetch(
            process.env.LEADERBOARD_FETCH_URL as string,
            wakeCB
        );
        const parsed = leaderboard.safeParse(response);
        if (parsed.error) {
            log("PARSE ERROR:", parsed.error.message);
            return { error: true, message: "PARSE_ERROR" };
        }
        return { error: false, data: parsed.data };
    } catch (e) {
        log(e);
        return { error: true, message: "WAKE_TIMEOUT_ASSUMPTION" };
    }
}

export function getBasicEmbed(footerText: string) {
    const embed = new EmbedBuilder();
    embed.setAuthor({
        name: "AcWoC",
        url: "https://acwoc.androidclub.tech/",
        iconURL: process.env.BOT_PROFILE_IMG as string,
    });
    embed.setThumbnail(process.env.BOT_PROFILE_IMG as string);
    embed.setColor("#6da3ad");
    embed.setFooter({ text: footerText });
    return embed;
}

async function wakeAndFetch(
    url: string,
    wakeCB: () => void,
    requestTimeoutMs = 5e3,
    retryDelayMs = 500,
    maxWaitMs = 60e3
) {
    const start = Date.now();
    let wakeCBcalled = false;

    while (Date.now() - start < maxWaitMs) {
        try {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(requestTimeoutMs),
            });

            if (!res.ok) {
                if (!wakeCBcalled) wakeCB();
                throw new Error(`HTTP ${res.status}`);
            }

            return await res.json();
        } catch (err: any) {
            if (!wakeCBcalled) wakeCB();
            if (
                err.name !== "AbortError" &&
                err.name !== "TimeoutError" &&
                err.name !== "TypeError"
            ) {
                throw err;
            }
        }

        await new Promise(r => setTimeout(r, retryDelayMs));
    }

    throw "MAX_WAIT_EXCEEDED";
}