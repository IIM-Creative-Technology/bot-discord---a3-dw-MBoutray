const levelString = 'Botiful-lvl-'
const roleColors = new Map([
  [0, 'LIGHT_GREY'],
  [1, 'GREEN'],
  [2, 'AQUA'],
  [3, 'BLUE'],
  [4, 'PURPLE'],
  [5, 'YELLOW'],
  [6, 'ORANGE'],
  [7, 'RED'],
  [8, 'YELLOW']
])

const checkIfRoleExist = async (message, roleName) => {
  return await message.guild.roles
    .fetch()
    .then((roles) => {
      const foundRole = roles.find((r) => r.name === roleName)

      return foundRole ? [true, foundRole] : [false, null]
    })
    .catch((err) => {
      console.log('Error while looking for role ' + roleName, err)
      return [false, null]
    })
}

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

const removeRole = async (message, role) => {
  await message.member.roles
    .remove(role)
    .then((result) => {
      console.log(`Role ${role.name} removed`)
    })
    .catch((err) => {
      console.log('Error occured while removing the role' + role.name, err)
    })
}

const getGuildRoleFromName = (message, roleName) => {
  return message.guild.roles.cache.find((role) => {
    return role.name === roleName
  })
}

const userHasRole = (message, role) => {
  return message.member.roles.cache.find((r) => r === role) !== undefined
}

const upgradeRole = async (message, newXpLevel) => {
  // Get the previous role
  const previousRole = getGuildRoleFromName(message, levelString + (newXpLevel - 1))

  // Remove previous role
  if (previousRole && userHasRole(message, previousRole)) {
    await removeRole(message, previousRole)
  }

  // If the next role doesn't exist, create it
  let [roleExists, role] = await checkIfRoleExist(message, levelString + newXpLevel)
  if (!roleExists) {
    role = await createRole(message, newXpLevel)
  }

  // Assign the new role to the user
  await assignRole(message, role)
}

module.exports.checkIfRoleExist = checkIfRoleExist
module.exports.createRole = createRole
module.exports.assignRole = assignRole
module.exports.removeRole = removeRole
module.exports.userHasRole = userHasRole
module.exports.getGuildRoleFromName = getGuildRoleFromName
module.exports.upgradeRole = upgradeRole
