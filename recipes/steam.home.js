Promise.all([
  importScripts('http://bundle.gloria.pub/cheerio-0.20.0-bundle.js')
, fetch('http://steamcommunity.com/my/home').then(res => res.text())
])
.then(([cheerio, html]) => {
  let $ = cheerio.load(html)
  return $('.blotter_block').map((i, el) => {
    return {
      title: $(el).find('.blotter_author_block').text().trim().replace(/\s/g, '')
    , iconUrl: $(el).find('.playerAvatar img').attr('src')
    , url: 'http://steamcommunity.com/my/home'
    }
  }).get().filter(x => !!x.title)
})
.then(commit)
