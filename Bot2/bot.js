const clientLoader = require('./src/clientLoader')
const commandLoader = require('./src/commandLoader')
const xpHandler = require('./src/xp-handler')
const shareMessage = require('./src/share-message')
require('colors')

const COMMAND_PREFIX = '$'
const MEMBERS = new Map([
  ['Théo', 260525837315604490n],
  ['Dylan', 425682756249452545n],
  ['Alex', 433366920905883648n],
  ['Martin', 120133103304835072n]
])

clientLoader.createClient(['GUILD_MEMBERS']).then(async (client) => {
  await commandLoader.load(client)

  client.on('messageCreate', async (message) => {
    // Return for messages sent by bots
    if (message.author.bot) return

    // Handle the xp and role assigning
    await xpHandler.onMessage(message)

    // Handle the sending of message between text channels named 'shared'
    if (message.channel.name === 'shared') {
      await shareMessage.sendMessagesToOtherChannels(message, 'shared')
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
