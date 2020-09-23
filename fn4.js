function fn4(arr) {
  let maxNum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!maxNum) {
      maxNum = arr[i].length;
    }
    if (maxNum < arr[i].length) {
      maxNum = arr[i].length;
    }
  }

  let result = arr.filter((arr) => arr.length === maxNum);
  return result;
}

A = [
  [1, 2, 3],
  [2, 3],
  [1, 2, 3, 4],
  [1, 4],
  [1, 2, 3, 4, 5],
];

console.log(fn4(A));
