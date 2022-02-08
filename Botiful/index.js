const Discord = require('discord.js')
require('dotenv').config()
const client = new Discord.Client({
  intents: ['GUILD_MESSAGES', 'GUILDS']
})
client.on('ready', () => {
  console.log('bot ready')
})
client
  .login(process.env.TOKEN)
  .then(() => console.log('connection successful'))
  .catch((err) => console.log(err))

const MSG_PREFIX = '!m-'
const INSULTS = ['Abruti', 'Salo', 'Idiot', 'Mange-mort']

client.on('messageCreate', async (message) => {
  if (!message.author.bot && message.content.startsWith(MSG_PREFIX)) {
    const words = message.content.split(' ')
    const command = words[0].slice(MSG_PREFIX.length)
    console.log(command)
    const arguments = words.slice(1)

    switch (command) {
      case 'insult':
        await message.channel.send(INSULTS[Math.floor(Math.random() * INSULTS.length)])
        break
      case 'test':
        await message.delete()
        await message.channel.send('message supprimé')
        break
    }
  }
})
