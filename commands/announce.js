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
      url: 'https://discord.gg/XBHZUwqAzK'
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
      message.reply('Bạn mất quá nhiều thời gian để trả lời. Thông báo bị hủy.');
    }
      });
    }

    module.exports = {
      name: 'announce',
      description: 'Gửi thông báo đến kênh được chỉ định (Chỉ Admin)',
      async execute(message, args) {
        if (!message.guild) {
          return message.reply('Lệnh này chỉ có thể được sử dụng trong một máy chủ (bang hội).');
        }

        const embed = new EmbedBuilder().setColor('#0099ff');

        const dataPath = path.join(__dirname, '../data/announcementChannels.json');
        let serverData = {};

        try {
          serverData = require(dataPath);
        } catch (err) {
          console.error('Error reading server data:', err);
          return message.reply('Đã xảy ra lỗi khi đọc dữ liệu máy chủ. Vui lòng thử lại sau.');
        }

        const channelId = serverData[message.guild.id];

        if (!channelId) {
          return message.reply('The announcement channel has not been set.');
        }

        const channel = message.guild.channels.cache.get(channelId);

        if (!channel) {
          return message.reply('Không tìm thấy kênh thông báo.');
        }

        let announcementCompleted = false;

        askQuestion(message, '**1. Nhập tiêu đề cho thông báo của bạn:**\n- Type **skip** để chuyển sang bước tiếp theo.', (title) => {
          if (title.toLowerCase() !== 'skip') {
            embed.setTitle(title);
          }

          askQuestion(message, '**2. Chỉ định màu cho nhúng:**\n__Examples:__\n\n- #FFFF00 - 💛\n- #FF0000 - ❤️\n- #00FF00 - 💚\n- #0000FF - 💙\n- #FF00FF - 💜\n- #FFFFFF - 🤍\n⭕ **Phải nhập Màu nhúng**', (color) => {
            if (!color.startsWith('#')) {
              return message.reply('- Màu sắc là bắt buộc!\n- Vui lòng sử dụng lại lệnh.');
            }
            embed.setColor(color);

            askQuestion(message, '**3. Viết mô tả tin nhắn:**\n\n- Type **skip** để chuyển sang bước tiếp theo.', (description) => {
              if (description.toLowerCase() !== 'skip') {
                embed.setDescription(description);
              }

              askQuestion(message, '**4. Bạn có URL hình ảnh cho thông báo không:**\n- Type **skip** để chuyển sang bước tiếp theo.', (imageUrl) => {
                if (imageUrl.toLowerCase() !== 'skip') {
                  embed.setImage(imageUrl);
                }

                askQuestion(message, '**5. Bạn có URL hình thu nhỏ cho thông báo không:**\n\n- Type **skip** để chuyển sang bước tiếp theo.', (thumbnailUrl) => {
                  if (thumbnailUrl.toLowerCase() !== 'skip') {
                    embed.setThumbnail(thumbnailUrl);
                  }

                  askQuestion(message, '**6. Bạn có muốn thêm dấu thời gian không?**\n- Type **yes** để thêm dấu thời gian hoặc **skip** để chuyển sang bước tiếp theo.', (timestampOption) => {
                    if (timestampOption.toLowerCase() === 'yes') {
                      embed.setTimestamp(new Date());
                    }

                    askQuestion(message, '**7. Bạn có muốn thêm chân trang không?**\n- Type **yes** để thêm chân trang hoặc **skip** Để kết thúc.', (footerOption) => {
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
              askQuestion(message, '**9. Bạn có muốn ping tất cả mọi người hoặc một vai trò tùy chỉnh?**\n- Type **everyone** for everyone, **role** cho một vai trò cụ thể, hoặc **skip** Để kết thúc.', (pingOption) => {
                if (pingOption.toLowerCase() === 'everyone') {
                  message.reply('**🔥 Mọi người sẽ được thông báo với Ping này!**');
                  finalizeAnnouncement('@everyone');
                } else if (pingOption.toLowerCase() === 'role') {
                  askQuestion(message, 'Vui lòng đề cập đến vai trò hoặc cung cấp ID vai trò:', (roleInput) => {
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
              url: 'https://discord.gg/XBHZUwqAzK'
            })
            .setColor('#FFFF00')
            .setDescription('**- Bạn có chắc chắn muốn gửi thông báo này không?**');

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
              message.reply('Thư nhúng của bạn đã được gửi thành công!');
            } else if (interaction.customId === 'cancel') {
              message.reply('Thư nhúng của bạn đã bị hủy!');
            }

            announcementCompleted = true;
            interaction.deferUpdate();
          });

          buttonCollector.on('end', (collected, reason) => {
            if (reason === 'time' && !announcementCompleted) {
              message.reply('Bạn mất quá nhiều thời gian để trả lời. Thông báo bị hủy!');
            }
          });
        }
      },
    };
