function fn2(json1, json2) {
  let resultJson = {};
  let json1Keys = Object.keys(json1);
  let json2Keys = Object.keys(json2);

  json1Keys.forEach((element) => {
    if (!json2Keys.includes(element)) {
      resultJson[element] = json1[element];
    }
  });
  return resultJson;
}

json1 = { a: "blur", b: "console" };
json2 = { b: "console", c: "debugger" };
console.log(fn2(json1, json2));
