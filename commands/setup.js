const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setup',
  description: 'Set the announcement channel',
  execute(message, args) {
    if (!message.guild) {
      return message.reply('This command can only be used in a server (guild).');
    }

    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('You do not have permission to set the announcement channel.');
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setAuthor({
          name: 'Mention Channel',
          iconURL: 'https://media.discordapp.net/attachments/1213421081226903552/1213424821170470932/2396-warning.gif',
          url: 'https://discord.gg/FUEHs7RCqz'
        })
        .setDescription(`Please mention a channel for announcements.\n\n**Usage : ** \`<prefix>setup #channel\``)
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
          name: 'Channel Sucessfully set',
          iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213424821673795594/4381-anouncements-animated.gif',
          url: 'https://discord.gg/FUEHs7RCqz'
        })
        .setDescription(`Announcement channel has been set to ${channel}`)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }
  },
};
