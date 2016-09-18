Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.zhihu.com/topic/20019119/newest').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.feed-item').map((i, el) => {
    return {
      iconUrl: 'https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg'
    , message: ($(el).find('.author-link').text() || $(el).find('.zm-item-answer-author-info').text().trim()) + '回答了 ' + $(el).find('.question_link').text().trim()
    , url: 'https://www.zhihu.com' + $(el).find('link[itemprop=url]').attr('href')
    , id: $(el).find('link[itemprop=url]').attr('href')
    }
  }).get()
})
.then(commit)
