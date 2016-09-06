Promise.all([
  importScripts('gloria-utils')
, fetch('http://www.taptap.com/top/reserve').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('#topList .top-card').map((i, el) => {
    return {
      title: $(el).find('.top-card-middle a h4').text().replace(/\s/g, '')
    , message: $(el).find('.card-middle-description').text().replace(/\s/g, '')
    , url: $(el).find('.top-card-middle a').attr('href')
    , iconUrl: $(el).find('.top-card-left img').attr('src')
    , imageUrl: $(el).find('.card-right-image img').attr('src')
    }
  }).get()
})
.then(commit)
