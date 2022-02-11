const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')

/**
 * Send a private message to the user
 * @param {Discord.Member} member Member to send the private message to.
 * @param {string} content Content of the private message
 */
const sendPrivateMessage = async (member, content) => {
  await member.send(content)
}

/**
 * Create an embed message
 * @param {string} title
 * @param {string} description
 * @param {string} thumbnail
 * @param {Array<Discord.EmbedField>} fields
 * @param {string} color
 * @returns {EmbedMessage} Instance of the embed message
 */
const createEmbedMessage = (title = '', description = '', thumbnail = '', fields = [], color = '') => {
  let message = new MessageEmbed()

  console.log(typeof title)

  if (title !== '') {
    message.setTitle(title)
  }
  if (description !== '') {
    message.setDescription(description)
  }
  if (thumbnail !== '') {
    message.setThumbnail(thumbnail)
  }
  if (fields.length > 0) {
    message.setFields(fields)
  }
  if (color !== '') {
    message.setColor(color)
  }

  return message
}

module.exports.sendPrivateMessage = sendPrivateMessage
module.exports.createEmbedMessage = createEmbedMessage
