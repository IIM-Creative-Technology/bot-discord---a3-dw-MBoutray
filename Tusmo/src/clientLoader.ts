// const Discord = require('discord.js')
import { Intents } from 'discord.js'
import { Client } from 'discordx'
require('dotenv').config()

module.exports = {
  /**
   * @param {Array} intents
   * @returns {Promise<Discord.Client>}
   */
  createClient: async (intents: number[] = []) => {
    // Set default intents
    if (intents && intents.length > 0) {
      if (!intents.includes(Intents.FLAGS.GUILD_MESSAGES)) {
        intents = [...intents, Intents.FLAGS.GUILD_MESSAGES]
      }
      if (!intents.includes(Intents.FLAGS.GUILDS)) {
        intents = [...intents, Intents.FLAGS.GUILDS]
      }
    }

    if (!intents || intents.length === 0) {
      intents = [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
    }

    // Create the client using the corresponding intents
    const client = new Client({
      intents: intents
    })

    return client
      .login(process.env.TOKEN ?? '')
      .then(() => {
        if (client.user != null) {
          console.log(
            `The bot is online! Invite it with this link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
          )
        }
        return client
      })
      .catch((error) => {
        throw error
      })
  }
}
