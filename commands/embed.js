const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'embed example',
  execute(message, args, commandList) {
    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('This is Title')
    .setDescription('Some description here')
    .setThumbnail('https://media.discordapp.net/attachments/1090895809098289185/1239931775317315584/tai_xuong_1.gif?ex=664df274&is=664ca0f4&hm=392a09831d3eff9a0098ef571da3c7c24291441edf4aad6933d0ba95eed58d00&')
    .addFields(
      { name: 'Field Name ', value: 'Some value here' },
       { name: 'Kaioshin', value: 'Join Discord Server' },
    )
    .setImage('https://media.discordapp.net/attachments/1090895809098289185/1239931775317315584/tai_xuong_1.gif?ex=664df274&is=664ca0f4&hm=392a09831d3eff9a0098ef571da3c7c24291441edf4aad6933d0ba95eed58d00&')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here' });

    message.reply({ embeds: [embed] });
  },
};
