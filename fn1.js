function fn1(arr) {
  let sum = 0;
  for (i = 0; i < arr.length; i++) {
    elem = arr[i] % 3;
    sum += elem;
  }
  return sum;
}

arr = [1, 2, 3, 4, 5, 6, 7];
fn1(arr);
