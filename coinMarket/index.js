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




/* 초기 coin 모델 만들기
async function saveCoin() {
const btc = new Coin({name: 'btc'})
const eth = new Coin({name: 'eth'})
const bth = new Coin({name: 'bth'})
const xrp = new Coin({name: 'xrp'})
const usd = new Coin({name: 'usd'})
await btc.save()
await eth.save()
await xrp.save()
await bth.save()
await usd.save()
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
    const coin = await Coin.findOne({ name: "usd" });
    const asset = new Assets ({ user, coin, quantity: 100000 });
    await asset.save();
    console.log(asset)
    res.sendStatus(200);
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password: encryptPassword(password)
    });
    
    if (!user) return res.sendStatus(404);
    
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
  const price = await coinInfo[coinName]['usd']

  const btc = Coins.findOne({name: 'btc'})
  console.log(btc)

  res.send(`[${coinName}: ${price}]`)
  })
  


  app.post(`/coins/:id/buy`, authentication, async(req, res) => {
    const myAssets = await Assets.findOne({user: req.user});
    console.log(myAssets.coin)
    const { quantity } = req.body
    const coinName = req.params.id
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`)
    const coinInfo = await response.json()
    const price = await coinInfo[coinName]['usd']

    if(myAssets['usd']<=price * quantity){
      return res.status(400).json({ errors: { Assets: "Not enough Money" } });
      
    } else {
      
      const USD = myAssets['usd'] - price * quantity

      await Assets.findOneAndUpdate({user: req.user}, {"usd": USD, "btc": 1})
      
      const result = {
        "price": price,
        "quantity": quantity
      }

     return res.send(result)
    }
    })




app.get("/assets", authentication, async(req, res) => {
  const assets = await Assets.findOne({user: req.user});
  const coinNum = Object.keys(assets).length
  res.send(assets);
})





app.listen(3000);