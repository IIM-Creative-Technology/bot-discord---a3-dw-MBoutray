import { parse, stringify } from 'csv/sync'
import fs from 'fs'

module.exports = {
  /**
   *
   * @param {string} filePath Chemin vers le fichier à parser
   * @returns {Array<Object>}
   */
  load: (filePath, delimiter = '\t', columns = false) => {
    const content = fs.readFileSync(filePath)
    const words = parse(content, { columns: columns, delimiter: delimiter })

    return words
  },
  write: (filePath, content) => {
    fs.writeFileSync(filePath, stringify(content))
  }
}
