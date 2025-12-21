export function clog(label: string) {
    return (...e: any[]) => {
        console.log("["+label+"]", ...e);
    }
}