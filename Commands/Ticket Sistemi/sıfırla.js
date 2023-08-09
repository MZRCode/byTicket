const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const mzrdb = require("croxydb");

module.exports = {
  subCommand: "destek.sıfırla",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;

    const sıfırla = options.getString('sıfırla');
    let sıfırlaName;

    if (sıfırla === 'hepsi') {
      sıfırlaName = 'Tüm ayarlar';
      mzrdb.delete(`mzrlog_${guild.id}`);
      mzrdb.delete(`mzryetkili_${guild.id}`);
      mzrdb.delete(`mzrlimit_${guild.id}`);
      mzrdb.delete(`mzrkategori_${guild.id}`);
    } else if (sıfırla === 'log_kanal') {
      sıfırlaName = 'Ticket log kanalı';
      const logKanal = mzrdb.get(`mzrlog_${guild.id}`);
      if (!logKanal) {
        return interaction.reply({ content: "Ticket log kanalı ayarlanmamış!", ephemeral: true });
      }
      mzrdb.delete(`mzrlog_${guild.id}`);
    } else if (sıfırla === 'yetkili_rol') {
      sıfırlaName = 'Destek yetkili rolü';
      const yetkiliRol = mzrdb.get(`mzryetkili_${guild.id}`);
      if (!yetkiliRol) {
        return interaction.reply({ content: "Destek yetkili rolü ayarlanmamış!", ephemeral: true });
      }
      mzrdb.delete(`mzryetkili_${guild.id}`);
    } else if (sıfırla === 'limit') {
      sıfırlaName = 'Destek talebi oluşturma limit sayısı';
      const limitSayı = mzrdb.get(`mzrlimit_${guild.id}`);
      if (!limitSayı) {
        return interaction.reply({ content: "Limit sayısı ayarlanmamış!", ephemeral: true });
      }
      mzrdb.delete(`mzrlimit_${guild.id}`);
    } else if (sıfırla === 'kategori') {
      sıfırlaName = 'Ticket kategorisi';
      const mzrKat = mzrdb.get(`mzrkategori_${guild.id}`);
      if (!mzrKat) {
        return interaction.reply({ content: "Ticket kategorisi zaten ayarlanmamış!", ephemeral: true });
      }
      mzrdb.delete(`mzrkategori_${guild.id}`);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
      .setTitle("Başarıyla Sıfırlandı ✅")
      .setDescription(`**${sıfırlaName}** sıfırlandı!`)
      .setColor("Green")
      .setTimestamp()
      .setFooter({ text:  `${user.username}`, iconURL: user.displayAvatarURL() })

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};