import ChannelStore from "./channelStore.js";

type gitHubUsername = string;
interface gitUserRecords {
    [discordID: string]: gitHubUsername
}

export function setRecord(
    githubUser: string, discordID: string, store: ChannelStore
) {
    githubUser = githubUser.toLowerCase();
    let data = store.get("linked_accs");
    if (data && !(typeof data === "string")) {
        data[discordID] = githubUser;
    } else {
        data = {};
        data[discordID] = githubUser;
        
    }
    store.set("linked_accs", data);
}

function getRecords(store: ChannelStore) {
    let data = store.get("linked_accs");
    if (
        data &&
        !(typeof data === "string")
    ) {
        return data as gitUserRecords;
    }
    return {};
}

export function getDiscordByGitHub(
    RequestedGithubUser: string, store: ChannelStore
) {
    const records = getRecords(store);
    for(const [discordID, githubUsername] of Object.entries(records)) {
        if(githubUsername.toLowerCase() === RequestedGithubUser.toLowerCase()) {
            return discordID;
        }
    }
    return null;
}

export function getGithubByDiscord(
    RequestedDiscordID: string, store: ChannelStore
) {
    const records = getRecords(store);
    for(const [discordID, githubUsername] of Object.entries(records)) {
        if(discordID === RequestedDiscordID) {
            return githubUsername;
        }
    }
    return null;
}