const express = require('express');
const mongoose = require('mongoose');
const {User} = require('./models/User')
const { body, validationResult } = require('express-validator');


mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();


app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res, next) => {
    res.send("Hello World");
  });


//signup: 회원가입 명령이 오면 User를 만들어주기
/*
  name: String (4~8 글자)
  password: String (30자 이내의 대소문자 및 특수문자)
  email: asdf@XXX.XXX (100자 이내)
*/

app.post('/signup', [
    body('name').isLength({ min: 5, max: 20 }),
    body('email').isEmail(),
    body('password').isLength({ min: 10, max: 20 })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, name, password} = req.body
    if (await User.findOne({email})) {
        return res.status(400).json({ email: "Email Alreday Used" });
    }
  const user = new User ({email, name, password})
  await user.save
  res.sendStatus(200)
});


//signin : 로그인 명령이 오면 valid한지 check한 후에, key를 발급

app.post('/signin', async(req, res) => {
    const {email, password} = req.body;
    const user = User.findOne({
        email,
        password
    })
    if(!user) return res.sendStatus(400);

})

app.listen(3000);