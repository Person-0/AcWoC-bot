export const rankPositionMedals = (rank: number) =>
    rank < 4 ? ["🥇", "🥈", "🥉"][rank - 1] : ""; 

export function ParseChannelID(unparsed: string) {
    return removeStringChars(unparsed, " <>#");
}

function removeStringChars(str: string, chars: string) {
    let newstr = str;
    for(const char of chars){
        newstr = newstr.replaceAll(char, "");
    }
    return newstr;
}