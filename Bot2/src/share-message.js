const { MessageEmbed } = require('discord.js')
const xpHandler = require('./xp-handler.js')
const { roleColors } = require('./roles-handler.js')

const getChannelsFromName = (client, channelName, type = 'GUILD_TEXT') => {
  return client.channels.cache.filter((channel) => channel.name === channelName && channel.type === type)
}

const createEmbedMessage = async (message) => {
  const userData = (await xpHandler.checkUser(message))[0]

  return new MessageEmbed()
    .setTitle(`${message.author.username} a envoyé un message depuis le serveur ${message.guild.name}.`)
    .setThumbnail(message.author.avatarURL())
    .addFields(
      { name: 'Niveau', value: userData.xp_level.toString(), inline: true },
      { name: 'Messages', value: userData.xp_count.toString(), inline: true }
    )
    .setDescription(message.content)
    .setColor(roleColors.get(userData.xp_level))
}

const sendMessagesToOtherChannels = async (message, channelName = 'shared') => {
  const allSharedChannels = getChannelsFromName(message.client, channelName)

  allSharedChannels.each(async (channel) => {
    if (channel.id !== message.channel.id) {
      channel.send({ embeds: [await createEmbedMessage(message)] })
    }
  })
}

module.exports.getChannelsFromName = getChannelsFromName
module.exports.createEmbedMessage = createEmbedMessage
module.exports.sendMessagesToOtherChannels = sendMessagesToOtherChannels
