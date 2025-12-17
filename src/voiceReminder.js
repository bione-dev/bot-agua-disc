// src/voiceReminder.js
const path = require("path");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

function canJoinAndSpeak(channel, me) {
  const perms = channel.permissionsFor(me);
  return (
    perms?.has(PermissionFlagsBits.Connect) &&
    perms?.has(PermissionFlagsBits.Speak)
  );
}

async function pickVoiceChannelByVoiceStates(client) {
  // garante guilds e canais carregados
  await client.guilds.fetch().catch(() => null);

  for (const guild of client.guilds.cache.values()) {
    await guild.channels.fetch().catch(() => null);

    const me =
      guild.members.me ?? (await guild.members.fetchMe().catch(() => null));
    if (!me) continue;

    // Mapa: channelId -> quantidade de humanos na call
    const counts = new Map();

    for (const vs of guild.voiceStates.cache.values()) {
      if (!vs.channelId) continue;

      const isBot = vs.member?.user?.bot === true;
      if (isBot) continue;

      counts.set(vs.channelId, (counts.get(vs.channelId) || 0) + 1);
    }

    // DEBUG: mostra o que o bot está enxergando nesse servidor
    console.log(
      `[voice] guild="${guild.name}" voiceStates=${guild.voiceStates.cache.size} callsAtivas=${counts.size}`
    );

    // pega a call com mais humanos, e onde o bot pode falar
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

    for (const [channelId, humanCount] of sorted) {
      const ch = guild.channels.cache.get(channelId);
      if (!ch) continue;

      const isVoice =
        ch.type === ChannelType.GuildVoice ||
        ch.type === ChannelType.GuildStageVoice;

      if (!isVoice) continue;
      if (!canJoinAndSpeak(ch, me)) {
        console.log(`[voice] sem permissão em #${ch.name} (humans=${humanCount})`);
        continue;
      }

      console.log(`[voice] alvo escolhido: #${ch.name} (humans=${humanCount})`);
      return ch;
    }
  }

  return null;
}

function startWaterVoiceReminder(client) {
  const intervalMs = Number(process.env.VOICE_INTERVAL_MS || 10000);
  const audioFile = process.env.VOICE_AUDIO_PATH || "src/assets/toma-agua.mp3";

  const audioPath = path.isAbsolute(audioFile)
    ? audioFile
    : path.join(process.cwd(), audioFile);

  let isPlaying = false;

  const playOnce = async () => {
    if (isPlaying) return;

    console.log("[voice] tick: procurando call com gente...");
    const channel = await pickVoiceChannelByVoiceStates(client);

    if (!channel) {
      console.log("[voice] nenhuma call detectada (ou sem permissão).");
      return;
    }

    isPlaying = true;

    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 15_000);

      const player = createAudioPlayer();
      const resource = createAudioResource(audioPath);

      connection.subscribe(player);
      player.play(resource);

      player.once(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        isPlaying = false;
      });

      player.on("error", (err) => {
        console.log("[voice] erro no player:", err.message);
        connection.destroy();
        isPlaying = false;
      });
    } catch (e) {
      console.log("[voice] falha ao entrar/tocar:", e?.message || e);
      isPlaying = false;
    }
  };

  // roda na hora + a cada X ms
  playOnce();
  setInterval(playOnce, intervalMs);

  console.log(`[voice] Reminder ativo a cada ${intervalMs}ms`);
}

module.exports = { startWaterVoiceReminder };
