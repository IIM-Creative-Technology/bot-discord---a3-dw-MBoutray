const db = require('./database.js')
const rolesHandler = require('./roles-handler.js')

const xpPerMessage = 1
const xpNeedForFirstLevel = 5
const xpCurveCoeff = 0.3

const checkUser = async (message) => {
  return await db
    .executeQuery(`SELECT * FROM xp WHERE user_id = ${message.author.id}`)
    .then((result) => {
      return result
    })
    .catch((err) => {
      return null
    })
}

const addUser = async (message, xpCount = 0, xpLevel = 0) => {
  return await db
    .executeQuery(`INSERT INTO xp (user_id, xp_count, xp_level) VALUES (${message.author.id}, ${xpCount}, ${xpLevel})`)
    .then(async (result) => {
      // Check if the role exists
      // const roleExists = await rolesHandler.checkIfRoleExist(message, levelString + xpLevel)

      // // If the role doesn't exist, create it
      // let roleToAssign = null
      // if (!roleExists) {
      //   roleToAssign = await rolesHandler.createRole(message, levelString + xpLevel, 'GREEN')
      // } else {
      //   // if it exists, get it
      //   // roleToAssign = message
      // }

      // // If the sender, has a previous role, remove it
      // rolesHandler.userHasRole(message)
      // // if (condition) {
      // // }

      return result
    })
    .catch((err) => {
      return null
    })
}

const updateUser = async (message, userData, newXpCount, newXpLevel) => {
  return await db
    .executeQuery(`UPDATE xp SET xp_count = ${newXpCount}, xp_level = ${newXpLevel} WHERE user_id = ${message.author.id}`)
    .then(async (result) => {
      // If the user levels up
      if (userData.xp_level < newXpLevel) {
        await rolesHandler.upgradeRole(message, newXpLevel)
      }

      return result
    })
    .catch((err) => {
      return null
    })
}

const canLevelUp = async (userData, newXpCount) => {
  // Calculate the total amount of xp needed to reach the next level
  let totalXpNeededForLevelUp = 0
  for (let level = 0; level <= userData.xp_level; level++) {
    totalXpNeededForLevelUp += Math.ceil(xpNeedForFirstLevel * Math.pow(1 + xpCurveCoeff, level))
  }

  console.log(totalXpNeededForLevelUp, newXpCount)

  return totalXpNeededForLevelUp === newXpCount
}

const onMessage = async (message) => {
  const response = await checkUser(message)

  if (response && response.length > 0) {
    const userData = response[0]
    const newXpCount = userData.xp_count + xpPerMessage

    if (await canLevelUp(userData, newXpCount)) {
      await updateUser(message, userData, newXpCount, userData.xp_level + 1)
    } else {
      await updateUser(message, userData, newXpCount, userData.xp_level)
    }
  } else {
    addUser(message, xpPerMessage)
  }
}

module.exports.checkUser = checkUser
module.exports.addUser = addUser
module.exports.updateUser = updateUser
module.exports.canLevelUp = canLevelUp
module.exports.onMessage = onMessage
