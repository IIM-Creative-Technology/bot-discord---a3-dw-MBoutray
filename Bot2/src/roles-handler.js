/** Base string of role names */
const levelString = 'Botiful-lvl-'
/** Map of the user level to the colors of the roles */
const roleColors = new Map([
  [0, 'LIGHT_GREY'],
  [1, 'GREEN'],
  [2, 'AQUA'],
  [3, 'BLUE'],
  [4, 'PURPLE'],
  [5, 'YELLOW'],
  [6, 'ORANGE'],
  [7, 'RED']
])

/**
 * Check if the role has already been created on the server the message was sent on
 * @param {Message} message Message received
 * @param {string} roleName Name of the role to verify
 * @returns {[boolean, Role | null]} First value of tuple corresponds to if the role was found
 * Second value of tuple corresponds to the role component
 */
const checkIfRoleExist = async (message, roleName) => {
  return await message.guild.roles
    .fetch()
    .then((roles) => {
      //Search the roles of the guild for a role that matches the role name
      const foundRole = roles.find((r) => r.name === roleName)

      foundRole ? console.log(`Role ${roleName} found`) : console.log(`Role ${roleName} not found`)

      return foundRole ? [true, foundRole] : [false, null]
    })
    .catch((err) => {
      console.log('Error while looking for role ' + roleName, err)
      return [false, null]
    })
}

/**
 * Create a role using the specified message level
 * @param {Message} message Message received
 * @param {number} xpLevel Level number for the role to be created
 * @returns {Role | null} Role created, null if the creation wasn't successful
 */
const createRole = async (message, xpLevel) => {
  return await message.guild.roles
    .create({ name: levelString + xpLevel, color: roleColors.get(xpLevel) })
    .then((role) => {
      console.log(`Role ${role.name} created`)
      return role
    })
    .catch((err) => {
      console.log(`Error while creating the role ${levelString + xpLevel}`, err)
      return null
    })
}

/**
 * Assign the role to the sender of the message
 * @param {Message} message Message received
 * @param {Role} role Role to assign to the sender
 * @returns {boolean} Role was assigned successfully or not
 */
const assignRole = async (message, role) => {
  return await message.member.roles
    .add(role)
    .then((member) => {
      console.log(`Role ${role.name} assigned to ${member.user.username}`)
      return true
    })
    .catch((err) => {
      console.log('error while creating the role ' + role.name, err)
      return false
    })
}

/**
 * Remove the role from the sender of the message
 * @param {Message} message Message received
 * @param {Role} role Role to remove from the sender
 * @returns {boolean} Role was removed successfully or not
 */
const removeRole = async (message, role) => {
  return await message.member.roles
    .remove(role)
    .then((result) => {
      console.log(`Role ${role.name} removed`, result)
      return true
    })
    .catch((err) => {
      console.log('Error occured while removing the role' + role.name, err)
      return false
    })
}

/**
 * Get the Role object from a name string
 * @param {Message} message Message received
 * @param {string} roleName Name of the role
 * @returns {Role | undefined} Role that was found, undefined if not found
 */
const getGuildRoleFromName = (message, roleName) => {
  return message.guild.roles.cache.find((role) => {
    return role.name === roleName
  })
}

/**
 * Find out if the user has a certain role
 * @param {Message} message Message received
 * @param {Role} role Role to find on the user
 * @returns {boolean} Whether the user has the role
 */
const userHasRole = (message, role) => {
  return message.member.roles.cache.find((r) => r === role) !== undefined
}

/**
 * Upgrade the role of the user or assign the first one if it's their first message
 * @param {Message} message Message received
 * @param {number} level Level of the role to upgrade to
 * @returns {boolean} Whether the role was successfully upgraded
 */
const upgradeRole = async (message, level) => {
  // Get the previous role
  const previousRole = getGuildRoleFromName(message, levelString + (level - 1))

  // Remove previous role
  if (previousRole && userHasRole(message, previousRole)) {
    await removeRole(message, previousRole)
  }

  // If the next role doesn't exist, create it
  let [roleExists, role] = await checkIfRoleExist(message, levelString + level)
  if (!roleExists) {
    role = await createRole(message, level)
  }

  // Assign the new role to the user
  return await assignRole(message, role)
}

module.exports.checkIfRoleExist = checkIfRoleExist
module.exports.createRole = createRole
module.exports.assignRole = assignRole
module.exports.removeRole = removeRole
module.exports.userHasRole = userHasRole
module.exports.getGuildRoleFromName = getGuildRoleFromName
module.exports.upgradeRole = upgradeRole
module.exports.roleColors = roleColors
