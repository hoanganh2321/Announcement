const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Check the bot\'s latency',
  execute(message, args) {
    const pingEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Ping')
      .setDescription('Checking the bot\'s latency...')
      .setTimestamp();

    message.reply({ embeds: [pingEmbed] }).then(sentMessage => {
      const ping = sentMessage.createdTimestamp - message.createdTimestamp;

      const updatedPingEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ping')
        .setDescription(`Bot latency: ${ping}ms`)
        .setTimestamp();

      sentMessage.edit({ embeds: [updatedPingEmbed] });
    });
  },
};
