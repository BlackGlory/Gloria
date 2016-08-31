Promise.all([
  importScripts('gloria-utils')
, fetch('https://faxian.appinn.com/category/android').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.latestPost').map((i, el) => {
    return {
      title: 'Android 新发现: ' + $(el).find('.title').text().trim()
    , message: $(el).find('.front-view-content').text().trim()
    , url: $(el).find('.title a').attr('href')
    , iconUrl: 'https://faxian.appinn.com/wp-content/uploads/2016/04/logo150.png'
    , imageUrl: $(el).find('.featured-thumbnail img').attr('src')
    }
  }).get()
})
.then(commit)
