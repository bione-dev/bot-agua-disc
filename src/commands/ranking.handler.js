const pool = require('../db');

async function handleRanking(interaction) {
  const periodo = interaction.options.getString('periodo');

  let query;

  if (periodo === 'diario') {
    query = `
      SELECT
  u.username,
  SUM(d.amount_ml) AS total_ml,
  COUNT(d.id) AS vezes,
  MAX(d.created_at) - MIN(d.created_at) AS intervalo
FROM drinks d
JOIN users u ON u.discord_id = d.discord_id
WHERE d.created_at >=
      date_trunc(
        'day',
        (NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo'
      )
      AT TIME ZONE 'America/Sao_Paulo'
      AT TIME ZONE 'UTC'
GROUP BY u.username
ORDER BY total_ml DESC
LIMIT 10;
    `;
  } else {
    query = `
      SELECT
        u.username,
        SUM(d.amount_ml) AS total_ml,
        COUNT(d.id) AS vezes,
        MAX(d.created_at) - MIN(d.created_at) AS intervalo
      FROM drinks d
      JOIN users u ON u.discord_id = d.discord_id
      WHERE d.created_at >=
            (NOW() AT TIME ZONE 'UTC') - INTERVAL '7 days'
      GROUP BY u.username
      ORDER BY total_ml DESC
      LIMIT 10;
    `;
  }

  const { rows } = await pool.query(query);

  if (!rows.length) {
    return interaction.reply('🚫 Nenhum registro encontrado para esse período.');
  }

  let resposta =
    `🏆 **Ranking ${periodo === 'diario' ? 'Diário' : 'Semanal'}**\n\n`;

  rows.forEach((row, index) => {
    resposta +=
      `**${index + 1}. ${row.username}**\n` +
      `💧 ${row.total_ml} ml | 🥤 ${row.vezes} vezes\n\n`;
  });

  await interaction.reply(resposta);
}

module.exports = { handleRanking };
