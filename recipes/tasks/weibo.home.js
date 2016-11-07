Promise.all([
  importScripts('gloria-utils')
, fetch('http://weibo.com/home').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  let script = $('script')
  .map((i, el) => $(el).text())
  .get()
  .reduce((pre, cur) => cur.length > pre.length ? cur : pre, '')
  return new Promise((resolve, reject) => (function(FM) {
      eval(script)
    })({
      view({ html }) {
        resolve(html)
      }
    })
  )
  .then(html => {
    let $ = cheerio.load(html)
    return $('[node-type=homefeed] .WB_feed_detail').map((i, el) => ({
      iconUrl: $(el).find('.WB_face img').attr('src')
    , title: $(el).find('.WB_info a').first().text().trim().replace(/\s+/g, ' ')
    , message: $(el).find('.WB_text').text().trim().replace(/\s+/g, ' ')
    , imageUrl: $(el).find('.WB_media_wrap img').attr('src')
    })).get()
  })
})
.then(commit)
