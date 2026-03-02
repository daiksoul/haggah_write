import { shortNames } from "./data";

export function verseCompare(a: number, b: number) {
  let c = (a > 0) ? a : -a / 1000;
  let d = (b > 0) ? b : -b / 1000;

  return c - d;
}

export function numberArrayToString(array: number[]): string {
  var unfoldedArray = [];

  for (const value of array) {
    if (value > 0) {
      unfoldedArray.push(value);
    } else {
      unfoldedArray.push(Math.floor(value / 1000));
      unfoldedArray.push(value % 1000);
    }
  }

  var tmp = unfoldedArray[0];
  var count = 0;
  var v = `${tmp}`;

  for (let i = 0; i < unfoldedArray.length; i++) {
    if (tmp == unfoldedArray[i]) {
      tmp++;
      count++;
    } else {
      if (count == 1) {
        v += ",";
      } else {
        v += `-${tmp - 1},`;
      }
      count = 1;
      v += `${unfoldedArray[i]}`;
      tmp = unfoldedArray[i] + 1;
    }
  }
  if (count > 1) {
    v += `-${tmp - 1}`;
  }

  return v;
}

export function stringToNumberArray(input: string): number[] {
  let toReturn = [];

  let indices = input.split(",");

  for (let idx of indices) {
    //console.log(idx);
    if (idx.includes("-")) {

      let [one, two] = idx.split("-");

      //console.log(one);
      //console.log(two);

      for (let i = parseInt(one); i <= parseInt(two); i++) {
        toReturn.push(i);
      }

    } else {
      toReturn.push(parseInt(idx))
    }
  }

  return toReturn;
}

export function multiverseShortName(mult: MultiVerse): string {
  return `${shortNames[mult.book]} ${mult.chapter} : ${numberArrayToString(mult.verses)}`
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`
}

// correct connected verses
export function correctifyAddress(book: number, chapter: number, verses: number[]): { book: number, chapter: number, verses: number[] } {
  let newVerses = [...verses]

  if (book == 5 && chapter == 6 && (verses.indexOf(18) > -1 || verses.indexOf(19) > -1)) {
    newVerses.remove(18);
    newVerses.remove(19);
    newVerses.push(-18019);
  } else if (book == 5 && chapter == 15 && (verses.indexOf(4) > -1 || verses.indexOf(5) > -1)) {
    newVerses.remove(4);
    newVerses.remove(5);
    newVerses.push(-4005);
  } else if (book == 5 && chapter == 30 && (verses.indexOf(9) > -1 || verses.indexOf(10) > -1)) {
    newVerses.remove(9);
    newVerses.remove(10);
    newVerses.push(-9010);
  } else if (book == 13 && chapter == 16 && (verses.indexOf(12) > -1 || verses.indexOf(13) > -1)) {
    newVerses.remove(12);
    newVerses.remove(13);
    newVerses.push(-12013);
  } else if (book == 19 && chapter == 92 && (verses.indexOf(1) > -1 || verses.indexOf(2) > -1 || verses.indexOf(3) > -1)) {
    newVerses.remove(1);
    newVerses.remove(2);
    newVerses.remove(3);
    newVerses.push(-1003);
  } else if (book == 19 && chapter == 105 && (verses.indexOf(5) > -1 || verses.indexOf(6) > -1)) {
    newVerses.remove(5);
    newVerses.remove(6);
    newVerses.push(-5006);
  } else if (book == 24 && chapter == 32 && (verses.indexOf(3) > -1 || verses.indexOf(4) > -1 || verses.indexOf(5) > -1)) {
    newVerses.remove(3);
    newVerses.remove(4);
    newVerses.remove(5);
    newVerses.push(-3005);
  } else if (book == 24 && chapter == 33 && (verses.indexOf(10) > -1 || verses.indexOf(11) > -1)) {
    newVerses.remove(10);
    newVerses.remove(11);
    newVerses.push(-10011);
  } else if (book == 26 && chapter == 24 && (verses.indexOf(4) > -1 || verses.indexOf(5) > -1)) {
    newVerses.remove(4);
    newVerses.remove(5);
    newVerses.push(-4005);
  } else if (book == 44 && chapter == 15 && (verses.indexOf(25) > -1 || verses.indexOf(26) > -1)) {
    newVerses.remove(25);
    newVerses.remove(26);
    newVerses.push(-25026);
  } else if (book == 45 && chapter == 9 && (verses.indexOf(1) > -1 || verses.indexOf(2) > -1)) {
    newVerses.remove(1);
    newVerses.remove(2);
    newVerses.push(-1002);
  }

  return {
    book,
    chapter,
    verses: newVerses
  }
}
