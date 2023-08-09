const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım Menüsünü Gösterir"),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client){
    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
    .setTitle("Yardım Menüm")
    .addFields([
    { name: "Yetkili Ayarlamalı Komutlarım", value: `
🎫 **</destek kur:0>**
Destek sistemi embedını gönderir.

🎫 **</destek ayarla-log:0>**
Destek log kanalını ayarlarsınız.

🎫 **</destek ayarla-yetkili:0>**
Destek yetkilisi rolünü ayarlarsınız.

🎫 **</destek ayarla-limit:0>**
Destek talebi oluşturma limiti ayarlarsınız.

🎫 **</destek ayarla-kategori:0>**
Destek taleplerinin bulunmasını istediğiniz kategoriyi ayarlarsınız.

🎫 **</sıfırla:0>**
Destek sisteminde sıfırlamak istediğinizi sıfırlarsınız.

🎫 **</ayarlar:0>**
Ayarları görüntülersiniz.`, inline: false},
    { name: "Kullanıcı Komutlarım", value: `
🙍‍♂️ **</yardım:0>**
Yardım menüsünü gösterir.

🙍‍♂️ **</ping:0>**
Botun pingini gösterir.

🙍‍♂️ **</invite:0>**
Botu davet edersiniz ve destek sunucusuna katılabilirsiniz.`, inline: true},
    ])
    .setColor("Blurple")
    await interaction.editReply({embeds: [embed] });

    }

}
