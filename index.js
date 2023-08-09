const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, EmbedBuilder, codeBlock, ChannelType, InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const mzrdb = require('croxydb');
const { generateFromMessages } = require("discord-html-transcripts");

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});

client.config = require("./config.json");
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();

const { loadEvents } = require("./Handlers/eventHandler");
loadEvents(client);

client.on('interactionCreate', async (interaction) => {
  const channelMessages = await interaction.channel.messages.fetch();
  const logChannelId = mzrdb.get(`mzrlog_${interaction.guild.id}`);
  const logChannel = client.channels.cache.get(logChannelId);

  if(interaction.customId === "ticketolustur") {

    if (!interaction.guild) return;
  
    const { user, guild } = interaction;
    await interaction.deferReply({ ephemeral: true });

    const yetkiliRol = mzrdb.get(`mzryetkili_${guild.id}`);
    const kategori = mzrdb.get(`mzrkategori_${guild.id}`);

    if (!yetkiliRol) {
      return interaction.editReply({ content: "Yetkili rolü ayarlı değil!", ephemeral: true })
    };

    if (!kategori) {
      return interaction.editReply({ content: 'Ticket kategorisi ayarlı değil!', ephemeral: true })
    }

    const destekbuton1 = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('dropdown_menu')
        .setPlaceholder('Bir işlem tipi seç!')
        .addOptions([
          new StringSelectMenuOptionBuilder()
          .setLabel(`Sunucu ile ilgili`)
          .setDescription(`Sunucu hakkında bir sorun varsa buna tıkla`)
          .setValue(`mzroption1`)
          .setEmoji('🏡'),
          new StringSelectMenuOptionBuilder()
          .setLabel(`Sunucu üyeleri ile ilgili`)
          .setDescription(`Üyeler ile iligli sorun yaşıyorsan buna tıkla`)
          .setValue(`mzroption2`)
          .setEmoji('🙍‍♂️'),
          new StringSelectMenuOptionBuilder()
          .setLabel(`Sorunum başka bir şey`)
          .setDescription(`Aradığın seçenek yok ise buna tıkla`)
          .setValue(`mzroption3`)
          .setEmoji('❓'),
      ]),
    );

const embed = new EmbedBuilder()
.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
.setDescription(`Selam, **${user.username}**, Aşağıdaki işlem tiplerinden birini seçip ticket oluştura bilirsiniz.`)
.setColor("Blurple")

await interaction.editReply({ embeds: [embed], ephemeral: true, components: [destekbuton1] })
}

if (!interaction.isStringSelectMenu()) return;

await interaction.deferReply({ ephemeral: true });

const selectedValue = interaction.values[0];

const { user, guild } = interaction;
switch (selectedValue) {
    case 'mzroption1':
      if (!interaction.guild) return;
      const yetkiliRol = mzrdb.get(`mzryetkili_${guild.id}`);
      const kanallar = Object.keys(mzrdb.get(`mzrkanal_${guild.id}_${user.id}`) || {}).length;
      const limit = mzrdb.get(`mzrlimit_${guild.id}`);
      const kategori = mzrdb.get(`mzrkategori_${guild.id}`);

      if (!limit) {
        return interaction.editReply(`Ticket oluşturma limiti ayarlı değil! Ayarlamak için **/ayarla limit**`)
      }

      if  (kanallar >= limit) {
        return interaction.editReply(`Maksimum **${limit}** tane ticket oluştura bilirsiin!`)
      } else {
      const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: kategori,
        reason: 'Ticket oluşturuldu!',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
           {
            id: user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
          {
            id: yetkiliRol,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
        ],
      })
      const mzrkanalKey = `mzrkanal_${guild.id}_${user.id}`;
      const existingsUsers = mzrdb.get(mzrkanalKey) || [];
      mzrdb.set(mzrkanalKey, [...existingsUsers, channel.id]);

      const mzruyeKey = `mzruye_${guild.id}_${channel.id}`;
      const existingUsers = mzrdb.get(mzruyeKey) || [];
      mzrdb.set(mzruyeKey, [...existingUsers, user.id]);
    
      const mzrButon = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kapat`)
          .setLabel('Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`nedenlekapat`)
          .setLabel('Nedeniyle Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kaydet`)
          .setLabel('Kaydet')
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success))
    
      const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`Selam, Hoşgeldin **${user.username}**!\nDestek yetkilileri birazdan sizinle ilgilenicekler.\n\nSeçilen Destek Tipi: **Sunucu ile iligili**`)
      .setColor("Blue")
    
      interaction.editReply({ content: `✅ Kanalın başarıyla **oluşturuldu!**\n<:chat:904102695613374485> **Kanal:** <#${channel.id}>`})
      channel.send({ embeds: [embed], content: `${user} **&** <@&${yetkiliRol}>`, components: [mzrButon] })
      }
        break;
    case 'mzroption2':
      if (!interaction.guild) return;

      const yetkiliRol2 = mzrdb.get(`mzryetkili_${guild.id}`);
      const kanallar2 = Object.keys(mzrdb.get(`mzrkanal_${guild.id}_${user.id}`) || {}).length;
      const limit2 = mzrdb.get(`mzrlimit_${guild.id}`);
      const kategori2 = mzrdb.get(`mzrkategori_${guild.id}`);

      if (!limit2) {
        return interaction.editReply(`Ticket oluşturma limiti ayarlı değil! Ayarlamak için **/ayarla limit**`)
      }

      if  (kanallar2 >= limit2) {
        return interaction.editReply(`Maksimum **${limit2}** tane ticket oluştura bilirsiin!`)
      } else {
      const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: kategori2,
        reason: 'Ticket oluşturuldu!',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
           {
            id: user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
          {
            id: yetkiliRol2,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
        ],
      })
      const mzrkanalKey = `mzrkanal_${guild.id}_${user.id}`;
      const existingsUsers = mzrdb.get(mzrkanalKey) || [];
      mzrdb.set(mzrkanalKey, [...existingsUsers, channel.id]);

      const mzruyeKey = `mzruye_${guild.id}_${channel.id}`;
      const existingUsers = mzrdb.get(mzruyeKey) || [];
      mzrdb.set(mzruyeKey, [...existingUsers, user.id]);

      const mzrButon = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kapat`)
          .setLabel('Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`nedenlekapat`)
          .setLabel('Nedeniyle Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kaydet`)
          .setLabel('Kaydet')
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success))
    
      const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`Selam, Hoşgeldin **${user.username}**!\nDestek yetkilileri birazdan sizinle ilgilenicekler.\n\nSeçilen Destek Tipi: **Sunucu üyeleri ile iligili**`)
      .setColor("Blue")
    
      interaction.editReply({ content: `✅ Kanalın başarıyla **oluşturuldu!**\n<:chat:904102695613374485> **Kanal:** <#${channel.id}>`})
      channel.send({ embeds: [embed], content: `${user} **&** <@&${yetkiliRol2}>`, components: [mzrButon] })
      }
        break;
    case 'mzroption3':
      if (!interaction.guild) return;

      const yetkiliRol3 = mzrdb.get(`mzryetkili_${guild.id}`);
      const kanallar3 = Object.keys(mzrdb.get(`mzrkanal_${guild.id}_${user.id}`) || {}).length;
      const limit3 = mzrdb.get(`mzrlimit_${guild.id}`);
      const kategori3 = mzrdb.get(`mzrkategori_${guild.id}`);

      if (!limit3) {
        return interaction.editReply(`Ticket oluşturma limiti ayarlı değil! Ayarlamak için **/ayarla limit**`)
      }

      if  (kanallar3 >= limit3) {
        return interaction.editReply(`Maksimum **${limit3}** tane ticket oluştura bilirsiin!`)
      } else {
      const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: kategori3,
        reason: 'Ticket oluşturuldu!',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
           {
            id: user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
          {
            id: yetkiliRol3,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
          },
        ],
      })
      const mzrkanalKey = `mzrkanal_${guild.id}_${user.id}`;
      const existingsUsers = mzrdb.get(mzrkanalKey) || [];
      mzrdb.set(mzrkanalKey, [...existingsUsers, channel.id]);

      const mzruyeKey = `mzruye_${guild.id}_${channel.id}`;
      const existingUsers = mzrdb.get(mzruyeKey) || [];
      mzrdb.set(mzruyeKey, [...existingUsers, user.id]);

      const mzrButon = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kapat`)
          .setLabel('Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`nedenlekapat`)
          .setLabel('Nedeniyle Kapat')
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger))
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`kaydet`)
          .setLabel('Kaydet')
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success))
    
      const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`Selam, Hoşgeldin **${user.username}**!\nDestek yetkilileri birazdan sizinle ilgilenicekler.\n\nSeçilen Destek Tipi: **Sunucu üyeleri ile iligili**`)
      .setColor("Blue")
    
      interaction.editReply({ content: `✅ Kanalın başarıyla **oluşturuldu!**\n<:chat:904102695613374485> **Kanal:** <#${channel.id}>`})
      channel.send({ embeds: [embed], content: `${user} **&** <@&${yetkiliRol3}>`, components: [mzrButon] })
      }
        break;
    default:
        await interaction.editReply('Geçersiz bir seçenek seçildi!');
        break;
}
});

