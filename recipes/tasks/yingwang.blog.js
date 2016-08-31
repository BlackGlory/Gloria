Promise.all([
  importScripts('gloria-utils')
, fetch('http://www.yinwang.org/').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.list-group-item').map((i, el) => ({
    title: '王垠发布了他的大作'
  , message: '《' + $(el).find('a').text() + '》'
  , url: $(el).find('a').attr('href')
  , iconUrl: 'https://avatars3.githubusercontent.com/u/396124'
})).get().slice(0, 30)
})
.then(commit)
