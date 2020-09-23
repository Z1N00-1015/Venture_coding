function fn4(arr) {
  let maxNum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (maxNum === 0) {
      maxNum = arr[i].length;
    }
    if (maxNum < arr[i].length) {
      maxNum = arr[i].length;
    }
  }

  let result = arr.filter((arr) => arr.length === maxNum)[0];
  sumResult = 0;
  for (let j = 0; j < result.length; j++) {
    sumResult += result[j];
  }

  return sumResult;
}

A = [
  [1, 2, 3],
  [2, 3],
  [1, 2, 3, 4],
  [1, 4],
  [1, 2, 3, 4, 5],
];

console.log(fn4(A));
