Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.youtube.com/feed/subscriptions?flow=2').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.item-section').map((i, el) => {
    return {
      title: $(el).find('.shelf-title-table h2').text().trim() + ' upload'
    , message: $(el).find('.expanded-shelf h3 a').text().trim()
    , url: 'https://www.youtube.com' + $(el).find('.expanded-shelf h3 a').attr('href')
    , imageUrl: $(el).find('.expanded-shelf img').data('thumb') || $(el).find('.expanded-shelf img').attr('src')
    , iconUrl: $(el).find('.shelf-title-table img').attr('src')
    }
  }).get().slice(0, 30)
})
.then(commit)
