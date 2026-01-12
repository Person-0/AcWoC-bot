import {
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    MessageFlags,
    TextChannel
} from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

import "./misc/health.js";
import { CommandsBuilder } from "./commands.js";
import { clog } from "./misc/misc.js";
import ChannelStore from "./misc/channelStore.js";

const log = clog("main");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let Store: ChannelStore;
const Commands = new CommandsBuilder();
const PREFIX = process.env.PREFIX || "!";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.once(Events.ClientReady, async (readyClient) => {
    log(`logged in as ${readyClient.user.tag}`);

    readyClient.user.setPresence({
        status: 'idle'
    });

    process.env.BOT_PROFILE_IMG = readyClient.user.displayAvatarURL();

    const storeChannelInstance = await readyClient.channels.fetch(
        process.env.STORECHANNELID as string
    );
    if (storeChannelInstance) {
        Store = new ChannelStore(
            "acwoc",
            storeChannelInstance as TextChannel
        );
        Commands.setStore(Store);
    } else {
        throw Error("ChannelStore: Store channel not found");
    }
});

const listenToCommands = () => {
    client.on("messageCreate", async (message) => {
        let [command, ...args] = message.content.split(" ");
        command = command.toLowerCase();
        if (command.startsWith(PREFIX)) {
            command = command.replace(PREFIX, "");
        } else {
            return;
        }

        if (Commands.exists(command)) {
            try {
                Commands.execute(command, message, args, client);
            } catch (error) {
                log("message_error:", error);
                message.reply({
                    content: "There was an error while executing this command!"
                });
            }
        } else {
            message.reply("Unknown command: `" + command + "`");
        }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = Commands.exists(interaction.commandName);
        if (!command) {
            log(`interaction_error: No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await Commands.execute(
                interaction.commandName,
                interaction,
                [],
                client
            );
        } catch (error) {
            log("interaction_error:", error);
            await interaction.followUp({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            });
        }
    });
}

Commands.build(path.join(__dirname, "./commands")).then(async () => {
    await Commands.registerSlashCommands(
        process.env.CLIENTID, process.env.BTOKEN
    );
    log("all commands loaded");

    listenToCommands();
    client.login(process.env.BTOKEN);
    log("ready\n");
});