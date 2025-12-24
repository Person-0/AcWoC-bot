export function ParseChannelID(unparsed: string) {
    return removeStringChars(unparsed, " <>#");
}

export function removeStringChars(str: string, chars: string) {
    let newstr = str;
    for(const char of chars){
        newstr = newstr.replaceAll(char, "");
    }
    return newstr;
}