const fetch = require('node-fetch');
const cheerio = require('cheerio');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://zinoo:scot1015@cluster0.bzrdg.mongodb.net/Cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });
const kitty = new Cat({ name: 'Zildjian' });

kitty.save().then(() => console.log('meow'));