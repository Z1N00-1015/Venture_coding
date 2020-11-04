const fetch = require('node-fetch');
const cheerio = require('cheerio');

const scrapping = fetch("http://cba.snu.ac.kr/ko/notice")
    .then(function(html) {
    const totalHtml = cheerio.load(html)
    const titles = totalHtml.notice.title
    console.log(titles)
});
