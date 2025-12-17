````md
# 💧 Lasquinha Reminder

Bot do Discord desenvolvido em **Node.js** para registrar consumo de água e gerar **rankings diários e semanais**, utilizando dados persistidos em **PostgreSQL**.

Além dos **slash commands**, o bot possui um **lembrete por voz**: ele detecta um canal de voz com pessoas e toca um **áudio personalizado** (arquivo local) em intervalos configuráveis.

---

## 📦 Tecnologias utilizadas

- **Node.js** (recomendado v18+)
- **discord.js** (v15+ recomendado)
- **PostgreSQL**
- **dotenv** (variáveis de ambiente)

### 🔊 Stack de voz (Voice Reminder)
- `@discordjs/voice`
- `prism-media`
- `ffmpeg-static`
- `@snazzah/davey` (necessário para o protocolo DAVE do Discord)

---

## 🧱 Arquitetura do projeto

```txt
src/
├── commands/
│   ├── agua.slash.js            # Definição do comando /agua
│   ├── agua.handler.js          # Lógica do comando /agua
│   ├── ranking.slash.js         # Definição do comando /ranking
│   └── ranking.handler.js       # Lógica do comando /ranking
│
├── db/
│   ├── index.js                 # Pool de conexão com PostgreSQL
│   └── schema.sql               # Estrutura do banco
│
├── voiceReminder.js             # Lembrete por voz (entra na call e toca áudio)
├── deploy-commands.js           # Registro dos slash commands
├── clear-commands.js            # Limpeza dos slash commands
└── index.js                     # Entrada principal da aplicação
````

---

## ⚙️ Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DISCORD_TOKEN=seu_token_do_bot
CLIENT_ID=id_da_aplicacao_no_discord
GUILD_ID=id_do_servidor_para_slash_commands
DATABASE_URL=postgresql://user:password@host:port/database

# Voice Reminder (novo)
VOICE_INTERVAL_MS=1200000
VOICE_AUDIO_PATH=src/assets/toma-agua.mp3
```

### Variáveis obrigatórias

| Variável      | Descrição                                               |
| ------------- | ------------------------------------------------------- |
| DISCORD_TOKEN | Token do bot do Discord                                 |
| CLIENT_ID     | ID da aplicação no Discord Developer Portal             |
| GUILD_ID      | ID do servidor onde os slash commands serão registrados |
| DATABASE_URL  | URL de conexão com o PostgreSQL                         |

### Variáveis do Voice Reminder

| Variável          | Descrição                                                   |
| ----------------- | ----------------------------------------------------------- |
| VOICE_INTERVAL_MS | Intervalo em **ms** (ex: 600000 = 10 min; 1200000 = 20 min) |
| VOICE_AUDIO_PATH  | Caminho do arquivo de áudio (mp3/wav/ogg)                   |

---

## 🗄️ Banco de dados

O banco utiliza **UTC como padrão** para todos os registros de data/hora.
A conversão para o timezone `America/Sao_Paulo` é feita **apenas na leitura**, no backend.

### Estrutura das tabelas

```sql
CREATE TABLE IF NOT EXISTS users (
  discord_id VARCHAR PRIMARY KEY,
  username VARCHAR NOT NULL,
  total_ml INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_drink TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drinks (
  id SERIAL PRIMARY KEY,
  discord_id VARCHAR NOT NULL,
  amount_ml INT NOT NULL,
  created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
);
```

---

## 🔧 Instalação do projeto

### 1️⃣ Clonar o repositório

```bash
git clone <repo-url>
cd bot-agua-disc
```

### 2️⃣ Instalar dependências

```bash
npm install
```

> Se você quiser instalar explicitamente as libs principais:

```bash
npm install discord.js dotenv pg
npm install @discordjs/voice prism-media ffmpeg-static @snazzah/davey
```

---

## 🧩 Slash Commands (importante)

Este projeto **não registra slash commands automaticamente** ao iniciar o bot.

### 🔹 Registrar slash commands

```bash
node src/deploy-commands.js
```

### 🔹 Limpar todos os comandos slash

```bash
node src/clear-commands.js
```

---

## 🔊 Voice Reminder (áudio na call)

### Requisitos no Discord

O bot precisa das permissões no canal de voz:

* **Connect (Conectar)**
* **Speak (Falar)**

### Requisitos no código

O client precisa do intent:

* `GatewayIntentBits.GuildVoiceStates`

### Como funciona

* A cada `VOICE_INTERVAL_MS`, o bot procura um canal de voz com pessoas (não-bot).
* Se tiver permissão, ele entra, toca o arquivo configurado em `VOICE_AUDIO_PATH` e sai ao terminar.

---

## ▶️ Executando o bot

```bash
node src/index.js
```

Se tudo estiver correto, o terminal exibirá:

```txt
🤖 Bot online como <nome-do-bot>
```

---

## 📊 Comandos disponíveis

### `/agua`

Registrar consumo de água.

### `/ranking`

Visualizar ranking de consumo.

---

## 📌 Observações finais

* Ranking é calculado **via consulta**, não armazenado em tabela.
* O projeto prioriza:

  * baixo custo
  * simplicidade
  * manutenção fácil
  * escalabilidade gradual

Este repositório pode ser usado tanto para uso pessoal quanto como base para evolução futura.