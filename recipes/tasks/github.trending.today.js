Promise.all([
  importScripts('gloria-utils')
, fetch('https://github.com/trending').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.repo-list > li').map((i, el) => ({
    title: $(el).find('h3').text().replace(/^\s/g, '').replace(/\s$/g, '').replace(/\s{2,}/g, '')
  , message: $(el).find('.py-1').text().replace(/^\s/g, '').replace(/\s$/g, '').replace(/\s{2,}/g, '')
  , url: 'https://github.com' + $(el).find('h3 a').attr('href')
  , iconUrl: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
  })).get()
})
.then(commit)
