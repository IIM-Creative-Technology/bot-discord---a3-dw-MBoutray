const { executeQuery } = require('./database.js')
const { upgradeRole } = require('./roles-handler.js')

/** Number of xp earned per message */
const xpPerMessage = 1
/** Experience points required to reach the first level
 * Used in the calculation of the subsequent xp thresholds */
const xpNeedForFirstLevel = 5
/** Coefficient of increase of the xp required for the different levels */
const xpCurveCoeff = 0.3

/**
 * Get the data from the database about the sender of the message
 * @param {Message} message Message received
 * @returns {Array<RowDataPacket> | null} Query response or null if the query failed
 */
const getUserData = async (message) => {
  return await executeQuery(`SELECT * FROM xp WHERE user_id = ${message.author.id} AND guild_id = ${message.guild.id}`)
    .then((result) => {
      console.log(`User ${message.author.username}'s data received`)
      return result
    })
    .catch((err) => {
      console.log('Error while getting user data', err)
      return null
    })
}

/**
 * Create a new user in the database and assign first role to the user
 * @param {Message} message Message received
 * @param {number} [xpCount=0] Starting xp count
 * @param {number} [xpLevel=0] Starting xp level
 * @returns {boolean} Whether the user was successfully added to the database
 */
const addUser = async (message, xpCount = 0, xpLevel = 0) => {
  return await executeQuery(
    `INSERT INTO xp (user_id, guild_id, xp_count, xp_level) VALUES (${message.author.id}, ${message.guild.id}, ${xpCount}, ${xpLevel})`
  )
    .then(async (result) => {
      // Add the first role
      upgradeRole(message, 0)

      console.log(`User ${message.author.username} added to the database`)
      return true
    })
    .catch((err) => {
      console.log(`Error while adding the user ${message.author} to the database`, err)
      return false
    })
}

/**
 * Update the user's entry with the provided informations
 * @param {Message} message Message received
 * @param {RowDataPacket} userData User's database entry
 * @param {number} newXpCount New value for xp_count
 * @param {number} newXpLevel New value for xp_level
 * @returns {boolean} Whether the user's entry was successfully updated
 */
const updateUser = async (message, userData, newXpCount, newXpLevel) => {
  return await executeQuery(
    `UPDATE xp SET xp_count = ${newXpCount}, xp_level = ${newXpLevel} WHERE user_id = ${message.author.id} AND guild_id = ${message.guild.id}`
  )
    .then(async (result) => {
      // Upgrade the role if the user has leveled up
      if (userData.xp_level < newXpLevel) {
        await upgradeRole(message, newXpLevel)
      }

      console.log(`User ${message.author.username}'s database entry updated`)
      return true
    })
    .catch((err) => {
      console.log(`Error while updating the user ${message.author}'s database entry`, err)
      return false
    })
}

/**
 * Returns a boolean indicating whether the user can level up using their new xp count
 * @param {RowDataPacket} userData User's database entry
 * @param {number} newXpCount New value for xp_count
 * @returns Whether the user has enough xp to level up
 */
const canLevelUp = async (userData, newXpCount) => {
  // Calculate the total amount of xp needed to reach the next level
  let totalXpNeededForLevelUp = 0
  for (let level = 0; level <= userData.xp_level; level++) {
    totalXpNeededForLevelUp += Math.ceil(xpNeedForFirstLevel * Math.pow(1 + xpCurveCoeff, level))
  }

  return totalXpNeededForLevelUp === newXpCount
}

/**
 * Function holding the logic for the xp feature.
 * Levels up the user and assigns the correct roles.
 * @param {Message} message Message received
 */
const onMessage = async (message) => {
  const response = await getUserData(message)

  // Check if the user has already been added to the database
  if (response && response.length > 0) {
    const userData = response[0]
    const newXpCount = userData.xp_count + xpPerMessage

    // Update the user according to whether they leveled up or not
    await updateUser(
      message,
      userData,
      newXpCount,
      (await canLevelUp(userData, newXpCount)) ? userData.xp_level + 1 : userData.xp_level
    )
  } else {
    // Add the user to the database
    addUser(message, xpPerMessage)
  }
}

module.exports.getUserData = getUserData
module.exports.addUser = addUser
module.exports.updateUser = updateUser
module.exports.canLevelUp = canLevelUp
module.exports.onMessage = onMessage
