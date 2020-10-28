function func3(arr) {
    let result = []
    for(let i = 0; i < arr.length; i++) {
        result = result.concat(Object.keys(arr[i]))
    }
    return result
}

arr = [{'a': 2, 'b': 3}, {'c': 4, 'd': 5}]
console.log(func3(arr))