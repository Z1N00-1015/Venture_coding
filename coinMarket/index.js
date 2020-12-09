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
const { Coins } = require("./models/coins");

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Coinmarket?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


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
  const asset = await Assets.findbyId(id);
  if (!asset) return res.sendStatus(404)
  if (!asset.user.equals(req.user._id)) return res.sendStatus(401);

  req.asset = asset;
  next()

}



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

    const coin = await Coins.findOne({ code: "usd" });
    const asset = new Assets({ user });
    await asset.save();

    return res.sendStatus(200);
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




app.get("/assets", authentication, async(req, res) => {
  console.log(req.user._id)
  const assets = await Assets.find({user: req.user});
  console.log(assets)
  res.send(assets);
})





app.listen(3000);