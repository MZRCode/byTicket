const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const mzrdb = require("croxydb");

module.exports = {
  subCommand: "ticket.ayarla-limit",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, user } = interaction;

    const limit = options.getInteger("limit");

    if (isNaN(limit)) {
      return interaction.reply({ content: ":x: Ticket oluşturma limiti **sayı** olmalıdır", ephemeral: true })
    }

    if (limit < 1) {
      return interaction.reply({ content: ":x: Ticket oluşturma limiti minimum **1**'dir!", ephemeral: true })
    }

    if (limit >= 10) {
      return interaction.reply({ content: ":x: Ticket oluşturma limiti maksimum **10**'dur!", ephemeral: true })
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı ✅")
      .setDescription(`Ticket oluşturma limiti **${limit}** olarak ayarlandı!`)
      .setColor("#0BF3B7")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` })

    await interaction.reply({ embeds: [embed], ephemeral: true });

    mzrdb.set(`mzrlimit_${guild.id}`, limit);
  },
};
