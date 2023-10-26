const paylines = [
  [1, 4, 7, 10, 13], //payline 1
  [0, 3, 6, 9, 12],  //payline 2
  [2, 5, 8, 11, 14], //payline 3
  [0, 4, 8, 10, 12], //payline 4
  [2, 4, 6, 10, 14], //payline 5
  [1, 3, 6, 9, 13], //payline 6
  [1, 5, 8, 11, 13], //payline 7
  [0, 3, 7, 11, 14], //payline 8
  [2, 5, 7, 9, 12], //payline 9
  [1, 5, 7, 9, 13], //payline 10
  [1, 3, 7, 11, 13], //payline 11
  [0, 4, 7, 10, 12], //payline 12
  [2, 4, 7, 10, 14], //payline 13
  [0, 4, 6, 10, 12], //payline 14
  [2, 4, 8, 10, 14], //payline 15
  [1, 4, 6, 10, 13], //payline 16
  [1, 4, 8, 10, 13], //payline 17
  [0, 3, 8, 9, 12], //payline 18
  [2, 5, 6, 11, 14], //payline 19
  [0, 5, 8, 11, 12], //payline 20
  [2, 3, 6, 9, 14], //payline 21
  [1, 5, 6, 11, 13], //payline 22
  [1, 3, 8, 9, 13], //payline 23
  [0, 5, 6, 11, 12], //payline 24
  [2, 3, 8, 9, 14], //payline 25
];
const paytable = {
  1: { 3: 6, 4: 12, 5: 50 },
  2: { 3: 5, 4: 10, 5: 40 },
  3: { 3: 4, 4: 8, 5: 30 },
  4: { 3: 3, 4: 6, 5: 20 },
  5: { 3: 2, 4: 4, 5: 10 },
  6: { 3: 1, 4: 2, 5: 5 },
};
const matchingSymbols = [];

export function checkSymbolsOnPayline(grid, symbolsToMatch) {
  matchingSymbols.splice(0, matchingSymbols.length);
  let totalwin = 0;
  for (let i = 0; i < paylines.length; i++) {
    const payline = paylines[i];
    let have5Kind = true;
    let have4Kind = true;
    let whichkind = 0;
    const symbol1 = grid[payline[0]];
    const symbol2 = grid[payline[1]];
    const symbol3 = grid[payline[2]];
    const symbol4 = grid[payline[3]];
    const symbol5 = grid[payline[4]];
    if (symbol1 === symbol2 && symbol2 === symbol3 && symbol3 === symbol4 && symbol4 === symbol5 && symbolsToMatch.includes(symbol1)) {
      have5Kind = false;
      whichkind = 5;
      const wins: any = calculatePayout(5, symbol1, i + 1);
      matchingSymbols.push({ symol: symbol1, payline: i + 1, kind: 5, win: wins });
      totalwin = wins + totalwin;
    }
    if (symbol1 === symbol2 && symbol2 === symbol3 && have5Kind && symbol3 === symbol4 && symbolsToMatch.includes(symbol1)) {
      have4Kind = false;
      whichkind = 4;
      const wins: any = calculatePayout(4, symbol1, i + 1);
      matchingSymbols.push({ symol: symbol1, payline: i + 1, kind: 4, win: wins });
      totalwin = wins + totalwin;
    }
    if (symbol1 === symbol2 && symbol2 === symbol3 && have5Kind && have4Kind && symbolsToMatch.includes(symbol1)) {
      whichkind = 3;
      const wins: any = calculatePayout(3, symbol1, i + 1);
      matchingSymbols.push({ symol: symbol1, payline: i + 1, kind: 3, win: wins });
      totalwin = wins + totalwin;
    }
  }
  return matchingSymbols;
}
function calculatePayout(matchLength, symbol, payline) {
  const win = paytable[symbol][matchLength];
  console.log(`win=${win}symbol:${symbol}kind:${matchLength}payline:${payline}`);
  return win;
}