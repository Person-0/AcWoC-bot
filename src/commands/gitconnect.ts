import z from "zod";

import { Client, Message, ChannelType } from "discord.js";
import { Command, CommandInfos } from "../commands.js";
import ChannelStore from "../misc/channelStore.js";
import { setRecord } from "../misc/gitlink.js";
import { clog } from "../misc/misc.js";
const log = clog("gitconnect");

const argSchema = z.tuple([z.string().min(1)]);

const accessCodeResSchema = z.object({
    "access_token": z.string().min(1),
    "token_type": z.string().min(1),
});
type accessCodeResType = z.infer<typeof accessCodeResSchema>;

const gitUserSchema = z.object({
    "login": z.string().min(1).max(39),
    "avatar_url": z.string().startsWith("https://")
});

async function callback(
    info: CommandInfos,
    client: Client,
    args: string[] = [],
    store: ChannelStore
) {
    if (!(info instanceof Message)) {
        info.reply("error: text-based only command");
        return;
    }

    const parsed = argSchema.safeParse(args);
    if (parsed.error) {
        const reply = await info.reply(
            `[Click here](${process.env.GHCODEURL}) to get your GitHub Code.\n` +
            "After that, use the following command in DMs to connect your " +
            "GitHub account with this discord account:\n`" +
            process.env.PREFIX + "gitconnect <GitHub Code>`\n" +
            "Where <GitHub Code> is the code you got from the website."
        )
        reply.suppressEmbeds(true);
        return;
    }

    const gitCode = parsed.data[0];
    const statusMsg = await info.reply("`Verifying GitHub Profile...`");
    const accessCodeRes = await getGitAuthedCodeResponse(gitCode);
    if (!accessCodeRes) {
        statusMsg.edit(
            "## **`ERROR`**\n" +
            "Invalid Code Provided!"
        );
        return;
    }
    const gitUserinfo = await getGitUserInfo(accessCodeRes);
    if (!gitUserinfo) {
        statusMsg.edit(
            "## **`ERROR`**\n" +
            "Could not get GitHub username."
        );
        return;
    }

    setRecord(gitUserinfo.login, info.author.id, store);
    
    statusMsg.edit(
        "## **`Success`**\n" +
        "Your Discord is now linked with https://github.com/" +
        encodeURIComponent(gitUserinfo.login) + "\n"
    );
}

async function getGitAuthedCodeResponse(code: string) {
    const params = new URLSearchParams();
    params.append("client_id", process.env.GHCLIENTID as string);
    params.append("client_secret", process.env.GHCLIENTSECRET as string);
    params.append("code", code);
    params.append("redirect_url", process.env.GHREDIRECTURI as string);
    let res: Response;
    try {
        res = await fetch(
            "https://github.com/login/oauth/access_token?" + params.toString(),
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "AcWoC-Bot NodeJS"
                }
            }
        )
    } catch (err) {
        log("ERROR getGitAuthedCode:", err);
        return null;
    }

    const parsed = accessCodeResSchema.safeParse(await res.json());
    if (parsed.error) {
        log("ERROR getGitAuthedCode:", parsed.error.message);
        return null;
    }

    return parsed.data;
}

async function getGitUserInfo(accessCodeRes: accessCodeResType) {
    let res;
    try {
        res = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": (
                    accessCodeRes.token_type +
                    " " +
                    accessCodeRes.access_token
                ),
                "User-Agent": "AcWoC-Bot NodeJS"
            }
        });
    } catch (err) {
        log("ERROR getGitUserInfo:", err);
        return null;
    }
    const data = await res.json();
    const parsed = gitUserSchema.safeParse(data);
    if (parsed.error) {
        log("ERROR getGitUserInfo:", parsed.error.message);
        return null;
    }
    return parsed.data;
}

export default ({
    name: "gitconnect",
    description: "Connect the contributor / maintainer's GitHub with their discord account",
    aliases: ["gc", "gitc"],
    dmOnly: true,
    options: [
        {
            name: "gitcode",
            type: "string",
            description: "GitHub Code",
            required: false
        }
    ],
    callback
} satisfies Command);