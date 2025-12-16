require('dotenv').config();
const { REST, Routes } = require('discord.js');
const aguaCommand = require('./commands/agua.slash');
const rankingComand = require('./commands/ranking.slash');

const commands = [
  aguaCommand.toJSON(),
  rankingComand.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🚀 Registrando slash commands...');

    await rest.put(
  Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    process.env.GUILD_ID
  ),
  { body: commands }
);

    console.log('✅ Slash commands registrados!');
  } catch (error) {
    console.error('❌ Erro ao registrar slash commands:', error);
  }
})();
