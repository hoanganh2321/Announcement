const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'embed example',
  execute(message, args, commandList) {
    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('This is Title')
    .setDescription('Some description here')
    .setThumbnail('https://cdn.discordapp.com/attachments/1113800537402527903/1239609375635673128/Untitled_design.png?ex=664d6ef1&is=664c1d71&hm=3770aa56d53c8ef070a7785b2f5de1a7dc23e47a23cee631729c58fc90e4442b&')
    .addFields(
      { name: 'Field Name ', value: 'Some value here' },
       { name: 'GlaceYT', value: 'Subscribe to my channel' },
    )
    .setImage('https://cdn.discordapp.com/attachments/1113800537402527903/1236803979996958740/11.png?ex=664dc637&is=664c74b7&hm=4e5df87c272535fbd67b7b33ad97ee82eeac869feede072a6112f71d7f8dbd20&')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here' });

    message.reply({ embeds: [embed] });
  },
};
