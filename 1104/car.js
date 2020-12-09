class Car {
    constructor(name, color, price, x) {
    this.name = name;
    this.color = color;
    this.price = price;
    this.x = x;
    }
    move(x) {
        this.x += x;
        console.log(`현재 ${this.name}의 위치는 ${this.x}입니다.`)
    }
    horn(){
        console.log(`비켜라 이놈들아. 내 ${this.color} ${this.name}는 ${this.price}짜리야!!`)
    }
    changeColor(newColor){
        this.color = newColor
        console.log(`${this.name}차를 ${this.color}색으로 바꿨어요!`)
    }
}


const ferrari = new Car('ferrari', 'Red', '10억', 0)
const audi = new Car('audi', 'black', '8천만원', 0)

/*ferrari.horn()
audi.move(10)

const cars = [ferrari, audi];

cars.forEach((car) => car.move(5))

function changeAllColor(cars) {
    cars.forEach((car) => car.changeColor('black'))
    cars.forEach((car) => console.log(`${car.color} ${car.name}로 변신 완료!`))
}

changeAllColor(cars);

*/

console.log(ferrari)