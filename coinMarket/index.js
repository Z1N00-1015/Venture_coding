const express = require("express");
const { encryptPassword } = require("./utils");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const crypto = require("crypto");
const fetch = require('node-fetch');
const CoinGecko = require('coingecko-api');
const jwt = require('jsonwebtoken');


const app = express();

const { User } = require("./models/user");
const { Assets } = require("./models/assets");
const { Coin } = require("./models/coins");
const { isNumber } = require("util");

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Coinmarket?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


app.use(express.urlencoded({ extended: true }));




const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  const [bearer, key] = authorization.split(" ");
  if (bearer !== 'Bearer') return res.sendStatus(401);
  const user = await User.findOne({ key });
  if (!user) return res.sendStatus(401);
  req.user = user;
  next();
};

const assetsAuthentication = async (req, res, next) => {
  const id = req.params.id;
  const asset = await Assets.findById(id);
  if (!asset) return res.sendStatus(404)
  if (!asset.user.equals(req.user._id)) return res.sendStatus(401);

  req.asset = asset;
  
  next()

}




//초기 coin 모델 만들기
/*
async function saveCoin() {
const btc = new Coin({symbol: 'btc', name: 'bitcoin'})
const eth = new Coin({symbol: 'eth', name: 'ethereum'})
const bth = new Coin({symbol: 'bth', name: 'bitcoin-cash'})
const xrp = new Coin({symbol: 'xrp', name: 'ripple'})
const usd = new Coin({symbol: 'usd', name: 'dollar'})
const ada = new Coin({symbol: 'ada', name: 'cardano'})
const xlm = new Coin({symbol: 'xlm', name: 'stellar'})
await btc.save()
await eth.save()
await xrp.save()
await bth.save()
await usd.save()
await xlm.save()
await ada.save()
}


(async () => {
  try{
    await saveCoin()
  }catch(err){console.log(err)
  }})()
*/



app.get('/', async (req, res, next) => {
    res.send("Hello World");
  });

app.post( "/register",
  [
    body("name").isLength({ min: 4, max: 12 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 16 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ errors: { email: "Already registered" } });
    }

    const encryptedPassword = encryptPassword(password);
    const user = new User({ email, name, password: encryptedPassword });
    await user.save();
    const coin = await Coin.find({ active: 1 });
    let quantity = {}
    let keys = []
    for (let i=0; i<=Object.values(coin).length-1; i++){
      keys.push(Object.values(coin)[i].name)
    }
    for(let i =0; i<=keys.length-1; i++){
      quantity[keys[i]] = 0
      if(keys[i] = 'usd') {quantity[keys[i]] = 10000}
    }
    console.log(quantity)

    const asset = new Assets ({ user, coin, quantity});
    await asset.save();
    res.sendStatus(200);
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password: encryptPassword(password)
    });
    
    if (!user) return res.sendStatus(404).json({ errors: { email: "Wrong ID or Password" } });
    
    const key = crypto.randomBytes(24).toString("hex");
    user.key = key;
    await user.save();
    res.send({ key });
});

app.get("/coins",  async (req, res, next) => {

  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2CEthereum%2Cripple%2Cbitcoin-cash&vs_currencies=usd')
    .then(res => res.json())
    .then(json => res.send(json));
  });


