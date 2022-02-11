const Discord = require('discord.js')
const { createEmbedMessage } = require('../src/message-handler')
const axios = require('axios').default

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  const channel = message.channel

  axios
    .get(`https://api.x.immutable.com/v1/collections/${arguments[0]}`)
    .then(async (response) => {
      const nftEmbed = createEmbedMessage(response.data.name, response.data.description, response.data.icon_url)

      await message.channel.send({ embeds: [nftEmbed] })
    })
    .catch((err) => console.error(err))
}

module.exports.name = 'nft'
