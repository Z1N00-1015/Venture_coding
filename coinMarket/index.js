const express = require("express");
const { encryptPassword } = require("./utils");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();

const { member } = require("./models/member");
const { assets } = require("./models/assets");

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


app.use(express.urlencoded({ extended: true }));

const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  const [bearer, key] = authorization.split(" ");
  if (bearer !== "Bearer") return res.sendStatus(401);
};

app.get('/', async (req, res, next) => {
    res.send("Hello World");
  });

app.post(
  "/register",
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

    if (await member.findOne({ email })) {
      return res.status(400).json({ errors: { email: "Already registered" } });
    }

    const encryptedPassword = encryptPassword(password);

    return res.sendStatus(200);
}
);


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const member = await member.findOne({
        email,
        password: encryptPassword(password)
    });
    
    if (!member) return res.sendStatus(404);
    
    const key = crypto.randomBytes(24).toString("hex");
    member.key = key;
    await member.save();
    res.send({ key });
});

app.get("/coins",  async (req, res, next) => {
    res.send(["btc", "xrp", "bch", "eth"]);
  });




app.get("/assets", authentication, async(req, res) => {
    const Member = req.Member
    await res.send({assets})
}
)

app.listen(3000);