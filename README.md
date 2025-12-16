```md
# 💧 Lasquinha Reminder

Bot do Discord desenvolvido em **Node.js** para registrar consumo de água e gerar **rankings diários e semanais**, utilizando dados persistidos em **PostgreSQL**.

O projeto utiliza **slash commands**, arquitetura simples e padronização de timezone para evitar inconsistências de horário.

---

## 📦 Tecnologias utilizadas

- **Node.js** (recomendado v18+)
- **discord.js** (v14+)
- **PostgreSQL**
- **Railway** (deploy e banco de dados)
- **dotenv** (variáveis de ambiente)

---

## 🧱 Arquitetura do projeto

```

src/
├── commands/
│   ├── agua.slash.js        # Definição do comando /agua
│   ├── agua.handler.js      # Lógica do comando /agua
│   ├── ranking.slash.js     # Definição do comando /ranking
│   └── ranking.handler.js  # Lógica do comando /ranking
│
├── db/
│   ├── index.js             # Pool de conexão com PostgreSQL
│   └── schema.sql           # Estrutura do banco
│
├── deploy-commands.js       # Registro dos slash commands
├── clear-commands.js        # Limpeza dos slash commands
├── index.js                 # Entrada principal da aplicação

````

---

## ⚙️ Configuração do ambiente

As variáveis de ambiente **não ficam expostas no código** e devem ser configuradas manualmente.

Crie um arquivo `.env` na raiz do projeto:

```env
DISCORD_TOKEN=seu_token_do_bot
CLIENT_ID=id_da_aplicacao_no_discord
GUILD_ID=id_do_servidor_para_slash_commands
DATABASE_URL=postgresql://user:password@host:port/database
````

### Variáveis obrigatórias

| Variável      | Descrição                                               |
| ------------- | ------------------------------------------------------- |
| DISCORD_TOKEN | Token do bot do Discord                                 |
| CLIENT_ID     | ID da aplicação no Discord Developer Portal             |
| GUILD_ID      | ID do servidor onde os slash commands serão registrados |
| DATABASE_URL  | URL de conexão com o PostgreSQL                         |

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

### 1️⃣ Instalar Node.js

Recomendado usar **Node.js v18 ou superior**.

👉 [https://nodejs.org/](https://nodejs.org/)

---

### 2️⃣ Clonar o repositório

```bash
git clone <repo-url>
cd bot-agua-disc
```

---

## 📚 Dependências do projeto

Antes de rodar o bot, instale as bibliotecas necessárias.

### Dependências principais

```bash
npm install discord.js dotenv node-cron pg
```

| Biblioteca | Descrição                                                  |
| ---------- | ---------------------------------------------------------- |
| discord.js | SDK oficial para interação com a API do Discord            |
| dotenv     | Gerenciamento de variáveis de ambiente                     |
| node-cron  | Agendamento de tarefas (reservado para futuras automações) |
| pg         | Cliente PostgreSQL para Node.js                            |

### Dependência de desenvolvimento (opcional)

```bash
npm install -D nodemon
```

| Biblioteca | Descrição                                                   |
| ---------- | ----------------------------------------------------------- |
| nodemon    | Reinicia automaticamente a aplicação ao detectar alterações |

---

### ▶️ Executando com nodemon (opcional)

Durante o desenvolvimento:

```bash
npx nodemon src/index.js
```

---

### 3️⃣ Instalar dependências (caso ainda não tenha rodado)

```bash
npm install
```

---

## 🧩 Slash Commands (importante)

Este projeto **não registra slash commands automaticamente** ao iniciar o bot.

### 🔹 Registrar slash commands

Sempre que:

* o projeto for executado pela primeira vez
* um novo comando slash for criado
* um comando existente for alterado

Execute:

```bash
node src/deploy-commands.js
```

---

### 🔹 Adicionar novos comandos slash

1. Criar o arquivo do comando em:

   ```
   src/commands/
   ```
2. Importar o comando no arquivo:

   ```
   src/deploy-commands.js
   ```
3. Executar:

   ```bash
   node src/clear-commands.js
   node src/deploy-commands.js
   ```

> Isso evita comandos duplicados ou inconsistentes no Discord.

---

### 🔹 Limpar todos os comandos slash

```bash
node src/clear-commands.js
```

---

## ▶️ Executando o bot

Para iniciar a aplicação:

```bash
node src/index.js
```

Se tudo estiver correto, o terminal exibirá:

```
🤖 Bot online como <nome-do-bot>
```

---

## 📊 Comandos disponíveis

### `/agua`

Registrar consumo de água.

Exemplos:

```
/agua tipo:gole
/agua tipo:garrafa
/agua ml:350
```

---

### `/ranking`

Visualizar ranking de consumo.

```
/ranking periodo:diario
/ranking periodo:semanal
```

---

## 🔮 Futuras implementações

* Estatísticas avançadas de consumo
* Sistema de streak diário
* Rankings mensais
* **Algo relacionado ao bot entrar na call e falar um texto personalizado lembrando de beber água**

---

## 📌 Observações finais

* Ranking é calculado **via consulta**, não armazenado em tabela
* O projeto prioriza:

  * baixo custo
  * simplicidade
  * manutenção fácil
  * escalabilidade gradual

Este repositório pode ser usado tanto para uso pessoal quanto como base para evolução futura.
