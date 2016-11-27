Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.taptap.com/notifications?type=4').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.auth-notifications-list li').map((i, el) => {
    return {
      title: $(el).find('.item-text a').first().text()
    , message: $(el).find('.item-text .text').text()
    , url: $(el).find('.item-text a').first().attr('href')
    , iconUrl: 'https://pic2.zhimg.com/ac82e9cff1390f1c9a91113081584ba9_l.jpeg'
    }
  }).get()
})
.then(commit)
