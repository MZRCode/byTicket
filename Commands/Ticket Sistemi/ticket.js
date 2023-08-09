const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket Sistemi")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options
    .setName("ayarla-log")
    .setDescription("Ticket Log Kanalını Ayarlarsınız")
    .addChannelOption((options) => options
      .setName("kanal")
      .setDescription("Ticket Log kanalı olarak ayarlanacak kanal")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    )
    .addSubcommand((options) => options
    .setName("ayarla-yetkili")
    .setDescription("Ticket Yetkilisi Rolü Ayarlarsınız")
    .addRoleOption((options) => options
      .setName("rol")
      .setDescription("Ticket Yetkili Rolünü Ayarlayın")
      .setRequired(true))
    )
    .addSubcommand((options) => options
    .setName("ayarla-limit")
    .setDescription("Ticket Talebi Oluşturma Limiti Ayarlarsınız")
    .addIntegerOption((options) => options
      .setName("limit")
      .setDescription("Oluşturma Limiti Ne?")
      .setRequired(true))
    )
    .addSubcommand((options) => options
    .setName("ayarla-kategori")
    .setDescription("Ticket Kategorisini Ayarlarsınız")
    .addChannelOption((options) => options
        .setName("kategori")
        .setDescription("Ticket Kategorisini Seçiniz")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true))
    )
    .addSubcommand((options) => options
    .setName("ayarlar")
    .setDescription("Ayarlarını Gösterir")
    )
    .addSubcommand((options) => options
    .setName("sıfırla")
    .setDescription("Ticket Sistemi Sıfırlama")
    .addStringOption(options => options
        .setName('sıfırla')
        .setDescription('Seçilenleri Sıfırlar')
        .setRequired(true)
        .addChoices(
          { name: 'Tüm Ayarları Sıfırla', value: 'hepsi' },
          { name: 'Ticket Log Kanalı Sıfırla', value: 'log_kanal' },
          { name: 'Ticket Yetkili Rolü Sıfırla', value: 'yetkili_rol' },
          { name: 'Ticket Talebi Limit Sayısı Sıfırla', value: 'limit' },
          { name: 'Ticket Kategori Sıfırla', value: 'kategori' },
        ))
    )
    .addSubcommand((options) => options
    .setName("kur")
    .setDescription("Ticket Sistemi Kurarsın")
    .addChannelOption((options) => options
        .setName("kanal")
        .setDescription("Gönderilmesini İstediğiniz Kanalı Etiketleyin")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
    )
}