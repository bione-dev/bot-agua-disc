const { SlashCommandBuilder } = require('discord.js');

module.exports = new SlashCommandBuilder()
  .setName('ranking')
  .setDescription('Ver ranking de consumo de água')
  .addStringOption(option =>
    option
      .setName('periodo')
      .setDescription('Período do ranking')
      .setRequired(true)
      .addChoices(
        { name: 'Diário', value: 'diario' },
        { name: 'Semanal', value: 'semanal' }
      )
  );
