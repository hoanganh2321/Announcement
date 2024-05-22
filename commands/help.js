const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display a list of available commands',
  execute(message, args, commandList) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Commands')
      .setDescription('▶️  ** Dưới đây là các lệnh có sẵn :**\n‎ ')
      .addFields(
      { name: 'setup', value: 'Setup kênh để bot gửi thông báo' },
      { name: 'announce', value: 'Bắt đầu tạo Thông báo nhúng' },
        { name: 'ping', value: 'check the bot\'s latency depends on region' },
        { name: 'embed', value: 'Hiển thị ví dụ nhúng' },
    )

    message.reply({ embeds: [embed] });
  },
};
