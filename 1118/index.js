const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const Task = mongoose.model('Task',
  {
    title: String,
    description: String,
    dueDate: String,
  },
);


const app = express();


app.use(express.urlencoded({extended: true}));

app.get('/', )


//signup: 회원가입 명령이 오면 User를 만들어주기
/*
  name: String (4~8 글자)
  password: String (30자 이내의 대소문자 및 특수문자)
  email: asdf@XXX.XXX (100자 이내)
*/

app.post('/signup', async(req, res, next) => {

    
})

//signin : 로그인 명령이 오면 valid한지 check한 후에, key를 발급

app.post('/signin', async(req, res, next) => {


})

app.listen(3000);