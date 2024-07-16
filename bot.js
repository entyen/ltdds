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
    Message,
  } = require("discord.js")

  require('dotenv').config()
  
  //database connection
  const mongoose = require("mongoose")
  const { user } = require("./schema")
  const userdb = mongoose.model("user", user)
  const { state } = require("./schema1")
  const userdb1 = mongoose.model("state", state)
  
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
  
  bot.login(process.env.BOT_TOKEN)
  
  bot.on("ready", async () => {
    console.log("Bot is ready!")
    bot.user.setActivity("", {
      type: ActivityType.Playing,
    })
  
    const commands = [
      new SlashCommandBuilder()
        .setName("кадр")
        .setDescription("Принятие/увольнение")
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
      .setDescription("Аудит: повышение/понижение/перевод")
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
    new SlashCommandBuilder()
        .setName("аренда")
        .setDescription("Аренда")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Выберите транспорт:")
            .setRequired(true)
            .addChoices(
              {
                name: "Benefactor ASG P-One",
                value: "One",
              },
              {
                name: "Benefactor G63 ASG 6x6",
                value: "6x6",
              },
              {
                name: "Ubermacht W2 G87",
                value: "W2",
              }
            )
        )
        .addNumberOption((option) =>
          option
            .setName("time")
            .setDescription("Укажите время:")
            .setRequired(true)
            .setMaxValue(100).setMinValue(1)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Выберите пользователя")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("cost")
            .setDescription("Укажите стоимость:")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(268435456),
      new SlashCommandBuilder()
        .setName("инфоавто")
        .setDescription("Инфо по ТС")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Выберите транспорт:")
            .setRequired(true)
            .addChoices(
              {
                name: "Общая",
                value: "All",
              },
              {
                name: "Benefactor ASG P-One",
                value: "One",
              },
              {
                name: "Benefactor G63 ASG 6x6",
                value: "6x6",
              },
              {
                name: "Ubermacht W2 G87",
                value: "W2",
              }
            )
        )
      .setDefaultMemberPermissions(268435456),
      new SlashCommandBuilder()
        .setName("скидка")
        .setDescription("Добавление/удаление/изменение скидки")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Выберите скидку:")
            .setRequired(true)
            .addChoices(
              {
                name: "Убрать скидку",
                value: "Del",
              },
              {
                name: "Скидка 5%",
                value: "S5",
              },
              {
                name: "Скидка 10%",
                value: "S10",
              },
              {
                name: "Скидка 20%",
                value: "S20",
              },
              {
                name: "Скидка 30%",
                value: "S30",
              },
              {
                name: "Скидка 40%",
                value: "S40",
              },
              {
                name: "Скидка 50%",
                value: "S50",
              }
            )
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Выберите пользователя")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("why")
            .setDescription("Укажите причину:")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("doc")
            .setDescription("Ссылка на доказательства:")
            .setRequired(true)
        )
      .setDefaultMemberPermissions(268435456),
      new SlashCommandBuilder()
        .setName("инфо")
        .setDescription("Инфо о пользователе")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Выберите пользователя")
            .setRequired(true)
        )
      .setDefaultMemberPermissions(268435456),
      new SlashCommandBuilder()
        .setName("доступ")
        .setDescription("Смена уровня доступа")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Выберите пользователя")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("dost")
            .setDescription("Укажите уровень доступа:")
            .setRequired(true)
            .setMaxValue(9).setMinValue(0)
        )
        .addStringOption((option) =>
          option
            .setName("why")
            .setDescription("Укажите причину:")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("doc")
            .setDescription("Ссылка на доказательства:")
            .setRequired(true)
        )
      .setDefaultMemberPermissions(268435456),
    ]
  
    bot.guilds.cache.forEach(async (guild) => {
      const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN)
      try {
        await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), {
          body: commands,
        })
      } catch (error) {
        console.error(error)
      }
    })
  })
  
  bot.on("interactionCreate", async (inter) => {
    if (!inter.isCommand()) return
    const cmd = inter.commandName
    const opt = inter.options
    const nickName = inter.guild.members.cache.get(inter.user.id)
    const iUser = await userdb.findOne({ discordID: inter.user.id })
    const iState = await userdb1.findOne({ stateid: "777" })
    //console.log(iUser)
    if (cmd === "кадр") {
      if (!iUser || iUser.access < 5) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      let action = opt.getString("action")
      let actionRu = action === "invite" ? "принял" : "уволил"
      const user = inter.guild.members.cache.get(opt.getUser("user").id)
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
            await inter.reply({
              content: "Пользователь не был корректно уволен, обратитесь к начальству!",
              ephemeral: true,
            })
          } else {
            console.log(error)
            await inter.reply({
              content: `Произошла ошибка \n\`${error.message}\``,
              ephemeral: true,
            })
          }
          return
        }
      } else {
        await userdb.deleteOne({ discordID: user.id })  
        user._roles.forEach(async (role) => {
          try {
            await user.roles.remove(role)
          } catch (error) {
            console.log(error)
          }
        })
        await user.roles.add("1083769716977455134")
      }
  
      await inter.reply({
        embeds: [embed],
      })
    }
    if (cmd === "аудит") {
      if (!iUser || iUser.access < 5) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      let action = opt.getString("action")
      let actionRu =
        action === "up" ? "повысил" : action === "down" ? "понизил" : "перевел"
      let position = opt.getRole("role")
      const user = inter.guild.members.cache.get(opt.getUser("user").id)
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
          bot.guilds.cache.get(inter.guild.id).roles.cache.get(role)
            .rawPosition
        )
      })
      pos.sort((a, b) => b - a)
      if (pos[0] <= position.rawPosition && pos[0] >= 9) {
        await inter.reply({
          content: "Нельзя повысить выше своей должности",
          ephemeral: true,
        })
        return
      }
      await inter.reply({
        embeds: [embed],
      })
    }
    if (cmd === "аренда") {
      if (!iUser || iUser.access < 5) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
        let action = opt.getString("name")
        if (action === "One" && iState.state1 === 1) return await inter.reply({content: "Benefactor ASG P-One занят!", ephemeral: true, })
        if (action === "6x6" && iState.state2 === 1) return await inter.reply({content: "Benefactor G63 ASG 6x6 занят!", ephemeral: true, })
        if (action === "W2" && iState.state3 === 1) return await inter.reply({content: "Ubermacht W2 G87 занят!", ephemeral: true, })
        let actionRu =
          action === "One" ? "Benefactor ASG P-One" : action === "6x6" ? "Benefactor G63 ASG 6x6" : "Ubermacht W2 G87"
        const user = inter.guild.members.cache.get(opt.getUser("user").id)
        var chas = "час"
        switch (opt.getNumber("time")) {
          case 1: case 21: case 31: case 41: case 51: case 61: case 71: case 81: case 91:
            chas="час";
            break;
          case 2: case 22: case 32: case 42: case 52: case 62: case 72: case 82: case 92:
          case 3: case 23: case 33: case 43: case 53: case 63: case 73: case 83: case 93:
          case 4: case 24: case 34: case 44: case 54: case 64: case 74: case 84: case 94:
            chas="часа";
            break;
          default:
            chas="часов";
        }
        const embed = new EmbedBuilder()
          .setTitle("Аренда")
          .setDescription(
            `Пользователь ${nickName} \n арендовал **${actionRu}** \n пользователю ${user} \n на **${opt.getNumber("time")}** ${chas} за **$${opt.getString("cost")}**.`
          )
          .setTimestamp(Date.now())
          .setColor(
            `${
              action === "One" ? "00ff8a" : action === "6x6" ? "ff6d00" : "1200c0"
            }`
          )
          .setImage(
            `${
              action === "One"
                ? "https://media.discordapp.net/attachments/989487322548555837/1076397859039105084/M6003Mercedes-AMGONE_1_WIDEEDIT_2000x850_crop_center.png"
                : action === "6x6"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121375253587832862/201912032103__03288ee4.png"
                : "https://media.discordapp.net/attachments/994556652621664356/1121376078263488532/attachment.png"
            }`
          )
      if (action === "One")
      await userdb1.findOneAndUpdate({stateid: "777"}, { $set: {state1: 1}});
      else if (action === "6x6")
      await userdb1.findOneAndUpdate({stateid: "777"}, { $set: {state2: 1}});
      else await userdb1.findOneAndUpdate({stateid: "777"}, { $set: {state3: 1}});
      let istate1 =
        iState.state1 === 0 ? "СВОБОДЕН" : "ЗАНЯТ"
      let istate2 =
        iState.state2 === 0 ? "СВОБОДЕН" : "ЗАНЯТ"
      let istate3 =
        iState.state3 === 0 ? "СВОБОДЕН" : "ЗАНЯТ"  
      let em1 =
        iState.state1 === 0 ? ":white_check_mark:" : ":no_entry:"
      let em2 =
        iState.state2 === 0 ? ":white_check_mark:" : ":no_entry:"
      let em3 =
        iState.state3 === 0 ? ":white_check_mark:" : ":no_entry:"
      const embed1 = new EmbedBuilder()
          .setTitle("Состояние аренды")
          .setDescription(
            `Состояние на текщий момент: \n
            ${em1} Benefactor ASG P-One: **${istate1}** \n 
            ${em2} Benefactor G63 ASG 6x6: **${istate2}** \n 
            ${em3} Ubermacht W2 G87:  **${istate3}** `
          )
          .setTimestamp(Date.now())
          .setColor(`${"00ff8a"}`)
          .setImage(`${"https://media.discordapp.net/attachments/1043074634586783744/1120061828379189399/3.png"}`)
      await inter.reply({
        embeds: [embed],
      })    
      const channel = await bot.channels.fetch("1123549218422931537");
      await channel.bulkDelete(1)
      await channel.send({
        embeds: [embed1],
      })
    }
    if (cmd === "инфоавто") {
      if (!iUser || iUser.access < 0) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      let action = opt.getString("name")
      let actionRu =
          action === "One" ? "Benefactor ASG P-One" : action === "6x6" ? "Benefactor G63 ASG 6x6" : action === "W2" ? "Ubermacht W2 G87" : "На данный момент в аренде:"
      let ves =
          action === "One" ? "Багажник: **10 кг**" : action === "6x6" ? "Багажник: **230 кг**" : action === "W2" ? "Багажник: **70 кг**" : "Benefactor ASG P-One"
      let speed =
          action === "One" ? "Скорость: **460 км/ч**" : action === "6x6" ? "Скорость: **275 км/ч**" : action === "W2" ? "Скорость: **310 км/ч**" : "Benefactor G63 ASG 6x6"
      let cost =
          action === "One" ? "Цена за час: **$6.000**" : action === "6x6" ? "Цена за час: **$7.000**" : action === "W2" ? "Цена за час: **$4.000**" : "Ubermacht W2 G87"
      const embed = new EmbedBuilder()
        .setTitle("Информация по транспорту")
        .setDescription(
          `${actionRu} : \n
          ${ves} \n
          ${speed} \n
          ${cost}`
        )
        .setTimestamp(Date.now())
        .setColor(
            `${
              action === "One" ? "00ff8a" : action === "6x6" ? "ff6d00" : action === "W2" ? "1200c0" : "7a00c0"
            }`
        )
        .setImage(
            `${
              action === "One"
                ? "https://media.discordapp.net/attachments/989487322548555837/1076397859039105084/M6003Mercedes-AMGONE_1_WIDEEDIT_2000x850_crop_center.png"
                : action === "6x6"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121375253587832862/201912032103__03288ee4.png"
                : action === "W2"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121376078263488532/attachment.png"
                : "https://media.discordapp.net/attachments/1043074634586783744/1120061828379189399/3.png"
            }`
          )   
      await inter.reply({
        embeds: [embed],
      })
    } 
    if (cmd === "скидка") {
      if (!iUser || iUser.access < 6) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      let action = opt.getString("name")
      let actionRu =
          action === "S5" ? "добавил скидку 5%" : action === "S10" ? "добавил скидку 10%" : action === "S20" ? "добавил скидку 20%" : action === "S30" ? "добавил скидку 30%"
          : action === "S40" ? "добавил скидку 40%" : action === "S50" ? "добавил скидку 50%" : "удалил все скидки"
      const user = inter.guild.members.cache.get(opt.getUser("user").id)
      const embed = new EmbedBuilder()
        .setTitle("Отчет по скидке")
        .setDescription(`Пользователь ${nickName}\n **${actionRu}**\n пользователю ${user}\n Причина: **${opt.getString("why")}** \n Доказательства: *${opt.getString("doc")}*`)
        .setTimestamp(Date.now())
        .setColor(
            `${
              action === "S5" ? "ffffff" : action === "S10" ? "81ba00" : action === "S20" ? "1800ff" : action === "S30" ? "9919e2"
              : action === "S40" ? "fff907" : action === "S50" ? "ff6a07" : "ff0000"
            }`
        )
        .setImage(
            `${
              action === "S5"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121695631078080513/depositphotos_43762725-stock-photo-red-five-percent-off-discount.png"
                : action === "S10"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121697119653339157/depositphotos_54860041-stock-photo-10-percent-with-hearts.png"
                : action === "S20"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121697213349892137/depositphotos_54860095-stock-photo-20-percent-with-hearts.png"
                : action === "S30"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121697261668270130/depositphotos_54860179-stock-photo-30-percent-with-hearts.png"
                : action === "S40"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121697987572285450/depositphotos_54860243-stock-photo-40-percent-with-hearts.png"
                : action === "S50"
                ? "https://media.discordapp.net/attachments/994556652621664356/1121698039342571560/depositphotos_54860285-stock-photo-50-percent-with-hearts.png"
                : "https://media.discordapp.net/attachments/994556652621664356/1121698776072061021/depositphotos_65048959-stock-photo-red-0-percent.png"
            }`
          ) 
        switch (action) {
          case "S5":
            await user.roles.remove("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.add("1121681617929388114");
            break;
          case "S10":
            await user.roles.remove("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.add("1121681479576080448")
            await user.roles.remove("1121681617929388114");
            break;
          case "S20":
            await user.roles.remove("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.add("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.remove("1121681617929388114");
            break;
          case "S30":
            await user.roles.remove("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.add("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.remove("1121681617929388114");
            break;
          case "S40":
            await user.roles.remove("1121680668884222044")
            await user.roles.add("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.remove("1121681617929388114");
            break;
          case "S50":
            await user.roles.add("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.remove("1121681617929388114");
            break;
          default:
            await user.roles.remove("1121680668884222044")
            await user.roles.remove("1121681050800762951")
            await user.roles.remove("1121681206363295744")
            await user.roles.remove("1121681347119951963")
            await user.roles.remove("1121681479576080448")
            await user.roles.remove("1121681617929388114");
        }
      await inter.reply({
        embeds: [embed],
      })
    }
    if (cmd === "инфо") {
      if (!iUser || iUser.access < 5) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      const user = inter.guild.members.cache.get(opt.getUser("user").id)
      const iUser1 = await userdb.findOne({ discordID: user.id })
      if (!iUser1) return await inter.reply({content: "Пользователь не является сотрудником LTD!", ephemeral: true, })
      const embed = new EmbedBuilder()
        .setTitle("Кадровое дело")
        .setDescription(
          `Пользователь ${user}\n 
          Паспорт: **${iUser1.passport}**\n
          Доступ: **${iUser1.access}**`
        )
        .setTimestamp(Date.now())
        .setColor(`${"2929ff"}`)
        .setImage(`${"https://media.discordapp.net/attachments/994556652621664356/1122030116298555402/images.png?width=247&height=73"}`)
        await inter.reply({
        embeds: [embed],
      })
    }
    if (cmd === "доступ") {
      if (!iUser || iUser.access < 6) return await inter.reply({content: "Недостаточно прав!", ephemeral: true, })
      const user = inter.guild.members.cache.get(opt.getUser("user").id)
      const iUser1 = await userdb.findOne({ discordID: user.id })
      if (!iUser1) return await inter.reply({content: "Пользователь не является сотрудником LTD!", ephemeral: true, })
      if (!iUser || iUser.access < 8 && iUser.discordID === iUser1.discordID) return await inter.reply({content: "Нельзя изменить собственный уровень доступа!", ephemeral: true, })
      if (!iUser || iUser.access < 8 && iUser.access <= iUser1.access) return await inter.reply({content: "Нельзя изменить уровень доступа пользователю с тем же или большим уровнем доступа!", ephemeral: true, })
      if (!iUser || iUser.access < 8 && iUser.access <= opt.getNumber("dost")) return await inter.reply({content: "Нельзя устанавливать уровень доступа равный или превышающий собственный!", ephemeral: true, })
      const embed = new EmbedBuilder()
        .setTitle("Изменение доступа")
        .setDescription(
          `Пользователь ${nickName} \n изменил уровень доступа пользователя: \n
          Пользователь: ${user}\n 
          Паспорт: **${iUser1.passport}**\n
          Доступ: **${iUser1.access}** изменен на **${opt.getNumber("dost")}**\n
          Причина: **${opt.getString("why")}**\n
          Доказательства: *${opt.getString("doc")}*`
        )
        .setTimestamp(Date.now())
        .setColor(`${"ff0000"}`)
        .setImage(`${"https://media.discordapp.net/attachments/994556652621664356/1122050702043271200/images.png"}`)
        await userdb.findOneAndUpdate({discordID: user.id}, { $set: {access: opt.getNumber("dost")}});
        await inter.reply({
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
      process.env.BASE_URI,
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
