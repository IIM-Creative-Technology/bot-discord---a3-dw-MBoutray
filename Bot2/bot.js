const clientLoader = require('./src/clientLoader')
const commandLoader = require('./src/commandLoader')
const { checkIfRoleExist, createRole, assignRole } = require('./src/roles-handler')
const { onMessage } = require('./src/xp-handler')
const { sendMessagesToOtherChannels } = require('./src/share-message')
require('colors')

const COMMAND_PREFIX = '$'

clientLoader.createClient(['GUILD_MEMBERS']).then(async (client) => {
  await commandLoader.load(client)

  client.on('guildMemberAdd', async (member) => {
    // Check if the role is present in the server, create it if not present
    let [roleExists, role] = await checkIfRoleExist(member.guild, 'Nouveau membre')
    if (!roleExists) {
      role = createRole(member.guild, 'Nouveau membre')
    }

    // Assign to new member
    assignRole(member, role)
  })

  client.on('messageCreate', async (message) => {
    // Return for messages sent by bots
    if (message.author.bot) return

    // Handle the xp and role assigning
    await onMessage(message)

    // Handle the sending of message between text channels named 'shared'
    if (message.channel.name === 'shared') {
      await sendMessagesToOtherChannels(message, 'shared')
    }

    // Ne pas tenir compte des messages envoyés par les bots, ou qui ne commencent pas par le préfix
    if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) return

    // On découpe le message pour récupérer tous les mots
    const words = message.content.split(' ')

    const commandName = words[0].slice(1) // Le premier mot du message, auquel on retire le préfix
    const arguments = words.slice(1) // Tous les mots suivants sauf le premier

    if (client.commands.has(commandName)) {
      // La commande existe, on la lance
      client.commands.get(commandName).run(client, message, arguments)
    } else {
      // La commande n'existe pas, on prévient l'utilisateur
      await message.delete()
      await message.channel.send(`The ${commandName} does not exist.`)
    }
  })
})
