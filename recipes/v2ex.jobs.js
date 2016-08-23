Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.v2ex.com/go/jobs').then(res => res.text())
])
.then(([{ cheerio }, body]) => {
  let $ = cheerio.load(body)
  return $('#TopicsNode .cell').map((i, el) => {
    return {
      title: $(el).find('.item_title').text()
    , iconUrl: 'https://' + $(el).find('img.avatar').attr('src')
    , url: 'https://www.v2ex.com' + $(el).find('.item_title a').attr('href')
    }
  }).get()
})
.then(commit)
