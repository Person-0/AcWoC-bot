import { EmbedBuilder } from "discord.js";

const ADMINS = (process.env.ADMINS as string).split(",");
export function isAdmin(id: string) {
    return ADMINS.includes(id);
}

export function clog(label: string) {
    return (...e: any[]) => {
        console.log("["+label+"]", ...e);
    }
}

export const rankPositionMedals = (rank: number) =>
    rank < 4 ? ["🥇", "🥈", "🥉"][rank - 1] : ""; 

export function ParseChannelID(unparsed: string) {
    return removeStringChars(unparsed, " <>#");
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

function removeStringChars(str: string, chars: string) {
    let newstr = str;
    for(const char of chars){
        newstr = newstr.replaceAll(char, "");
    }
    return newstr;
}