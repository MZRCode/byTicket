const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
  subCommand: "ticket.ayarla-yetkili",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, user } = interaction;

    const rol = options.getRole("rol");

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı ✅")
      .setDescription(`Yetkili Rolü ${rol} olarak ayarlandı!`)
      .setColor("#0BF3B7")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` })

    await interaction.reply({ embeds: [embed], ephemeral: true });

    db.set(`mzryetkili_${guild.id}`, rol.id);
  },
};
