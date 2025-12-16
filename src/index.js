require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'agua') {
    const { handleAgua } = require('./commands/agua.handler');
    await handleAgua(interaction);
  }

  if (interaction.commandName === 'ranking') {
    const { handleRanking } = require('./commands/ranking.handler');
    await handleRanking(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
