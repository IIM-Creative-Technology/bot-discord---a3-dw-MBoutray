const Discord = require('discord.js')
/** @type {Array<string>} Array of insult strings */
const insultList = require('./insults.json')
const { sendPrivateMessage } = require('./message-handler')
const { executeQuery } = require('./database')
const { checkIfRoleExist, createRole, assignRole } = require('./roles-handler')

const MAX_INSULT_COUNT = 3

/**
 * Check if the message contains an insult
 * @param {Discord.Message} message The message that must be checked for insults
 * @returns {string | null} The insult in the message or null if it doesn't contain one
 */
const getInsultsFromMessage = (message) => {
  // Separate the content into words
  const messageWords = message.content.toLowerCase().split(' ')
  let insult = null

  // Compare the words of the message to the list of insults
  messageWords.some((word) => {
    insult = insultList.find((insult) => insult === word)

    return insult !== undefined
  })

  return insult
}

/**
 * Get the data from the database about the insults of the sender of the message
 * @param {Message} message Message received
 * @returns {Array<RowDataPacket> | null} Query response or null if the query failed
 */
const getUserData = async (message) => {
  return await executeQuery(
    `SELECT insult_count FROM insults WHERE user_id = ${message.author.id} AND guild_id = ${message.guild.id}`
  )
    .then((result) => {
      return result
    })
    .catch((err) => {
      console.log(`Error while getting ${message.author.username}'s data`, err)
      return null
    })
}

/**
 * Add a new entry to the insult count table
 * @param {Discord.Message} message Message received
 * @returns {boolean} Whether the entry was added successfully
 */
const addEntry = async (message) => {
  return await executeQuery(
    `INSERT INTO insults (user_id, guild_id, insult_count) VALUES (${message.author.id}, ${message.guild.id}, 1)`
  )
    .then(async (result) => {
      console.log(`User ${message.author.username} added to the insult table`)
      return true
    })
    .catch((err) => {
      console.log(`Error while adding the user ${message.author.username} to the insult table`, err)
      return false
    })
}

/**
 * Update the insult entry
 * @param {Discord.Message} message Message received
 * @param {number} newInsultCount The new value for the insult count
 * @returns {boolean} Whether the entry update was successful
 */
const updateEntry = async (message, newInsultCount) => {
  return await executeQuery(
    `UPDATE insults SET insult_count = ${newInsultCount} WHERE user_id = ${message.author.id} AND guild_id = ${message.guild.id}`
  )
    .then(async (result) => {
      console.log(`User ${message.author.username}'s insult table entry updated`)
      return true
    })
    .catch((err) => {
      console.log(`Error while updating the user ${message.author.username}'s insult table entry`, err)
      return false
    })
}

/**
 * Handle the message insult filtering
 * @param {Discord.Message} message Message to check for insults
 */
const onMessage = async (message) => {
  const insult = getInsultsFromMessage(message)
  const result = await getUserData(message)

  if (insult) {
    let insultCount = 1
    let privateMessage = ''

    // Verify that there is an entry for the user
    if (result && result.length > 0) {
      // Get the user's insult count and increment
      insultCount = result[0].insult_count + 1

      // Update the entry
      await updateEntry(message, insultCount)
    } else {
      await addEntry(message)
    }

    // If the user has less insults than the limit, warn him
    if (insultCount < MAX_INSULT_COUNT) {
      // Send the user a warning message
      privateMessage = `Bonjour ${message.author.username}, l'usage du mot "${insult}" est interdit dans le serveur ${
        message.guild.name
      }.\n ⚠ C'est votre ${insultCount}${
        insultCount === 1 ? 'er' : 'ème'
      } avertissement; après ${MAX_INSULT_COUNT} avertissements, c'est le ban ! ⚠`
    } else {
      // Send the user a ban message
      privateMessage = `Bonjour ${message.author.username}, l'usage du mot "${insult}" est interdit dans le serveur ${message.guild.name}.\n La dernière fois était votre dernier avertissement, vous avez donc été banni du serveur ${message.guild.name}.`

      // Ban the user
      await message.member
        .ban()
        .then((member) => {
          console.log(`Member ${message.author.username} was banned from server ${message.guild.name}`)
        })
        .catch(async (error) => {
          // If the bot doesn't have permission to ban the user, add a role instead
          // Check if the role is present in the server, create it if not present
          let [roleExists, role] = await checkIfRoleExist(message.guild, 'Botiful - Banni')
          if (!roleExists) {
            role = await createRole(message.guild, 'Botiful - Banni')
          }

          // Assign to new member
          await assignRole(message.member, role)

          console.log(`Error while banning ${message.author.username} from server ${message.guild.name}`, error)
        })
    }

    await message.delete()
    await sendPrivateMessage(message.author, privateMessage)
  }
}

module.exports.getUserData = getUserData
module.exports.getInsultsFromMessage = getInsultsFromMessage
module.exports.onMessage = onMessage
