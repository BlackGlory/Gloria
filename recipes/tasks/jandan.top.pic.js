Promise.all([
  importScripts('gloria-utils')
, fetch('http://jandan.net/top').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('#pic .commentlist li[id^=comment]').not((i, el) => {
    let oo = Number($(el).find('[id^=cos_support]').text())
      , xx = Number($(el).find('[id^=cos_unsupport]').text())
    return ((oo + xx) >= 50 && (oo / xx) < 0.618 )
  }).map((i, el) => {
    return {
      title: '@' + $(el).find('.author strong').text() + ':'
    , message: $(el).find('.text p').text().replace(/\[查看原图\]/g, '').trim()
    , url: $(el).find('.text small b a').attr('href')
    , imageUrl: $(el).find('img[src]').attr('src')
    , id: $(el).find('.text small b a').attr('href')
    , iconUrl: 'http://cdn.jandan.net/wp-content/themes/egg/images/logo-2015.gif'
    }
  }).get()
})
.then(commit)
