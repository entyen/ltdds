const {
  Collection,
  Client,
  REST,
  Routes,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ActivityType,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js")
const config = require("./config.json")

//database connection
const mongoose = require("mongoose")
const { user } = require("./schema")
const userdb = mongoose.model("user", user)

const bot = new Client({
  intents: [
    "Guilds",
    "GuildVoiceStates",
    "GuildMessages",
    "GuildMembers",
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
})

bot.login(config.TOKEN)

bot.on("ready", async () => {
  console.log("Bot is ready!")
  bot.user.setActivity("", {
    type: ActivityType.Playing,
  })

  const commands = [
    new SlashCommandBuilder()
      .setName("кадр")
      .setDescription("Выдача ролей")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Выберите пользователя")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("action")
          .setDescription("Выберите действие")
          .setRequired(true)
          .addChoices(
            {
              name: "Принял",
              value: "invite",
            },
            {
              name: "Уволил",
              value: "fire",
            }
          )
      )
      .addNumberOption((option) =>
        option
          .setName("passport")
          .setDescription("Введите номер паспорта")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(268435456),
    new SlashCommandBuilder()
      .setName("аудит")
      .setDescription("Аудит повышение | понижение")
      .addStringOption((option) =>
        option
          .setName("action")
          .setDescription("Выберите действие")
          .setRequired(true)
          .addChoices(
            {
              name: "Повысить",
              value: "up",
            },
            {
              name: "Понизить",
              value: "down",
            },
            {
              name: "Перевод",
              value: "transfer",
            }
          )
      )
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Выберите должность")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Выберите пользователя")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(268435456),
  ]

  bot.guilds.cache.forEach(async (guild) => {
    const rest = new REST({ version: "9" }).setToken(config.TOKEN)
    try {
      await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), {
        body: commands,
      })
    } catch (error) {
      console.error(error)
    }
  })
})

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return
  const cmd = interaction.commandName
  const opt = interaction.options
  const nickName = interaction.guild.members.cache.get(interaction.user.id)
  if (cmd === "кадр") {
    let action = opt.getString("action")
    let actionRu = action === "invite" ? "принял" : "уволил"
    const user = interaction.guild.members.cache.get(opt.getUser("user").id)
    const embed = new EmbedBuilder()
      .setTitle("Кадровое дело")
      .setDescription(
        `Пользователь ${nickName} ${actionRu} пользователя ${user}\n\n Паспорт: **${opt.getNumber(
          "passport"
        )}**`
      )
      .setTimestamp(Date.now())
      .setColor(`${action === "invite" ? "91cb00" : "c00009"}`)
      .setImage(
        `${
          action === "invite"
            ? "https://media.discordapp.net/attachments/1070730397618552932/1084232740867686480/LTD.png"
            : "https://media.discordapp.net/attachments/1070730397618552932/1084234417884643358/LTD2.png"
        }`
      )
    if (action === "invite") {
      try {
        await userdb.create({
          discordID: user.id,
          passport: opt.getNumber("passport"),
          access: 0,
        })
        await user.roles.remove("1083769716977455134")
        await user.roles.add("1083871221759877171")
      } catch (error) {
        if (error.code === 11000) {
          await interaction.reply({
            content: "Пользователь уже есть в базе данных",
            ephemeral: true,
          })
        } else {
          console.log(error)
          await interaction.reply({
            content: `Произошла ошибка \n\`${error.message}\``,
            ephemeral: true,
          })
        }
        return
      }
    } else {
      user._roles.forEach(async (role) => {
        try {
          await user.roles.remove(role)
        } catch (error) {
          console.log(error)
        }
      })
      await user.roles.add("1083769716977455134")
    }

    await interaction.reply({
      embeds: [embed],
    })
  }
  if (cmd === "аудит") {
    let action = opt.getString("action")
    let actionRu =
      action === "up" ? "повысил" : action === "down" ? "понизил" : "перевел"
    let position = opt.getRole("role")
    const user = interaction.guild.members.cache.get(opt.getUser("user").id)
    const embed = new EmbedBuilder()
      .setTitle("Аудит")
      .setDescription(
        `Пользователь ${nickName} ${actionRu} пользователя ${user} на должность ${position.name}`
      )
      .setTimestamp(Date.now())
      .setColor(
        `${
          action === "up" ? "00ff8a" : action === "down" ? "ff6d00" : "1200c0"
        }`
      )
      .setImage(
        `${
          action === "up"
            ? "https://media.discordapp.net/attachments/1070730397618552932/1084241352084176906/LTD5.png"
            : action === "down"
            ? "https://media.discordapp.net/attachments/1070730397618552932/1084241352277106728/LTD4.png"
            : "https://media.discordapp.net/attachments/1070730397618552932/1084235645188325406/LTD3.png"
        }`
      )
    const pos = []
    nickName._roles.forEach((role) => {
      pos.push(
        bot.guilds.cache.get(interaction.guild.id).roles.cache.get(role)
          .rawPosition
      )
    })
    pos.sort((a, b) => b - a)
    if (pos[0] <= position.rawPosition && pos[0] >= 9) {
      await interaction.reply({
        content: "Нельзя повысить выше своей должности",
        ephemeral: true,
      })
      return
    }
    await interaction.reply({
      embeds: [embed],
    })
  }
})

// uncaughtException
process.on("uncaughtException", function (err) {
  console.error(err)
})

//DataBase
mongoose
  .connect(
    `mongodb://${config.DBUSER}:${config.DBPASS}@${config.SERVER}/${config.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected!!")
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err)
  })
