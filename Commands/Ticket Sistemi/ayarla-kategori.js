const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require("discord.js");
const mzrdb = require("croxydb");

module.exports = {
  subCommand: "ticket.ayarla-kategori",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, user } = interaction;

    const kategori = options.getChannel("kategori");
    const mzrKat = mzrdb.get(`mzrkategori_${guild.id}`);

    if (mzrKat) {
        return interaction.reply({ content: 'Kategori zaten kurulu! Sıfırlamak için: **/sıfırla**', ephemeral: true })
    };

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı ✅")
      .setDescription(`Ticket kategorisi **${kategori.name}** olarak ayarlandı!`)
      .setColor("Green")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` })

    await interaction.reply({ embeds: [embed], ephemeral: true });

    mzrdb.set(`mzrkategori_${guild.id}`, kategori.id);
  },
};