app.get(`/coins/:id`, async(req, res) => {
  const coinName = await req.params.id
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`)
  const coinInfo = await response.json()  

  if(await Object.keys(coinInfo).length === 0 ) {

    return res.status(400).json({error: { Coin : "그런 코인은 존재하지 않습니다." }})
  
  } else {


  const price = await coinInfo[coinName]['usd']


  res.send(`[Price of ${coinName}: ${price} USD]`)
  }
  })
  





  app.post(`/coins/:id/buy`, authentication, async(req, res) => {


    //지갑을 찾음
    const myAssets = await Assets.findOne({user: req.user});

    //수량 확인
    let { quantity } = await req.body
    quantity = await parseFloat(quantity)
    quantity = await quantity.toFixed(3)
    quantity = await Number(quantity)
    //코인 이름 및 가격 확인

    const keys = await Coin.find({active: 1})
    let allCoins = []

    for (let i=0; i<=Object.values(keys).length-1; i++){
      allCoins.push(Object.values(keys)[i].name)
    }

    const coinName = await req.params.id
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`)
    const coinInfo = await response.json()
  
    //존재하는 코인인지 확인
    if(await Object.keys(coinInfo).length === 0 ) {

      return res.status(400).json({error: { Coin : "그런 코인은 존재하지 않습니다." }})
    
    } else {


      //이 거래소에서 거래할 수 있는 코인인지 확인


      const keys = await Coin.find({active: 1})
      let allCoins = []
      for (let i=0; i<=Object.values(keys).length-1; i++){
        allCoins.push(Object.values(keys)[i].name)
      }


      //Coin Model에 포함되지 않는 경우 거래할 수 없음


      if( await allCoins.includes(`${coinName}`) === false ) {
      return res.status(400).json({error: { Buy : "이 거래소는 스캠코인을 취급하지 않습니다." }})
      } else {

        // 구매 가능한 코인인 경우


        const price = await coinInfo[coinName]['usd']
        

        //돈이 부족하면 살 수 없음
      if(myAssets.quantity['usd'] <= price * quantity){
      return res.status(400).json({ errors: { Assets: "Not enough Money" } });       
      } else {

        //돈이 충분하면 구입 후 계좌에 저장

  
        async function coinBuy() {
          const getCoin = await Coin.findOne({name: coinName})
          const coinFullName = getCoin.name
          const USD = await myAssets.quantity['usd'] - price * quantity
          myAssets.quantity['usd'] = USD
          myAssets.quantity[coinFullName] += quantity
          await myAssets.markModified('quantity');
          await console.log(myAssets.quantity)
          await myAssets.save(); 
        }
        
        await coinBuy()
  
        const result = await {
          "price": price,
          "quantity": quantity
        }
        return res.send(result)
      }
      
      }
    }
})



