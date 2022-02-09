const wordLoader = require('./wordLoader')

// get the content of the words db
const initialWords = wordLoader.load('./src/Lexique383.tsv', undefined, true)

const seenWords = new Set() //Create a list of words already seen
const processedWords = initialWords
  .filter((word) => {
    const excludedSymbols = ['à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'ö', 'ù', 'û', 'ü', 'ÿ', 'ç', '-']
    const exclude = excludedSymbols.some((symbol) => word.ortho.includes(symbol))

    const duplicate = seenWords.has(word.ortho) //Determine if the word is a duplicate
    seenWords.add(word.ortho) //Try to add the word to the set, will get added if unique

    // Return conditions:
    //   - Must not be a duplicate
    //   - The word must be 5 letter-word
    //   - The word must not be a 'onomatopée' (a word describing a sound)
    //   - The word must not contain any symbols
    return !duplicate && word.nblettres === '5' && word.cgram !== 'ONO' && !exclude
  })
  .map((word) => [word.ortho]) //Transform the data into an array of one word arrays

//Write the words to a file
wordLoader.write('./src/words-no-symbols.csv', processedWords)
