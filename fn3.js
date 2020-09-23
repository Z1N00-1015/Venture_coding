function fn3(arr) {
  let ageOld = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].age > 30) {
      ageOld.push(arr[i].name);
    }
  }
  return ageOld;
}

arr = [
  { name: "Jin", age: 22 },
  { name: "Brown", age: 42 },
  { name: "blue", age: 50 },
];

console.log(fn3(arr));
