import { Client, Events, GatewayIntentBits } from "discord.js";

import { CommandsBuilder } from "./commands.js";
import path from "path";
import { fileURLToPath } from "url";

import { clog } from "./misc/log.js";
const log = clog("main");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.once(Events.ClientReady, (readyClient) => {
    log(`(ready) Logged in as ${readyClient.user.tag}`);
});

const Commands = new CommandsBuilder();
const PREFIX = process.env.PREFIX || "!";
Commands.build(path.join(__dirname, "./commands")).then(() => {
    log("all commands loaded");

    client.on("messageCreate", (message) => {
        const content = message.content.toLowerCase();
        if (!content.startsWith(PREFIX)) return;
        const [command, ...args] = content.replace(PREFIX, "").split(" ");

        if(Commands.exists(command)) {
            Commands.execute(command, message, args);
        } else {
            message.reply("Unknown command: `" + command + "`");
        }
    });
})

client.login(process.env.BTOKEN);