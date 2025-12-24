import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";

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
    log(`logged in as ${readyClient.user.tag}`);
});

const Commands = new CommandsBuilder();
const PREFIX = process.env.PREFIX || "!";

const listenToCommands = () => {
    client.on("messageCreate", async (message) => {
        const content = message.content.toLowerCase();
        if (!content.startsWith(PREFIX)) return;
        const [command, ...args] = content.replace(PREFIX, "").split(" ");

        if (Commands.exists(command)) {
            try {
                Commands.execute(command, message, args);
            } catch (error) {
                log("message_error:", error);
                message.reply({
                    content: 'There was an error while executing this command!'
                });
            }
            Commands.execute(command, message, args);
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
            await Commands.execute(interaction.commandName, interaction, []);
        } catch (error) {
            log("interaction_error:", error);
            await interaction.followUp({
                content: 'There was an error while executing this command!',
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