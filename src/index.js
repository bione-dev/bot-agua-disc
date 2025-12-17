require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { startWaterVoiceReminder } = require("./voiceReminder");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// discord.js v15
client.once("clientReady", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  startWaterVoiceReminder(client);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "agua") {
    const { handleAgua } = require("./commands/agua.handler");
    await handleAgua(interaction);
    return;
  }

  if (interaction.commandName === "ranking") {
    const { handleRanking } = require("./commands/ranking.handler");
    await handleRanking(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);