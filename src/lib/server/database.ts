import { Database, open } from "sqlite"
import sqlite3 from "sqlite3";

// Bible db

var db: Database | null = null;

async function getDatabase(): Promise<Database> {
  if(db !== null) return db;
  db = await open({
    filename: './data/bible.db',
    driver: sqlite3.Database,
  });

  return db;
}

export async function getVerses(book: number, chapter: number, verses: number[]): Promise<Verse[]> {
  const db = await getDatabase();
  const placeholders: String = Array(verses.length).fill('?').join(',');
  const result = await db.all<Verse[]>('SELECT * FROM bible WHERE book = ? AND chapter = ? AND verse in ('+placeholders+');', book, chapter, ...verses);
  return result;
}

export async function getAllVersesInChapter(book: number, chapter: number) {
  const db = await getDatabase();
  const result = await db.all<Verse[]>('SELECT * FROM bible WHERE book = ? AND chapter = ?', book, chapter);
  
  return result;
}

// Temporary functions for Sets

var vb : MultiVerse[] = [
  {
    id: 0,
    book: 20,
    chapter: 12,
    verses: [1]
  },
  {
    id: 1,
    book: 45,
    chapter: 10,
    verses: [31]
  },
  {
    id: 2,
    book: 27,
    chapter: 6,
    verses: [1]
  },
  {
    id: 3,
    book: 27,
    chapter: 6,
    verses: [6]
  },
  {
    id: 4,
    book: 42,
    chapter: 8,
    verses: [31,32]
  },
  {
    id: 5,
    book: 18,
    chapter: 119,
    verses: [9,10,11]
  },
  {
    id: 6,
    book: 5,
    chapter: 1,
    verses: [8]
  },
  {
    id: 7,
    book: 18,
    chapter: 1,
    verses: [1,2,3,4,5,6]
  },
  {
    id: 8,
    book: 39,
    chapter: 4,
    verses: [4]
  },
  {
    id: 9,
    book: 54,
    chapter: 3,
    verses: [15,16,17]
  },
  {
    id: 10,
    book: 57,
    chapter: 4,
    verses: [12, 13]
  },
  {
    id: 11,
    book: 60,
    chapter: 1,
    verses: [20, 21]
  },
  {
    id: 12,
    book: 0,
    chapter: 1,
    verses: [1,2,3,4,5]
  },
  {
    id: 13,
    book: 0,
    chapter: 1,
    verses: [27,28]
  },
  {
    id: 14,
    book: 42,
    chapter: 3,
    verses: [16]
  },
  {
    id: 15,
    book: 22,
    chapter: 53,
    verses: [5,6]
  },
  {
    id: 16,
    book: 42,
    chapter: 14,
    verses: [6]
  },
  {
    id: 17,
    book: 42,
    chapter: 1,
    verses: [1,2,3,4,5,14]
  },
  {
    id: 18,
    book: 49,
    chapter: 2,
    verses: [5,6,7,8,9,10,11]
  },
  {
    id: 19,
    book: 44,
    chapter: 8,
    verses: [26,27,28]
  },
  {
    id: 20,
    book: 42,
    chapter: 14,
    verses: [26,27]
  },
  {
    id: 21,
    book: 43,
    chapter: 1,
    verses: [8]
  },
  {
    id: 22,
    book: 44,
    chapter: 3,
    verses: [23,24]
  },
  {
    id: 23,
    book: 44,
    chapter: 6,
    verses: [23]
  },
  {
    id: 24,
    book: 44,
    chapter: 5,
    verses: [8]
  },
  {
    id: 25,
    book: 44,
    chapter: 10,
    verses: [9,10]
  },
  {
    id: 26,
    book: 44,
    chapter: 8,
    verses: [1,2]
  },
  {
    id: 27,
    book: 39,
    chapter: 16,
    verses: [16,17,18,19]
  },
  {
    id: 28,
    book: 18,
    chapter: 23,
    verses: [1,2,3,4,5,6]
  },
  {
    id: 29,
    book: 47,
    chapter: 2,
    verses: [20]
  },
  {
    id: 30,
    book: 61,
    chapter: 4,
    verses: [7,8]
  },
  {
    id: 31,
    book: 53,
    chapter: 2,
    verses: [4]
  },
  {
    id: 32,
    book: 39,
    chapter: 6,
    verses: [33,34]
  },
  {
    id: 33,
    book: 51,
    chapter: 5,
    verses: [16,17,18,19,20,21,22]
  },
  {
    id: 34,
    book: 61,
    chapter: 2,
    verses: [15,16,17]
  },
  {
    id: 35,
    book: 23,
    chapter: 33,
    verses: [3]
  },
  {
    id: 36,
    book: 42,
    chapter: 15,
    verses: [7]
  },
  {
    id: 37,
    book: 40,
    chapter: 9,
    verses: [29]
  },
  {
    id: 38,
    book: 49,
    chapter: 4,
    verses: [6,7]
  },
  {
    id: 39,
    book: 42,
    chapter: 13,
    verses: [34,35]
  },
  {
    id: 40,
    book: 39,
    chapter: 22,
    verses: [37,38,39,40]
  },
  {
    id: 41,
    book: 39,
    chapter: 28,
    verses: [18,19,20]
  }
];

export async function getVerseBase(): Promise<MultiVerse[]> {
  return [...vb];
}

export async function addVerseBase(newMultiVerses: MultiVerse[]): Promise<MultiVerse[]> {
  vb.push(...newMultiVerses);
  return [...vb];
}

export async function clearVerseBase() {
  vb.clear();
}

export async function reorderVerse(oldIndex: number, newIndex: number): Promise<MultiVerse[]> {
  vb.move(oldIndex,newIndex);
  return [...vb]; 
}

export async function removeVerse(index: number): Promise<MultiVerse[]> {
  vb.removeAt(index);
  return [...vb];
}