const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, codeBlock } = require("discord.js");
const mzrdb = require('croxydb');

module.exports = {
    subCommand: "ticket.ayarlar",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setTitle("Sunucu Ayarları ⚙️")
            .setColor("#5865F2");

        const logKanalId = await mzrdb.get(`mzrlog_${guild.id}`);
        const logKanal = guild.channels.cache.get(logKanalId);
        if (logKanal) {
            embed.addFields([
                { name: "Ticket Log Kanalı", value: logKanal.toString(), inline: true }
            ]);
        } else {
            embed.addFields([
                { name: "Ticket Log Kanalı", value: `❌`, inline: true }
            ]);
        }

        const yetkiliRolID = await mzrdb.get(`mzryetkili_${guild.id}`);
        const yetkiliRol = guild.roles.cache.get(yetkiliRolID);
        if (yetkiliRol) {
            embed.addFields([
                { name: "Ticket Yetkili Rolü", value: yetkiliRol.toString(), inline: true }
            ]);
        } else {
            embed.addFields([
                { name: "Ticket Yetkili Rolü", value: `❌`, inline: true }
            ]);
        }

        const limitSayı = await mzrdb.get(`mzrlimit_${guild.id}`);
        if (limitSayı) {
            embed.addFields([
                { name: "Ticket Oluşturma Limiti", value: limitSayı.toString(), inline: true }
            ]);
        } else {
            embed.addFields([
                { name: "Ticket Oluşturma Limiti", value: `❌`, inline: true }
            ]);
        }

        const kategori = await mzrdb.get(`mzrkategori_${guild.id}`);
        const kategoriBu = guild.channels.cache.get(kategori);
        if (kategori) {
            embed.addFields([
                { name: "Ticket Kategorisi", value: kategoriBu.toString(), inline: true }
            ]);
        } else {
            embed.addFields([
                { name: "Ticket Kategorisi", value: `❌`, inline: true }
            ]);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};