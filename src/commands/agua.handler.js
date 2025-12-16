const pool = require('../db');

const MAPA_ML = {
  gole: 20,
  golao: 50,
  copo: 200,
  garrafinha: 1500,
  garrafa: 2000,
  garrafao: 5000
};

async function handleAgua(interaction) {
  const tipo = interaction.options.getString('tipo');
  const ml = interaction.options.getInteger('ml');

  let amount;

  if (ml) {
    amount = ml;
  } else if (tipo && MAPA_ML[tipo]) {
    amount = MAPA_ML[tipo];
  } else {
    return interaction.reply({
      content: '💧 Escolha um tipo ou informe a quantidade em ml.',
      ephemeral: true
    });
  }

  const { id, username } = interaction.user;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO users (discord_id, username, total_ml, last_drink)
      VALUES ($1, $2, $3, NOW() AT TIME ZONE 'UTC')
      ON CONFLICT (discord_id)
      DO UPDATE SET
        total_ml = users.total_ml + $3,
        last_drink = NOW() AT TIME ZONE 'UTC',
        username = EXCLUDED.username
      `,
      [id, username, amount]
    );

    await client.query(
      `
      INSERT INTO drinks (discord_id, amount_ml, created_at)
      VALUES ($1, $2, NOW() AT TIME ZONE 'UTC')
      `,
      [id, amount]
    );

    await client.query('COMMIT');

    await interaction.reply(`💧 **${amount} ml** registrados com sucesso!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    await interaction.reply('❌ Erro ao registrar consumo de água.');
  } finally {
    client.release();
  }
}

module.exports = { handleAgua };
