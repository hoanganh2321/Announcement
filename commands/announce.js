const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

async function askQuestion(message, question, callback, skip = false) {
  const questionEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setAuthor({
      name: 'Embed Message',
      iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213422313035407360/8218-alert.gif',
      url: 'https://discord.gg/FUEHs7RCqz'
    })
    .setDescription(question);

  const questionMessage = await message.reply({ embeds: [questionEmbed] });

  if (skip) {
    callback('skip');
    return questionMessage.delete();
  }

  const filter = (response) => response.author.id === message.author.id;
  const collector = message.channel.createMessageCollector({ filter, time: 60000 });

  collector.on('collect', async (response) => {
    const userResponse = response.content;
    await response.delete();
    collector.stop();

    if (userResponse.toLowerCase() === 'skip') {
      callback('skip');
    } else {
      callback(userResponse);
    }

    await questionMessage.delete();
  });

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      message.reply('You took too long to answer. Announcement canceled.');
    }
      });
    }

    module.exports = {
      name: 'announce',
      description: 'Send an announcement to the specified channel (Mods Only)',
      async execute(message, args) {
        if (!message.guild) {
          return message.reply('This command can only be used in a server (guild).');
        }

        const embed = new EmbedBuilder().setColor('#0099ff');

        const dataPath = path.join(__dirname, '../data/announcementChannels.json');
        let serverData = {};

        try {
          serverData = require(dataPath);
        } catch (err) {
          console.error('Error reading server data:', err);
          return message.reply('An error occurred while reading server data. Please try again later.');
        }

        const channelId = serverData[message.guild.id];

        if (!channelId) {
          return message.reply('The announcement channel has not been set.');
        }

        const channel = message.guild.channels.cache.get(channelId);

        if (!channel) {
          return message.reply('The announcement channel was not found.');
        }

        let announcementCompleted = false;

        askQuestion(message, '**1. Enter title for your announcement:**\n- Type **skip** to move to the next step.', (title) => {
          if (title.toLowerCase() !== 'skip') {
            embed.setTitle(title);
          }

          askQuestion(message, '**2. Specify the color for the embed:**\n__Examples:__\n\n- #FFFF00 - 💛\n- #FF0000 - ❤️\n- #00FF00 - 💚\n- #0000FF - 💙\n- #FF00FF - 💜\n- #FFFFFF - 🤍\n⭕ **Must enter embed Color**', (color) => {
            if (!color.startsWith('#')) {
              return message.reply('- Color is required!\n- Please use the command again.');
            }
            embed.setColor(color);

            askQuestion(message, '**3. Write Description of Message:**\n\n- Type **skip** to move to the next step.', (description) => {
              if (description.toLowerCase() !== 'skip') {
                embed.setDescription(description);
              }

              askQuestion(message, '**4. Do you have an image URL for the announcement:**\n- Type **skip** to move to the next step.', (imageUrl) => {
                if (imageUrl.toLowerCase() !== 'skip') {
                  embed.setImage(imageUrl);
                }

                askQuestion(message, '**5. Do you have a thumbnail URL for the announcement:**\n\n- Type **skip** to move to the next step.', (thumbnailUrl) => {
                  if (thumbnailUrl.toLowerCase() !== 'skip') {
                    embed.setThumbnail(thumbnailUrl);
                  }

                  askQuestion(message, '**6. Do you want to add a timestamp?**\n- Type **yes** to add a timestamp or **skip** to move to the next step.', (timestampOption) => {
                    if (timestampOption.toLowerCase() === 'yes') {
                      embed.setTimestamp(new Date());
                    }

                    askQuestion(message, '**7. Do you want to add a footer?**\n- Type **yes** to add a footer or **skip** to finish.', (footerOption) => {
                      if (footerOption.toLowerCase() === 'yes') {
                        askQuestion(message, 'Enter the footer text:', (footerText) => {
                          embed.setFooter({ text: footerText });

                          askForFields(); // Proceed to adding fields after setting footer
                        });
                      } else {
                        askForFields(); // Proceed to adding fields if footer is skipped
                      }
                    });
                  });
                });
              });
            });
          });
        });

        async function askForFields() {
          askQuestion(message, '**8. Do you want to add a field?**\nType **yes** to add a field or **skip** to finish.', async (addField) => {
            if (addField.toLowerCase() === 'yes') {
              askQuestion(message, 'Enter the field **name**:', async (fieldName) => {
                if (fieldName.toLowerCase() !== 'skip') {
                  askQuestion(message, 'Enter the field **value**:', async (fieldValue) => {
                    if (fieldValue.toLowerCase() !== 'skip') {
                      embed.addFields({ name: fieldName, value: fieldValue });
                      await askForFields();
                    } else {
                      await askForFields();
                    }
                  });
                } else {
                  await askForFields();
                }
              });
            } else {
              askQuestion(message, '**9. Do you want to ping everyone or a custom role?**\n- Type **everyone** for everyone, **role** for a specific role, or **skip** to finish.', (pingOption) => {
                if (pingOption.toLowerCase() === 'everyone') {
                  message.reply('**🔥 Everyone will be notified with this Ping!**');
                  finalizeAnnouncement('@everyone');
                } else if (pingOption.toLowerCase() === 'role') {
                  askQuestion(message, 'Please mention the role or provide the role ID:', (roleInput) => {
                    const role = message.guild.roles.cache.get(roleInput.replace(/[<@&>]/g, '')) || message.guild.roles.cache.find(r => r.name === roleInput);
                    if (role) {
                      finalizeAnnouncement(`<@&${role.id}>`);
                    } else {
                      message.reply('Role not found. Announcement canceled.');
                    }
                  });
                } else {
                  finalizeAnnouncement('');
                }
              });
            }
          });
        }

        function finalizeAnnouncement(pingContent) {
          const embed1 = new EmbedBuilder()
            .setAuthor({
              name: 'Confirm your Announcement',
              iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213431548846800916/5331-fingerprint-loadingicon.gif?',
              url: 'https://discord.gg/FUEHs7RCqz'
            })
            .setColor('#FFFF00')
            .setDescription('**- Are you sure you want to send this announcement?**');

          const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Primary);

          const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

          const confirmationRow = new ActionRowBuilder()
            .addComponents(cancel, confirm);
          message.channel.send({ content: pingContent, embeds: [embed] });
          message.reply({
            embeds: [embed1],
            components: [confirmationRow],
          });

          const buttonFilter = (interaction) => interaction.customId === 'confirm' || interaction.customId === 'cancel';

          const buttonCollector = message.channel.createMessageComponentCollector({
            filter: buttonFilter,
            time: 60000,
          });

          buttonCollector.on('collect', async (interaction) => {
            if (interaction.customId === 'confirm') {
              await channel.send({ content: pingContent, embeds: [embed] });
              message.reply('Your Embed message sent successfully!');
            } else if (interaction.customId === 'cancel') {
              message.reply('Your Embed message canceled!');
            }

            announcementCompleted = true;
            interaction.deferUpdate();
          });

          buttonCollector.on('end', (collected, reason) => {
            if (reason === 'time' && !announcementCompleted) {
              message.reply('You took too long to respond. Announcement canceled!');
            }
          });
        }
      },
    };
