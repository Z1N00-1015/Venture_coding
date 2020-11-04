const func2 = (obj, arr) => {
    const keys = Object.keys(obj);
    keys.forEach(e=>arr.push(obj[e]));
    return arr.filter(e => e%2 === 0);
}



console.log(func2({2: 5, 4: 6}, [5, 9, 10, 3]))