client.on('interactionCreate', async (interaction) => {
if(interaction.customId === "kapat") {

  if (!interaction.guild) return;

  const { user } = interaction;
  await interaction.deferReply({ ephemeral: true });

  const mzrrow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel(`Kapat`)
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅')
    .setCustomId("sil"))

const embed = new EmbedBuilder()
.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
.setTitle("Kapatmayı Onayla")
.setDescription(`Destek talebini kapatmak istediğinize eminmisiniz?`)
.setColor("Blue")

interaction.editReply({ embeds: [embed], ephemeral: true, components: [mzrrow] })
};

if(interaction.customId === "sil") {
  const { user, channel, guild } = interaction;
  await interaction.deferReply();

  const logChannelID = mzrdb.get(`mzrlog_${guild.id}`);
  const logChannel = client.channels.cache.get(logChannelID);
  const açanKişi = mzrdb.get(`mzruye_${guild.id}_${channel.id}`);

  if (!logChannel) {
    return interaction.followUp({ content: "Ticket Log kanalı ayarlanmamış!", ephemeral: true });
  }

  interaction.editReply({ content: `Destek talebi başarıyla **5 saniye** sonra otomatik olarak kapatılacaktır ✅` })

  const logEmbed = new EmbedBuilder()
  .setAuthor({ name: guild.name, iconURL: guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
  .setTitle("Destek Talebi Kapatıldı ✅")
  .addFields(
      { name: '🔑 Açan Kişi', value: `<@${açanKişi}>`, inline: true },
      { name: '🔒 Kapatan Kişi', value: `${user}`, inline: true },
      { name: '⠀', value: '⠀', inline: true },
      { name: '❓ Sebep', value: `${codeBlock("yaml", `Neden belirtilmemiş`)}`, inline: false }
  )
  .setColor('Red')
  .setTimestamp()
  .setFooter({ text:  `${user.username}`, iconURL: user.displayAvatarURL() })

  let messagesToDelete = [];
  
  const messages = await channel.messages.fetch();

  messages.each((message) => {
    messagesToDelete.unshift(message);
  });

  const transcript = await generateFromMessages(messagesToDelete, channel);

  logChannel.send({ embeds: [logEmbed], files: [transcript] });

  const mzrkanalKey = `mzrkanal_${guild.id}_${açanKişi}`;

  setTimeout(() => {
    channel.delete();
    mzrdb.delete(mzrkanalKey);
    mzrdb.delete(`mzruye_${guild.id}_${channel.id}`, user.id);
  }, 5000);
 }


   if(interaction.customId === "kaydet") {
    await interaction.deferReply({ ephemeral: true })

    const { user, member, channel, guild } = interaction;
    const açanKişi = mzrdb.get(`mzruye_${guild.id}_${channel.id}`);
    const logChannelID = mzrdb.get(`mzrlog_${guild.id}`);
    const logChannel = client.channels.cache.get(logChannelID);
    const yetkiliRol = mzrdb.get(`mzryetkili_${guild.id}`);
  
    if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.roles.cache.has(yetkiliRol)) {
      return interaction.editReply({ content: `Dostum bu talebi kaydetmen için <@&${yetkiliRol}> rolüne veya **Yönetici** yetkisine sahip olman gerekiyor!` });
    }
    
    if (member.permissions.has(PermissionFlagsBits.Administrator) && member.roles.cache.has(yetkiliRol)) {
    
      if (!logChannel) {
        return interaction.editReply({ content: "Ticket Log kanalı ayarlanmamış!" });
      }
    
      interaction.editReply({ content: `✅ Başarıyla <#${logChannelID}> kanalına gönderildi!` });
    }
  
    const logEmbed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
    .setTitle("Destek Talebi Kaydedildi ✅")
    .addFields(
        { name: '🔑 Açan Kişi', value: `<@${açanKişi}>`, inline: true },
        { name: '✅ Kaydeden Kişi', value: `${user}`, inline: true },
    )
    .setColor("Green")
    .setTimestamp()
    .setFooter({ text:  `${user.username}`, iconURL: user.displayAvatarURL() })
  
      let messagesToDelete = [];
  
      const messages = await channel.messages.fetch();
    
      messages.each((message) => {
        messagesToDelete.unshift(message);
      });
    
      const transcript = await generateFromMessages(messagesToDelete, channel);
    
      logChannel.send({ embeds: [logEmbed], files: [transcript] });
  };
  });

  const Modal = new ModalBuilder()
    .setCustomId('neden_soyle')
    .setTitle('Neden Kapatmak İstiyorsun?')
