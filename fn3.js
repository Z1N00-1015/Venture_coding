function fn3(arr) {
  let A = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].age > 30) {
      A.push(arr[i].name);
    }
  }
  return A;
}

arr = [
  { name: "Jin", age: 22 },
  { name: "Brown", age: 42 },
  { name: "blue", age: 50 },
];

let result = fn3(arr);
console.log(result);
