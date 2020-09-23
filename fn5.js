function fn5(str) {
  let word = str.split(" ");
  let maxNum = 0;
  for (let i = 0; i < word.length; i++) {
    if (!maxNum) {
      maxNum = word[i].length;
    }
    if (maxNum < word[i].length) {
      maxNum = word[i].length;
    }
  }
  let longest = word.filter((word) => word.length === maxNum);
  return longest[0][2];
}

str = "hello, my name is conradss";
fn5(str);
