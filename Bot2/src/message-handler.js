const Discord = require('discord.js')

/**
 * Send a private message to the user
 * @param {Discord.Member} member Member to send the private message to.
 * @param {string} content Content of the private message
 */
const sendPrivateMessage = async (member, content) => {
  await member.send(content)
}

module.exports.sendPrivateMessage = sendPrivateMessage
