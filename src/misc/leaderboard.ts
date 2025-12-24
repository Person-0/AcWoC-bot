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
        )
        const parsed = leaderboard.safeParse(response);
        if (parsed.error) {
            log("PARSE ERROR:", parsed.error.message);
            return { error: true, message: "PARSE_ERROR" };
        }
        //parsed.data = sampleLead(); // testing only
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

function sampleLead() {
    return {
        "leaderboard": [
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/96974001?u=b7b891e43c2f4ce419f0d040cc11bf92bffc8729&v=4",
                "login": "amaansyed27",
                "url": "https://github.com/amaansyed27",
                "score": 2705,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/137",
                    "https://github.com/Jyotibrat/MarkView/pull/132",
                    "https://github.com/Jyotibrat/MarkView/pull/128",
                    "https://github.com/Jyotibrat/MarkView/pull/123",
                    "https://github.com/Jyotibrat/MarkView/pull/122",
                    "https://github.com/Jyotibrat/MarkView/pull/120",
                    "https://github.com/Jyotibrat/MarkView/pull/114",
                    "https://github.com/Jyotibrat/MarkView/pull/109",
                    "https://github.com/Jyotibrat/MarkView/pull/105",
                    "https://github.com/Jyotibrat/MarkView/pull/96",
                    "https://github.com/Jyotibrat/MarkView/pull/94",
                    "https://github.com/Jyotibrat/MarkView/pull/88",
                    "https://github.com/Jyotibrat/MarkView/pull/86",
                    "https://github.com/Jyotibrat/MarkView/pull/81",
                    "https://github.com/Jyotibrat/MarkView/pull/78",
                    "https://github.com/Jyotibrat/MarkView/pull/67",
                    "https://github.com/Jyotibrat/MarkView/pull/63",
                    "https://github.com/Jyotibrat/MarkView/pull/55",
                    "https://github.com/Somil2104/Votify/pull/40",
                    "https://github.com/Somil2104/Votify/pull/39",
                    "https://github.com/Somil2104/Votify/pull/32",
                    "https://github.com/Somil2104/Votify/pull/28",
                    "https://github.com/Somil2104/Votify/pull/24",
                    "https://github.com/Somil2104/Votify/pull/17",
                    "https://github.com/Somil2104/Votify/pull/14",
                    "https://github.com/Somil2104/Votify/pull/11",
                    "https://github.com/Somil2104/Votify/pull/8",
                    "https://github.com/Somil2104/Votify/pull/5",
                    "https://github.com/Somil2104/Votify/pull/3",
                    "https://github.com/NishantRana07/HrRoadways/pull/255",
                    "https://github.com/NishantRana07/HrRoadways/pull/254",
                    "https://github.com/NishantRana07/HrRoadways/pull/253",
                    "https://github.com/NishantRana07/HrRoadways/pull/249",
                    "https://github.com/NishantRana07/HrRoadways/pull/247",
                    "https://github.com/NishantRana07/HrRoadways/pull/245",
                    "https://github.com/NishantRana07/HrRoadways/pull/232",
                    "https://github.com/NishantRana07/HrRoadways/pull/230",
                    "https://github.com/NishantRana07/HrRoadways/pull/229",
                    "https://github.com/NishantRana07/HrRoadways/pull/227",
                    "https://github.com/NishantRana07/HrRoadways/pull/223",
                    "https://github.com/NishantRana07/HrRoadways/pull/215",
                    "https://github.com/NishantRana07/HrRoadways/pull/210",
                    "https://github.com/NishantRana07/HrRoadways/pull/206",
                    "https://github.com/NishantRana07/HrRoadways/pull/203",
                    "https://github.com/NishantRana07/HrRoadways/pull/202",
                    "https://github.com/NishantRana07/HrRoadways/pull/200",
                    "https://github.com/NishantRana07/HrRoadways/pull/192",
                    "https://github.com/NishantRana07/HrRoadways/pull/174",
                    "https://github.com/NishantRana07/HrRoadways/pull/168",
                    "https://github.com/NishantRana07/HrRoadways/pull/163",
                    "https://github.com/NishantRana07/HrRoadways/pull/161",
                    "https://github.com/NishantRana07/HrRoadways/pull/157",
                    "https://github.com/NishantRana07/HrRoadways/pull/147",
                    "https://github.com/NishantRana07/HrRoadways/pull/140",
                    "https://github.com/NishantRana07/HrRoadways/pull/131",
                    "https://github.com/NishantRana07/HrRoadways/pull/129",
                    "https://github.com/NishantRana07/HrRoadways/pull/121",
                    "https://github.com/NishantRana07/HrRoadways/pull/116",
                    "https://github.com/NishantRana07/HrRoadways/pull/115",
                    "https://github.com/NishantRana07/HrRoadways/pull/113",
                    "https://github.com/NishantRana07/HrRoadways/pull/102",
                    "https://github.com/NishantRana07/HrRoadways/pull/100",
                    "https://github.com/NishantRana07/HrRoadways/pull/65",
                    "https://github.com/NishantRana07/HrRoadways/pull/63",
                    "https://github.com/NishantRana07/HrRoadways/pull/58",
                    "https://github.com/NishantRana07/HrRoadways/pull/51",
                    "https://github.com/NishantRana07/HrRoadways/pull/34",
                    "https://github.com/NishantRana07/HrRoadways/pull/27",
                    "https://github.com/NishantRana07/HrRoadways/pull/25",
                    "https://github.com/NishantRana07/HrRoadways/pull/24",
                    "https://github.com/androidvitb/Spendwise/pull/36"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-17",
                    "2025-01-18",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-25",
                    "2025-01-26",
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-01-31",
                    "2025-02-01",
                    "2025-02-02",
                    "2025-02-03",
                    "2025-02-04",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-07",
                    "2025-02-08",
                    "2025-02-09",
                    "2025-02-10",
                    "2025-02-11",
                    "2025-02-12",
                    "2025-02-13",
                    "2025-02-14",
                    "2025-02-15"
                ],
                "streak": 31
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/144704716?u=a6ab55baf042609942c7ccd7a716a6169447e707&v=4",
                "login": "CoderYUI",
                "url": "https://github.com/CoderYUI",
                "score": 1360,
                "pr_urls": [
                    "https://github.com/androidvitb/Tailorwind/pull/44",
                    "https://github.com/androidvitb/Tailorwind/pull/37",
                    "https://github.com/androidvitb/Tailorwind/pull/30",
                    "https://github.com/androidvitb/Tailorwind/pull/27",
                    "https://github.com/Jyotibrat/MarkView/pull/116",
                    "https://github.com/Jyotibrat/MarkView/pull/108",
                    "https://github.com/Jyotibrat/MarkView/pull/100",
                    "https://github.com/Jyotibrat/MarkView/pull/92",
                    "https://github.com/Jyotibrat/MarkView/pull/87",
                    "https://github.com/Jyotibrat/MarkView/pull/79",
                    "https://github.com/Jyotibrat/MarkView/pull/74",
                    "https://github.com/Jyotibrat/MarkView/pull/73",
                    "https://github.com/Jyotibrat/MarkView/pull/51",
                    "https://github.com/Jyotibrat/MarkView/pull/30",
                    "https://github.com/Jyotibrat/MarkView/pull/28",
                    "https://github.com/Somil2104/Votify/pull/25",
                    "https://github.com/Somil2104/Votify/pull/22",
                    "https://github.com/Somil2104/Votify/pull/21",
                    "https://github.com/Somil2104/Votify/pull/9",
                    "https://github.com/Somil2104/CODEBLITZ/pull/20",
                    "https://github.com/Somil2104/CODEBLITZ/pull/15",
                    "https://github.com/Somil2104/CODEBLITZ/pull/14",
                    "https://github.com/Somil2104/CODEBLITZ/pull/12",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/100",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/94",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/87",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/79",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/59",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/58",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/54",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/52",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/46",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/32",
                    "https://github.com/androidvitb/Spendwise/pull/81",
                    "https://github.com/androidvitb/Spendwise/pull/60",
                    "https://github.com/androidvitb/Spendwise/pull/58",
                    "https://github.com/androidvitb/Spendwise/pull/57",
                    "https://github.com/androidvitb/Spendwise/pull/22",
                    "https://github.com/androidvitb/Nova-Bank/pull/23",
                    "https://github.com/androidvitb/Nova-Bank/pull/20",
                    "https://github.com/androidvitb/Nova-Bank/pull/16"
                ],
                "pr_dates": [
                    "2025-01-17",
                    "2025-01-18",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-26",
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-02-01",
                    "2025-02-02",
                    "2025-02-03",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-08",
                    "2025-02-09",
                    "2025-02-12"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/33595457?v=4",
                "login": "Garvanand",
                "url": "https://github.com/Garvanand",
                "score": 1110,
                "pr_urls": [
                    "https://github.com/shreyash3087/The-Last-Bot/pull/8",
                    "https://github.com/Himanshu49Gaur/Unlocking-Identities-The-Power-of-Facial-Recognition/pull/2",
                    "https://github.com/Somil2104/Votify/pull/54",
                    "https://github.com/Somil2104/Votify/pull/52",
                    "https://github.com/Somil2104/Votify/pull/48",
                    "https://github.com/Somil2104/Votify/pull/45",
                    "https://github.com/NishantRana07/HrRoadways/pull/240",
                    "https://github.com/NishantRana07/HrRoadways/pull/238",
                    "https://github.com/NishantRana07/HrRoadways/pull/193",
                    "https://github.com/NishantRana07/HrRoadways/pull/156",
                    "https://github.com/NishantRana07/HrRoadways/pull/155",
                    "https://github.com/NishantRana07/HrRoadways/pull/151",
                    "https://github.com/NishantRana07/HrRoadways/pull/149",
                    "https://github.com/NishantRana07/HrRoadways/pull/145",
                    "https://github.com/NishantRana07/HrRoadways/pull/144",
                    "https://github.com/NishantRana07/HrRoadways/pull/127",
                    "https://github.com/NishantRana07/HrRoadways/pull/126",
                    "https://github.com/NishantRana07/HrRoadways/pull/117",
                    "https://github.com/NishantRana07/HrRoadways/pull/114",
                    "https://github.com/NishantRana07/HrRoadways/pull/107",
                    "https://github.com/NishantRana07/HrRoadways/pull/96",
                    "https://github.com/NishantRana07/HrRoadways/pull/93",
                    "https://github.com/NishantRana07/HrRoadways/pull/80",
                    "https://github.com/NishantRana07/HrRoadways/pull/79",
                    "https://github.com/NishantRana07/HrRoadways/pull/57",
                    "https://github.com/NishantRana07/HrRoadways/pull/46",
                    "https://github.com/NishantRana07/HrRoadways/pull/44",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/68",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/67",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/13",
                    "https://github.com/androidvitb/MovMusic/pull/8",
                    "https://github.com/androidvitb/MovMusic/pull/7"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-17",
                    "2025-01-18",
                    "2025-01-19",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-25",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-01-31",
                    "2025-02-02",
                    "2025-02-06"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/115109945?u=9fd224896dcdae141bf1f13927c0c0ca97f1d1e6&v=4",
                "login": "monu808",
                "url": "https://github.com/monu808",
                "score": 1105,
                "pr_urls": [
                    "https://github.com/shreyash3087/The-Last-Bot/pull/17",
                    "https://github.com/shreyash3087/The-Last-Bot/pull/15",
                    "https://github.com/KushalZambare/PDFchatbot/pull/50",
                    "https://github.com/KushalZambare/PDFchatbot/pull/48",
                    "https://github.com/KushalZambare/PDFchatbot/pull/46",
                    "https://github.com/KushalZambare/PDFchatbot/pull/41",
                    "https://github.com/KushalZambare/PDFchatbot/pull/37",
                    "https://github.com/KushalZambare/PDFchatbot/pull/36",
                    "https://github.com/KushalZambare/PDFchatbot/pull/35",
                    "https://github.com/KushalZambare/PDFchatbot/pull/28",
                    "https://github.com/KushalZambare/PDFchatbot/pull/26",
                    "https://github.com/KushalZambare/PDFchatbot/pull/24",
                    "https://github.com/KushalZambare/PDFchatbot/pull/22",
                    "https://github.com/KushalZambare/PDFchatbot/pull/20",
                    "https://github.com/KushalZambare/PDFchatbot/pull/18",
                    "https://github.com/KushalZambare/PDFchatbot/pull/6",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/10",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/9",
                    "https://github.com/androidvitb/Spendwise/pull/73",
                    "https://github.com/androidvitb/Spendwise/pull/34",
                    "https://github.com/androidvitb/Spendwise/pull/28",
                    "https://github.com/androidvitb/Spendwise/pull/24",
                    "https://github.com/androidvitb/Spendwise/pull/21",
                    "https://github.com/androidvitb/Spendwise/pull/18",
                    "https://github.com/androidvitb/Spendwise/pull/15",
                    "https://github.com/androidvitb/Nova-Bank/pull/31",
                    "https://github.com/androidvitb/Nova-Bank/pull/29",
                    "https://github.com/androidvitb/Nova-Bank/pull/25",
                    "https://github.com/androidvitb/Nova-Bank/pull/2"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-16",
                    "2025-01-18",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-25",
                    "2025-01-26",
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-30",
                    "2025-02-01",
                    "2025-02-02",
                    "2025-02-03",
                    "2025-02-04",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-10",
                    "2025-02-12",
                    "2025-02-13",
                    "2025-02-15"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/181772204?u=f95f7b9114012a31f91cdc8e53110f95c1f5c6d3&v=4",
                "login": "nikhil1205-ai",
                "url": "https://github.com/nikhil1205-ai",
                "score": 795,
                "pr_urls": [
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/18",
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/16",
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/13",
                    "https://github.com/KushalZambare/PDFchatbot/pull/42",
                    "https://github.com/KushalZambare/PDFchatbot/pull/31",
                    "https://github.com/androidvitb/MovMusic/pull/16",
                    "https://github.com/androidvitb/MovMusic/pull/14",
                    "https://github.com/androidvitb/MovMusic/pull/12",
                    "https://github.com/androidvitb/MovMusic/pull/10",
                    "https://github.com/androidvitb/PosturePerfect/pull/12",
                    "https://github.com/androidvitb/PosturePerfect/pull/10",
                    "https://github.com/androidvitb/PosturePerfect/pull/7",
                    "https://github.com/androidvitb/PosturePerfect/pull/4",
                    "https://github.com/androidvitb/Laptop-Price-Predictor/pull/10",
                    "https://github.com/androidvitb/Laptop-Price-Predictor/pull/8",
                    "https://github.com/androidvitb/Laptop-Price-Predictor/pull/6",
                    "https://github.com/androidvitb/Laptop-Price-Predictor/pull/2",
                    "https://github.com/androidvitb/Heart-disease-prediction-using-ECG/pull/14",
                    "https://github.com/androidvitb/Heart-disease-prediction-using-ECG/pull/8",
                    "https://github.com/androidvitb/Heart-disease-prediction-using-ECG/pull/3"
                ],
                "pr_dates": [
                    "2025-01-18",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-24",
                    "2025-01-27",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-01-31",
                    "2025-02-02",
                    "2025-02-04",
                    "2025-02-05",
                    "2025-02-10",
                    "2025-02-11"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/174622309?u=551f89f4a6c99315568c5b82293bd476d4122262&v=4",
                "login": "Harshit-Maurya838",
                "url": "https://github.com/Harshit-Maurya838",
                "score": 410,
                "pr_urls": [
                    "https://github.com/androidvitb/Tailorwind/pull/17",
                    "https://github.com/androidvitb/Tailorwind/pull/11",
                    "https://github.com/androidvitb/Tailorwind/pull/9",
                    "https://github.com/Somil2104/Votify/pull/41",
                    "https://github.com/Somil2104/Votify/pull/37",
                    "https://github.com/NishantRana07/HrRoadways/pull/69",
                    "https://github.com/NishantRana07/HrRoadways/pull/68",
                    "https://github.com/NishantRana07/HrRoadways/pull/12",
                    "https://github.com/KushalZambare/PDFchatbot/pull/4",
                    "https://github.com/androidvitb/MovMusic/pull/4",
                    "https://github.com/androidvitb/Nova-Bank/pull/6"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-16",
                    "2025-01-17",
                    "2025-01-19",
                    "2025-01-21",
                    "2025-01-25",
                    "2025-01-29"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/143527276?u=dae98a85902e2c2f43a82f4c6cc511b9cb1182e0&v=4",
                "login": "ak-0283",
                "url": "https://github.com/ak-0283",
                "score": 375,
                "pr_urls": [
                    "https://github.com/androidvitb/Tailorwind/pull/42",
                    "https://github.com/androidvitb/Tailorwind/pull/33",
                    "https://github.com/androidvitb/Tailorwind/pull/23",
                    "https://github.com/androidvitb/Tailorwind/pull/21",
                    "https://github.com/androidvitb/Tailorwind/pull/8",
                    "https://github.com/Jyotibrat/MarkView/pull/126",
                    "https://github.com/Jyotibrat/MarkView/pull/68",
                    "https://github.com/Jyotibrat/MarkView/pull/42",
                    "https://github.com/Jyotibrat/MarkView/pull/40",
                    "https://github.com/Jyotibrat/MarkView/pull/29",
                    "https://github.com/Jyotibrat/MarkView/pull/8",
                    "https://github.com/Jyotibrat/MarkView/pull/6",
                    "https://github.com/NishantRana07/HrRoadways/pull/189",
                    "https://github.com/NishantRana07/HrRoadways/pull/171",
                    "https://github.com/NishantRana07/HrRoadways/pull/148",
                    "https://github.com/NishantRana07/HrRoadways/pull/88",
                    "https://github.com/NishantRana07/HrRoadways/pull/86",
                    "https://github.com/NishantRana07/HrRoadways/pull/72",
                    "https://github.com/NishantRana07/HrRoadways/pull/37",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/83",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/80",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/64",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/41",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/38",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/27",
                    "https://github.com/androidvitb/Spendwise/pull/76",
                    "https://github.com/androidvitb/Spendwise/pull/66",
                    "https://github.com/androidvitb/Spendwise/pull/46",
                    "https://github.com/androidvitb/Spendwise/pull/3"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-16",
                    "2025-01-17",
                    "2025-01-18",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-25",
                    "2025-01-26",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-01-31",
                    "2025-02-02",
                    "2025-02-08"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/127775780?u=11e35fd8eb98c9c9aa438f426b2fd9a2ab422bb4&v=4",
                "login": "Ronnit44",
                "url": "https://github.com/Ronnit44",
                "score": 370,
                "pr_urls": [
                    "https://github.com/Nexus-lb/Nexus/pull/21",
                    "https://github.com/androidvitb/Tailorwind/pull/48",
                    "https://github.com/androidvitb/Tailorwind/pull/45",
                    "https://github.com/Jyotibrat/MarkView/pull/129",
                    "https://github.com/Jyotibrat/MarkView/pull/121",
                    "https://github.com/Jyotibrat/MarkView/pull/66",
                    "https://github.com/Jyotibrat/MarkView/pull/64",
                    "https://github.com/shreyash3087/The-Last-Bot/pull/10",
                    "https://github.com/NishantRana07/HrRoadways/pull/101",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/93",
                    "https://github.com/androidvitb/ProdEase/pull/18",
                    "https://github.com/androidvitb/ProdEase/pull/14",
                    "https://github.com/androidvitb/Spendwise/pull/70",
                    "https://github.com/androidvitb/Spendwise/pull/41",
                    "https://github.com/androidvitb/Spendwise/pull/5",
                    "https://github.com/androidvitb/Nova-Bank/pull/27",
                    "https://github.com/androidvitb/Nova-Bank/pull/14",
                    "https://github.com/androidvitb/Nova-Bank/pull/11"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-25",
                    "2025-01-26",
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-30",
                    "2025-02-01",
                    "2025-02-03",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-10",
                    "2025-02-11"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/178164785?v=4",
                "login": "tanishirai",
                "url": "https://github.com/tanishirai",
                "score": 345,
                "pr_urls": [
                    "https://github.com/Nexus-lb/Nexus/pull/15",
                    "https://github.com/Nexus-lb/Nexus/pull/14",
                    "https://github.com/androidvitb/Tailorwind/pull/53",
                    "https://github.com/androidvitb/Tailorwind/pull/19",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/23",
                    "https://github.com/Somil2104/Votify/pull/63",
                    "https://github.com/Somil2104/Votify/pull/62",
                    "https://github.com/Somil2104/Votify/pull/59",
                    "https://github.com/Somil2104/Votify/pull/56",
                    "https://github.com/Somil2104/CODEBLITZ/pull/19",
                    "https://github.com/NishantRana07/HrRoadways/pull/239",
                    "https://github.com/NishantRana07/HrRoadways/pull/226",
                    "https://github.com/NishantRana07/HrRoadways/pull/53",
                    "https://github.com/NishantRana07/HrRoadways/pull/43",
                    "https://github.com/NishantRana07/HrRoadways/pull/36",
                    "https://github.com/NishantRana07/HrRoadways/pull/32",
                    "https://github.com/androidvitb/ProdEase/pull/10",
                    "https://github.com/androidvitb/ProdEase/pull/8",
                    "https://github.com/androidvitb/ProdEase/pull/7",
                    "https://github.com/androidvitb/Spendwise/pull/78",
                    "https://github.com/androidvitb/Nova-Bank/pull/18",
                    "https://github.com/androidvitb/Nova-Bank/pull/9",
                    "https://github.com/Passionatelytoooadorable/Digital-Marketing-Landing-Page/pull/5",
                    "https://github.com/Passionatelytoooadorable/Digital-Marketing-Landing-Page/pull/4"
                ],
                "pr_dates": [
                    "2025-01-17",
                    "2025-01-18",
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-29",
                    "2025-02-02",
                    "2025-02-03",
                    "2025-02-04",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-08",
                    "2025-02-10",
                    "2025-02-11",
                    "2025-02-14"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/169234613?u=d3c686f7d74eab3c1bd12632401b05eb64d7d224&v=4",
                "login": "5uhani",
                "url": "https://github.com/5uhani",
                "score": 320,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/225",
                    "https://github.com/NishantRana07/HrRoadways/pull/219",
                    "https://github.com/NishantRana07/HrRoadways/pull/212",
                    "https://github.com/NishantRana07/HrRoadways/pull/208",
                    "https://github.com/NishantRana07/HrRoadways/pull/204",
                    "https://github.com/NishantRana07/HrRoadways/pull/191",
                    "https://github.com/NishantRana07/HrRoadways/pull/184",
                    "https://github.com/NishantRana07/HrRoadways/pull/183",
                    "https://github.com/NishantRana07/HrRoadways/pull/178",
                    "https://github.com/NishantRana07/HrRoadways/pull/177",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/85",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/75",
                    "https://github.com/androidvitb/Spendwise/pull/74",
                    "https://github.com/androidvitb/Spendwise/pull/55",
                    "https://github.com/androidvitb/Spendwise/pull/54",
                    "https://github.com/androidvitb/Spendwise/pull/48"
                ],
                "pr_dates": [
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-29",
                    "2025-01-30",
                    "2025-01-31",
                    "2025-02-01",
                    "2025-02-02",
                    "2025-02-04"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/173527368?u=86985782ea86417ee44cdd5f4694bc987c84544d&v=4",
                "login": "ShashiSingh8434",
                "url": "https://github.com/ShashiSingh8434",
                "score": 300,
                "pr_urls": [
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/13",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/10",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/4",
                    "https://github.com/androidvitb/Workout-Assistant/pull/14",
                    "https://github.com/androidvitb/Workout-Assistant/pull/13",
                    "https://github.com/androidvitb/Workout-Assistant/pull/11",
                    "https://github.com/androidvitb/Workout-Assistant/pull/10",
                    "https://github.com/androidvitb/Workout-Assistant/pull/9",
                    "https://github.com/androidvitb/Workout-Assistant/pull/8",
                    "https://github.com/androidvitb/Workout-Assistant/pull/6",
                    "https://github.com/androidvitb/Workout-Assistant/pull/5"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-16",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-22",
                    "2025-01-25",
                    "2025-01-26"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/85232554?u=2af8884210afc784a1a46a2c7a759ced69763ea4&v=4",
                "login": "Swayam200",
                "url": "https://github.com/Swayam200",
                "score": 255,
                "pr_urls": [
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/17",
                    "https://github.com/Somil2104/Votify/pull/53",
                    "https://github.com/Somil2104/Votify/pull/50",
                    "https://github.com/Somil2104/Votify/pull/36",
                    "https://github.com/Somil2104/Votify/pull/30",
                    "https://github.com/Somil2104/CODEBLITZ/pull/22",
                    "https://github.com/NishantRana07/HrRoadways/pull/188",
                    "https://github.com/androidvitb/DenseNet-121-Model-for-Crop-Disease-Detection/pull/3",
                    "https://github.com/androidvitb/Spendwise/pull/75",
                    "https://github.com/androidvitb/Spendwise/pull/53",
                    "https://github.com/androidvitb/Spendwise/pull/44",
                    "https://github.com/androidvitb/Spendwise/pull/35",
                    "https://github.com/androidvitb/Spendwise/pull/23",
                    "https://github.com/androidvitb/Spendwise/pull/11"
                ],
                "pr_dates": [
                    "2025-01-18",
                    "2025-01-20",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-25",
                    "2025-01-26",
                    "2025-01-27",
                    "2025-01-28",
                    "2025-01-29",
                    "2025-01-31",
                    "2025-02-01",
                    "2025-02-02",
                    "2025-02-11"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/170100240?u=c6c88696ee70f6c1fc465bbd2a5c13b96d7c840e&v=4",
                "login": "KrishnashishMunshi",
                "url": "https://github.com/KrishnashishMunshi",
                "score": 235,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/21",
                    "https://github.com/Jyotibrat/MarkView/pull/12",
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/8",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/22",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/11",
                    "https://github.com/shreyash3087/The-Last-Bot/pull/7",
                    "https://github.com/shreyash3087/The-Last-Bot/pull/5",
                    "https://github.com/Somil2104/CODEBLITZ/pull/18",
                    "https://github.com/Somil2104/CODEBLITZ/pull/8",
                    "https://github.com/Somil2104/CODEBLITZ/pull/6",
                    "https://github.com/Somil2104/CODEBLITZ/pull/5"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-17",
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-02-05"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/169937412?u=09f82a9e631ce1560a0681a95e8499e095695cc6&v=4",
                "login": "msv6264",
                "url": "https://github.com/msv6264",
                "score": 230,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/139",
                    "https://github.com/Jyotibrat/MarkView/pull/138",
                    "https://github.com/Jyotibrat/MarkView/pull/133",
                    "https://github.com/Jyotibrat/MarkView/pull/117",
                    "https://github.com/Jyotibrat/MarkView/pull/112",
                    "https://github.com/Jyotibrat/MarkView/pull/45",
                    "https://github.com/Jyotibrat/MarkView/pull/34",
                    "https://github.com/Jyotibrat/MarkView/pull/32",
                    "https://github.com/NishantRana07/HrRoadways/pull/91",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/108",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/101",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/98",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/56",
                    "https://github.com/androidvitb/Spendwise/pull/26"
                ],
                "pr_dates": [
                    "2025-01-19",
                    "2025-01-20",
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-02-03",
                    "2025-02-05",
                    "2025-02-12",
                    "2025-02-13",
                    "2025-02-14"
                ],
                "streak": 3
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/164798362?v=4",
                "login": "verma-jaanvi",
                "url": "https://github.com/verma-jaanvi",
                "score": 185,
                "pr_urls": [
                    "https://github.com/Nexus-lb/Nexus/pull/18",
                    "https://github.com/androidvitb/Tailorwind/pull/51",
                    "https://github.com/androidvitb/Tailorwind/pull/49",
                    "https://github.com/androidvitb/Tailorwind/pull/40",
                    "https://github.com/Deeptig9138/Speed-Typing-Test/pull/25",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/82",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/78",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/63",
                    "https://github.com/androidvitb/Spendwise/pull/37"
                ],
                "pr_dates": [
                    "2025-01-24",
                    "2025-01-29",
                    "2025-01-31",
                    "2025-02-02",
                    "2025-02-08"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/195145898?u=5323567000cdd583c820df59996ba673162e355e&v=4",
                "login": "shubham241-svg",
                "url": "https://github.com/shubham241-svg",
                "score": 175,
                "pr_urls": [
                    "https://github.com/androidvitb/Tailorwind/pull/31",
                    "https://github.com/androidvitb/Tailorwind/pull/13",
                    "https://github.com/NishantRana07/HrRoadways/pull/74",
                    "https://github.com/NishantRana07/HrRoadways/pull/20",
                    "https://github.com/NishantRana07/HrRoadways/pull/19"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-20",
                    "2025-01-21"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/170239131?u=41c05b8d4f4931ec04e5c3a69055f9f6aa26c86d&v=4",
                "login": "manthanawgan",
                "url": "https://github.com/manthanawgan",
                "score": 150,
                "pr_urls": [
                    "https://github.com/Himanshu49Gaur/Unlocking-Identities-The-Power-of-Facial-Recognition/pull/5",
                    "https://github.com/androidvitb/PosturePerfect/pull/8",
                    "https://github.com/androidvitb/PosturePerfect/pull/2",
                    "https://github.com/androidvitb/DenseNet-121-Model-for-Crop-Disease-Detection/pull/4"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-20",
                    "2025-01-22",
                    "2025-02-03"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/191088684?v=4",
                "login": "Krishna-cell-12",
                "url": "https://github.com/Krishna-cell-12",
                "score": 125,
                "pr_urls": [
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/11",
                    "https://github.com/Somil2104/Votify/pull/33",
                    "https://github.com/NishantRana07/HrRoadways/pull/153",
                    "https://github.com/KushalZambare/PDFchatbot/pull/12"
                ],
                "pr_dates": [
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-25"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/195120077?u=2f4254045ab513e7abce4528843066c492351e31&v=4",
                "login": "UnknownDev303",
                "url": "https://github.com/UnknownDev303",
                "score": 115,
                "pr_urls": [
                    "https://github.com/mdazfar2/HelpOps-Hub/pull/1472",
                    "https://github.com/Nexus-lb/Nexus/pull/7",
                    "https://github.com/Nexus-lb/Nexus/pull/3",
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/5",
                    "https://github.com/NishantRana07/HrRoadways/pull/15",
                    "https://github.com/NishantRana07/HrRoadways/pull/11"
                ],
                "pr_dates": [
                    "2025-01-15",
                    "2025-01-16"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/142989448?u=0bb10abc4f6144197517e110ec96d6dba11bb1c7&v=4",
                "login": "dhairyagothi",
                "url": "https://github.com/dhairyagothi",
                "score": 100,
                "pr_urls": [
                    "https://github.com/androidvitb/Tailorwind/pull/14",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/42",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/14",
                    "https://github.com/androidvitb/MovMusic/pull/2"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-17"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/174012163?u=f765697af492601f9bb67f74975f8c877ddbdcc4&v=4",
                "login": "abhinav-atul",
                "url": "https://github.com/abhinav-atul",
                "score": 85,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/209",
                    "https://github.com/KushalZambare/PDFchatbot/pull/16",
                    "https://github.com/androidvitb/ProdEase/pull/15",
                    "https://github.com/androidvitb/ProdEase/pull/13",
                    "https://github.com/androidvitb/Spendwise/pull/85",
                    "https://github.com/androidvitb/Nova-Bank/pull/22",
                    "https://github.com/androidvitb/Nova-Bank/pull/19"
                ],
                "pr_dates": [
                    "2025-01-25",
                    "2025-01-31",
                    "2025-02-05",
                    "2025-02-06",
                    "2025-02-07",
                    "2025-02-09"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/154428618?u=93fb0d8a3e4a93e3465bd8f8f33ce446a55a40e9&v=4",
                "login": "Shrey3satdeve",
                "url": "https://github.com/Shrey3satdeve",
                "score": 85,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/50",
                    "https://github.com/NishantRana07/HrRoadways/pull/42",
                    "https://github.com/NishantRana07/HrRoadways/pull/39"
                ],
                "pr_dates": [
                    "2025-01-17",
                    "2025-01-18"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/153424252?v=4",
                "login": "anshukumar2932",
                "url": "https://github.com/anshukumar2932",
                "score": 80,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/53",
                    "https://github.com/Jyotibrat/MarkView/pull/44",
                    "https://github.com/Jyotibrat/MarkView/pull/41",
                    "https://github.com/Jyotibrat/MarkView/pull/33",
                    "https://github.com/Jyotibrat/MarkView/pull/24"
                ],
                "pr_dates": [
                    "2025-01-21",
                    "2025-01-23",
                    "2025-01-24",
                    "2025-01-25"
                ],
                "streak": 3
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/142437933?u=28cfa04e2807ab10f145b92a14a920b15e0423f8&v=4",
                "login": "HimanshuHeda",
                "url": "https://github.com/HimanshuHeda",
                "score": 60,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/150",
                    "https://github.com/NishantRana07/HrRoadways/pull/128",
                    "https://github.com/androidvitb/Spendwise/pull/67"
                ],
                "pr_dates": [
                    "2025-01-23",
                    "2025-01-25",
                    "2025-01-31"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/172209624?v=4",
                "login": "Anujkosta",
                "url": "https://github.com/Anujkosta",
                "score": 60,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/60",
                    "https://github.com/NishantRana07/HrRoadways/pull/48",
                    "https://github.com/NishantRana07/HrRoadways/pull/38"
                ],
                "pr_dates": [
                    "2025-01-17",
                    "2025-01-18"
                ],
                "streak": 2
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/184714724?v=4",
                "login": "AbhiSharma69",
                "url": "https://github.com/AbhiSharma69",
                "score": 55,
                "pr_urls": [
                    "https://github.com/NishantRana07/HrRoadways/pull/172",
                    "https://github.com/NishantRana07/HrRoadways/pull/170",
                    "https://github.com/NishantRana07/HrRoadways/pull/70",
                    "https://github.com/NishantRana07/HrRoadways/pull/16"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-19",
                    "2025-01-26"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/126577697?u=b5949121bc495395bbc7b32fa3899a1534011a0c&v=4",
                "login": "NishantRana07",
                "url": "https://github.com/NishantRana07",
                "score": 50,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/11",
                    "https://github.com/anushkaa-dubey/QuickQR/pull/30"
                ],
                "pr_dates": [
                    "2025-01-16"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/143245494?v=4",
                "login": "sagar27sahu",
                "url": "https://github.com/sagar27sahu",
                "score": 50,
                "pr_urls": [
                    "https://github.com/KushalZambare/PDFchatbot/pull/8",
                    "https://github.com/androidvitb/Heart-disease-prediction-using-ECG/pull/7"
                ],
                "pr_dates": [
                    "2025-01-21",
                    "2025-01-25"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/110986261?v=4",
                "login": "AdiJee2195",
                "url": "https://github.com/AdiJee2195",
                "score": 50,
                "pr_urls": [
                    "https://github.com/androidvitb/MovMusic/pull/18"
                ],
                "pr_dates": [
                    "2025-02-15"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/171709206?v=4",
                "login": "pragna7",
                "url": "https://github.com/pragna7",
                "score": 50,
                "pr_urls": [
                    "https://github.com/androidvitb/Spendwise/pull/87"
                ],
                "pr_dates": [
                    "2025-02-12"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/190815913?v=4",
                "login": "pratthu23",
                "url": "https://github.com/pratthu23",
                "score": 35,
                "pr_urls": [
                    "https://github.com/KushalZambare/PDFchatbot/pull/14",
                    "https://github.com/androidvitb/Heart-disease-prediction-using-ECG/pull/6"
                ],
                "pr_dates": [
                    "2025-01-23"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/177998495?v=4",
                "login": "Arunim-Gogoi",
                "url": "https://github.com/Arunim-Gogoi",
                "score": 25,
                "pr_urls": [
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/19"
                ],
                "pr_dates": [
                    "2025-01-31"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/170741810?v=4",
                "login": "Jyotibrat",
                "url": "https://github.com/Jyotibrat",
                "score": 25,
                "pr_urls": [
                    "https://github.com/Auth0r-C0dez/Caption_generator/pull/3"
                ],
                "pr_dates": [
                    "2025-01-15"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/171185453?u=bcea8770658a6048eeeed077b81c4d6f10b17965&v=4",
                "login": "DragonClaw0",
                "url": "https://github.com/DragonClaw0",
                "score": 25,
                "pr_urls": [
                    "https://github.com/shreyash3087/The-Last-Bot/pull/3"
                ],
                "pr_dates": [
                    "2025-01-15"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/177917824?v=4",
                "login": "MukulMutreja",
                "url": "https://github.com/MukulMutreja",
                "score": 25,
                "pr_urls": [
                    "https://github.com/anushkaa-dubey/QuickQR/pull/33"
                ],
                "pr_dates": [
                    "2025-01-17"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/183705796?v=4",
                "login": "Suysri23",
                "url": "https://github.com/Suysri23",
                "score": 20,
                "pr_urls": [
                    "https://github.com/KushalZambare/PDFchatbot/pull/2",
                    "https://github.com/androidvitb/Laptop-Price-Predictor/pull/4"
                ],
                "pr_dates": [
                    "2025-01-16",
                    "2025-01-20"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/147577902?v=4",
                "login": "Auth0r-C0dez",
                "url": "https://github.com/Auth0r-C0dez",
                "score": 10,
                "pr_urls": [
                    "https://github.com/Jyotibrat/MarkView/pull/89"
                ],
                "pr_dates": [
                    "2025-01-29"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/145194175?v=4",
                "login": "Nikhil7704",
                "url": "https://github.com/Nikhil7704",
                "score": 10,
                "pr_urls": [
                    "https://github.com/anushkaa-dubey/QuickQR/pull/72"
                ],
                "pr_dates": [
                    "2025-01-28"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/156674816?u=0fb50be8c6cdc32dbfa24d3a60b1fe346111f3ab&v=4",
                "login": "Jotthecode",
                "url": "https://github.com/Jotthecode",
                "score": 10,
                "pr_urls": [
                    "https://github.com/anushkaa-dubey/QuickQR/pull/35"
                ],
                "pr_dates": [
                    "2025-01-17"
                ],
                "streak": 1
            },
            {
                "avatar_url": "https://avatars.githubusercontent.com/u/137278054?v=4",
                "login": "abhijeetd05",
                "url": "https://github.com/abhijeetd05",
                "score": 10,
                "pr_urls": [
                    "https://github.com/androidvitb/Spendwise/pull/8"
                ],
                "pr_dates": [
                    "2025-01-16"
                ],
                "streak": 1
            }
        ],
        "success": true,
        "updatedAt": 1739620999214,
        "generated": true,
        "updatedTimestring": "2/15/2025, 5:40 PM No New PRs merged after 15th February 6:00p.m are counted",
        "streakData": [
            {
                "login": "amaansyed27",
                "streak": 31
            },
            {
                "login": "CoderYUI",
                "streak": 1
            },
            {
                "login": "Garvanand",
                "streak": 1
            },
            {
                "login": "monu808",
                "streak": 1
            },
            {
                "login": "nikhil1205-ai",
                "streak": 2
            },
            {
                "login": "Harshit-Maurya838",
                "streak": 1
            },
            {
                "login": "ak-0283",
                "streak": 1
            },
            {
                "login": "Ronnit44",
                "streak": 2
            },
            {
                "login": "tanishirai",
                "streak": 1
            },
            {
                "login": "5uhani",
                "streak": 1
            },
            {
                "login": "ShashiSingh8434",
                "streak": 2
            },
            {
                "login": "Swayam200",
                "streak": 1
            },
            {
                "login": "KrishnashishMunshi",
                "streak": 1
            },
            {
                "login": "msv6264",
                "streak": 3
            },
            {
                "login": "verma-jaanvi",
                "streak": 1
            },
            {
                "login": "shubham241-svg",
                "streak": 2
            },
            {
                "login": "manthanawgan",
                "streak": 1
            },
            {
                "login": "Krishna-cell-12",
                "streak": 1
            },
            {
                "login": "UnknownDev303",
                "streak": 2
            },
            {
                "login": "dhairyagothi",
                "streak": 2
            },
            {
                "login": "abhinav-atul",
                "streak": 1
            },
            {
                "login": "Shrey3satdeve",
                "streak": 2
            },
            {
                "login": "anshukumar2932",
                "streak": 3
            },
            {
                "login": "HimanshuHeda",
                "streak": 1
            },
            {
                "login": "Anujkosta",
                "streak": 2
            },
            {
                "login": "AbhiSharma69",
                "streak": 1
            },
            {
                "login": "NishantRana07",
                "streak": 1
            },
            {
                "login": "sagar27sahu",
                "streak": 1
            },
            {
                "login": "AdiJee2195",
                "streak": 1
            },
            {
                "login": "pragna7",
                "streak": 1
            },
            {
                "login": "pratthu23",
                "streak": 1
            },
            {
                "login": "Arunim-Gogoi",
                "streak": 1
            },
            {
                "login": "Jyotibrat",
                "streak": 1
            },
            {
                "login": "DragonClaw0",
                "streak": 1
            },
            {
                "login": "MukulMutreja",
                "streak": 1
            },
            {
                "login": "Suysri23",
                "streak": 1
            },
            {
                "login": "Auth0r-C0dez",
                "streak": 1
            },
            {
                "login": "Nikhil7704",
                "streak": 1
            },
            {
                "login": "Jotthecode",
                "streak": 1
            },
            {
                "login": "abhijeetd05",
                "streak": 1
            }
        ]
    }
}