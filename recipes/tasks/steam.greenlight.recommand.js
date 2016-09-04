Promise.all([
  importScripts('gloria-utils')
, fetch('http://steamcommunity.com/sharedfiles/browse/?browsefilter=torate&appid=765&browsesort=torate').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.workshopItem').map((i, el) => {
    let text = $(el).text().replace(/[\t|\r]/g, '').trim().split('\n')
    return {
      title: text[0]
    , message: text[1]
    , iconUrl: $(el).find('.workshopItemPreviewImage').attr('src')
    , url: $(el).find('a').attr('href')
    }
  }).get()
})
.then(commit)
