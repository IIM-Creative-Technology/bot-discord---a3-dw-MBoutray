const Discord = require('discord.js')
const { getUserData } = require('../src/xp-handler')
const { roleColors } = require('../src/roles-handler')
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  const channel = message.channel
  const data = (await getUserData(message))[0]

  // Create reply embed
  const embed = new Discord.MessageEmbed()
    .setTitle(`Les infos de ${message.member.displayName}`)
    .setThumbnail(message.member.displayAvatarURL())
    .addFields(
      { name: 'Niveau', value: data.xp_level.toString(), inline: true },
      { name: 'Messages', value: data.xp_count.toString(), inline: true }
    )
    .setColor(roleColors.get(data.xp_level))

  // Send reply
  channel.send({ embeds: [embed] })
}

module.exports.name = 'xp'
