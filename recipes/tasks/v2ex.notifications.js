Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.v2ex.com/notifications').then(res => res.text())
])
.then(([{ cheerio }, body]) => {
  let $ = cheerio.load(body)
  return $('.cell[id^=n_]').map((i, el) => {
    return {
      message: $(el).find('td:nth-child(2) span:nth-child(1)').text()
    , iconUrl: 'https:' + $(el).find('td:nth-child(1) img.avatar').attr('src').replace('s=24&', '').replace('_mini', '_large')
    , url: 'https://www.v2ex.com' + $(el).find('td:nth-child(2) span:nth-child(1) a[href^="/t"]').attr('href')
    }
  }).get()
})
.then(commit)
