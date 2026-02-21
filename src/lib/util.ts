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
