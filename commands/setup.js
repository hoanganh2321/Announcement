const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setup',
  description: 'Đặt kênh thông báo',
  execute(message, args) {
    if (!message.guild) {
      return message.reply('Lệnh này chỉ có thể được sử dụng trong một máy chủ (guild).');
    }

    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('Bạn không có quyền đặt kênh thông báo.');
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setAuthor({
          name: 'Kênh đề cập',
          iconURL: 'https://media.discordapp.net/attachments/1213421081226903552/1213424821170470932/2396-warning.gif',
          url: 'https://discord.gg/XBHZUwqAzK'
        })
        .setDescription(`Vui lòng đề cập đến một kênh để biết thông báo.\n\n**Use : ** \`!setup #channel\``)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } else {
 
      const dataPath = path.join(__dirname, '../data/announcementChannels.json');
      let serverData = {};

      try {
        serverData = require(dataPath);
      } catch (err) {
        console.error('Error reading server data:', err);
      }

 
      serverData[message.guild.id] = channel.id;

     
      fs.writeFileSync(dataPath, JSON.stringify(serverData, null, 2), 'utf-8');

      console.log(`Announcement channel set to: ${channel.name}`);

      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setAuthor({
          name: 'Kênh được thiết lập thành công',
          iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213424821673795594/4381-anouncements-animated.gif',
          url: 'https://discord.gg/XBHZUwqAzK'
        })
        .setDescription(`Kênh thông báo đã được đặt thành ${channel}`)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  },
};
