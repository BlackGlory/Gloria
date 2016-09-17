Promise.all([
  importScripts('gloria-utils')
, fetch('https://github.com/trending').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.repo-list .repo-list-item').map((i, el) => ({
    title: $(el).find('.repo-list-name').text().replace(/^\s/g, '').replace(/\s$/g, '').replace(/\s{2,}/g, '')
  , message: $(el).find('.repo-list-description').text().replace(/^\s/g, '').replace(/\s$/g, '').replace(/\s{2,}/g, '')
  , url: 'https://github.com' + $(el).find('.repo-list-name a').attr('href')
  , iconUrl: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
  })).get()
})
.then(commit)