const a1 = new TextInputBuilder()
    .setCustomId('neden_belirt')
    .setLabel('Neden Belirt')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(4)
    .setMaxLength(1024)
    .setPlaceholder('Destek talebinin kapanma sebebi: "Çözüldü!"')
    .setRequired(true)

const mrrow = new ActionRowBuilder().addComponents(a1);
Modal.addComponents(mrrow);

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === "nedenlekapat") {
      await interaction.showModal(Modal);
  }
})
   
  client.on('interactionCreate', async (interaction) => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
      if (interaction.customId === 'neden_soyle') {
          const { user, guild, channel, member } = interaction;
          await interaction.deferReply({ ephemeral: true })

          const nedenSen = interaction.fields.getTextInputValue('neden_belirt');

          const logChannelID = mzrdb.get(`mzrlog_${guild.id}`);
          const logChannel = client.channels.cache.get(logChannelID);
          const açanKişi = mzrdb.get(`mzruye_${guild.id}_${channel.id}`);

          if (!logChannel) return interaction.editReply({ content: "Ticket log Kanalı Ayarlı Değil!" });
          interaction.editReply({ content: '✅ Sebebiniz başarıyla gönderildi!\n\n**2 Saniye** sonra destek talebi otomatik olarak kapatılacaktır.' })

          const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
          .setTitle("Destek Talebi Kapatıldı ✅")
          .setColor('#ff0000')
          .setTimestamp()
          .setFooter({ text:  `${user.username}`, iconURL: user.displayAvatarURL() })
          .addFields(
              { name: '🔑 Açan Kişi', value: `<@${açanKişi}>`, inline: true },
              { name: '🔒 Kapatan Kişi', value: `${user}`, inline: true },
              { name: '⠀', value: '⠀', inline: true },
              { name: "❓ Sebep", value: `${codeBlock("yaml", `${nedenSen}`)}`, inline: false }
          )

          let messagesToDelete = [];
  
          const messages = await channel.messages.fetch();
        
          messages.each((message) => {
            messagesToDelete.unshift(message);
          });
        
          const transcript = await generateFromMessages(messagesToDelete, channel);

            logChannel.send({ embeds: [embed], files: [transcript] });

            const mzrkanalKey = `mzrkanal_${guild.id}_${açanKişi}`;
            
            setTimeout(() => {
              channel.delete();
              mzrdb.delete(mzrkanalKey);
              mzrdb.delete(`mzruye_${guild.id}_${channel.id}`, user.id);
            }, 5000);
      }
    });

client.login(client.config.token);
