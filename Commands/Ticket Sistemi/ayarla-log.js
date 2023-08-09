const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const mzrdb = require("croxydb");

module.exports = {
  subCommand: "ticket.ayarla-log",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, user } = interaction;

    const kanal = options.getChannel("kanal");

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı ✅")
      .setDescription(`Ticket Log kanalı ${kanal} olarak ayarlandı!`)
      .setColor("#0BF3B7")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` })

    await interaction.reply({ embeds: [embed], ephemeral: true });

    mzrdb.set(`mzrlog_${guild.id}`, kanal.id);
  },
};
