const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display a list of available commands',
  execute(message, args, commandList) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Commands')
      .setDescription('▶️  **Here are the available commands :**\n‎ ')
      .addFields(
      { name: 'setup', value: 'configue the channel for the bot to send announcements' },
      { name: 'announce', value: 'Start creating an Embed announcement Message' },
        { name: 'ping', value: 'check the bot\'s latency depends on region' },
        { name: 'embed', value: 'shows embed example' },
    )

    message.reply({ embeds: [embed] });
  },
};