app.post(`/coins/:id/sell`, authentication, async(req, res) => {
  //서순 : 존재하는 코인인지 확인 -> 거래가능한 코인인지 확인 -> 요청확인 -> 잔고 확인 -> 거래

  //이용하는 변수

  let { quantity } = await req.body
  quantity = await parseFloat(quantity)
  quantity = await quantity.toFixed(3)
  quantity = await Number(quantity)
  const coinName = await req.params.id
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`)
  const coinInfo = await response.json()
  console.log(coinInfo)
  let price =0
  let coinFullName = []
  if (await Object.keys(coinInfo).length !== 0) {
    const price = await coinInfo[coinName]['usd'] 
    const coinFullName = getCoin.name
  }
  const myAssets = await Assets.findOne({user: req.user});
  const keys = await Coin.find({active: 1})
  let allCoins = []
    for (let i=0; i<=Object.values(keys).length-1; i++){
      allCoins.push(Object.values(keys)[i].name)
    }
  const getCoin = await Coin.findOne({name: coinName})
  const USD = await myAssets.quantity['usd'] + price * quantity



  //존재하는 코인인지 확인
  async function validCoin() {
    if(await Object.keys(coinInfo).length === 0 ) {
    return res.status(400).json({error: { Coin : "그런 코인은 존재하지 않습니다." }})  
    }}



  //코인 이름 및 가격 확인


  //이 거래소에서 거래할 수 있는 코인인지 확인

  async function canTrade() {
    if( await allCoins.includes(`${coinName}`) === false ) {
    return res.status(400).json({error: { Buy : "이 거래소는 스캠코인을 취급하지 않습니다." }})
    }
}



    //코인이 부족하면 팔 수 없음
    async function canNotSell() {
    if(Number(myAssets.quantity[coinFullName]) <= quantity){
    return res.status(400).json({ errors: { Assets: "Not enough Coin" } });    
      }
    }


   //코인이 충분하면 판매 후 계좌에 저장

    async function sellCoin() {
    myAssets.quantity['usd'] = USD
    myAssets.quantity[coinFullName] -= quantity
    await myAssets.markModified('quantity');
    await console.log(myAssets.quantity)
    await myAssets.save(); 
  }




  //거래 요청확인
  
  async function checkRequest() {
    if (await Object.keys(req.body).includes('quantity')) {
      let { quantity } = await req.body
      quantity = await parseFloat(quantity)
      quantity = await quantity.toFixed(3)
      quantity = await Number(quantity)



      await sellCoin()

    } else if (await Object.keys(req.body).includes('all')){
      if (await Object.values(req.body).includes('true')) {
        await sellAll()
      }
    } else {
      return res.status(400).json({error: { Request: "Request must be Number or All" } } )
    }
  }

//수정본

await validCoin()
await canTrade()
await checkCoin()
await checkWallet()
await canNotSell()
await checkRequest()





/// 밑으로 원본

/*


  //수량 확인

  let { quantity } = await req.body
  quantity = await parseFloat(quantity)
  quantity = await quantity.toFixed(3)
  quantity = await Number(quantity)

  if(await isNaN(quantity) === false) {

    if(quantity <= 0) {
      return res.status(400).json({error: { Quantity : "올바른 수량을 입력하여 주십시오." }})
    } else {


  //코인 이름 및 가격 확인

  const keys = await Coin.find({active: 1})
  let allCoins = []

  for (let i=0; i<=Object.values(keys).length-1; i++){
    allCoins.push(Object.values(keys)[i].name)
  }

  const coinName = await req.params.id
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`)
  const coinInfo = await response.json()

  //존재하는 코인인지 확인
  if(await Object.keys(coinInfo).length === 0 ) {

    return res.status(400).json({error: { Coin : "그런 코인은 존재하지 않습니다." }})
  
  } else {


    //이 거래소에서 거래할 수 있는 코인인지 확인


    const keys = await Coin.find({active: 1})
    let allCoins = []
    for (let i=0; i<=Object.values(keys).length-1; i++){
      allCoins.push(Object.values(keys)[i].name)
    }


    //Coin Model에 포함되지 않는 경우 거래할 수 없음


    if( await allCoins.includes(`${coinName}`) === false ) {
    return res.status(400).json({error: { Buy : "이 거래소는 스캠코인을 취급하지 않습니다." }})
    } else {

      // 거래 가능한 코인인 경우


      const price = await coinInfo[coinName]['usd']
      

      //코인이 부족하면 팔 수 없음
      const getCoin = await Coin.findOne({name: coinName})
      const coinFullName = getCoin.name

    if(Number(myAssets.quantity[coinFullName]) <= quantity){

    return res.status(400).json({ errors: { Assets: "Not enough Coin" } });    

    } else {

      //코인이 충분하면 판매 후 계좌에 저장

      async function coinSell() {
        const getCoin = await Coin.findOne({name: coinName})
        const coinFullName = getCoin.name
        const USD = await myAssets.quantity['usd'] + price * quantity
        myAssets.quantity['usd'] = USD
        myAssets.quantity[coinFullName] -= quantity
        await myAssets.markModified('quantity');
        await console.log(myAssets.quantity)
        await myAssets.save(); 
      }
      
      await coinSell()

      const result = await {
        "price": price,
        "quantity": quantity
      }
      return res.send(result)
    }
    
    }
  }
}
} else if{
  //전량판매 
  if(await Object.keys(req.body)[0] === 'all' && Object.value(req.body)[0] === 'true') {


  }








}
*/

})








app.get("/assets", authentication, async(req, res) => {
  const assets = await Assets.findOne({user: req.user});
  let assetsWithoutZero = {}

  for(let i =0; i <= Object.keys(assets.quantity).length-1; i++){
    if(assets.quantity[Object.keys(assets.quantity)[i]] !== 0) {
      assetsWithoutZero[Object.keys(assets.quantity)[i]] = Object.values(assets.quantity)[i]
  }
}
  res.send(assetsWithoutZero);
})





app.listen(3000);