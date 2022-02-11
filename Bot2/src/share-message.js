const { MessageEmbed } = require('discord.js')
const { createEmbedMessage: embedBuilder } = require('./message-handler')
const { getUserData } = require('./xp-handler.js')
const { roleColors } = require('./roles-handler.js')

/**
 * Get all the channels that have the specified name and type in all the guilds the bot is in
 * @param {Message} message Message received
 * @param {string} channelName Name of the channel to look for
 * @param {ChannelType=} type Type of the channel to look for
 * @returns {Collection<Snowflake, Channel>} Map of the channels that correspond to the parameters
 */
const getChannelsFromName = (message, channelName, type = 'GUILD_TEXT') => {
  return message.client.channels.cache.filter((channel) => channel.name === channelName && channel.type === type)
}

/**
 * Send the embed message to all the other bridged channels
 * @param {Message} message Message received
 * @param {string} [channelName='shared'] Name of the channel that the messages will be sent to
 */
const sendMessagesToOtherChannels = async (message, channelName = 'shared') => {
  const userData = (await getUserData(message))[0]
  const allSharedChannels = getChannelsFromName(message, channelName)

  allSharedChannels.each(async (channel) => {
    if (channel.id !== message.channel.id) {
      channel.send({
        embeds: [
          embedBuilder(
            `${message.author.username} a envoyé un message depuis le serveur ${message.guild.name}.`,
            message.content,
            message.author.avatarURL(),
            [
              { name: 'Niveau', value: userData.xp_level.toString(), inline: true },
              { name: 'Messages', value: userData.xp_count.toString(), inline: true }
            ],
            roleColors.get(userData.xp_level)
          )
        ]
      })
    }
  })
}

module.exports.getChannelsFromName = getChannelsFromName
module.exports.sendMessagesToOtherChannels = sendMessagesToOtherChannels
