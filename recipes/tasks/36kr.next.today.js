Promise.all([
  importScripts('gloria-utils')
, fetch('http://next.36kr.com/posts').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('#category_swicher + .post ul.product-list li.product-item').map((i, el) => {
    return {
      title: 'NEXT 新产品: ' + $(el).find('.post-url').text()
    , message: $(el).find('.post-tagline').text()
    , url: 'http://next.36kr.com' + $(el).find('.post-url').attr('href')
    }
  }).get()
})
.then(commit)
