interface Verse {
  id: number,
  book: number,
  chapter: number,
  verse: number,
  content: String,
}

interface MultiVerse {
  id: number,
  book: number,
  chapter: number,
  verses: number[],
  orderNumber: number,
}
