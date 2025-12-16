const { SlashCommandBuilder } = require('discord.js');

module.exports = new SlashCommandBuilder()
  .setName('agua')
  .setDescription('Registrar consumo de água')
  .addStringOption(option =>
    option
      .setName('tipo')
      .setDescription('Tipo de consumo')
      .setRequired(false)
      .addChoices(
        { name: 'Gole (20ml)', value: 'gole' },
        { name: 'Golão (50ml)', value: 'golao' },
        { name: 'Copo (200ml)', value: 'copo' },
        { name: 'Garrafinha (1,5L)', value: 'garrafinha' },
        { name: 'Garrafa (2L)', value: 'garrafa' },
        { name: 'Garrafão (5L)', value: 'garrafao' }
      )
  )
  .addIntegerOption(option =>
    option
      .setName('ml')
      .setDescription('Quantidade em ml (opcional)')
      .setRequired(false)
  );
