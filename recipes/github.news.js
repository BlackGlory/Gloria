Promise.all([
  importScripts('http://bundle.gloria.pub/cheerio-0.20.0-bundle.js')
, fetch('https://github.com/').then(res => res.text())
])
.then(([cheerio, html]) => {
  let $ = cheerio.load(html)
  return $('.simple .title').map((i, el) => {
    return {
      title: $(el).text().trim()
    , url: 'https://github.com/' + $(el).find('a:last-child').attr('href')
   }
 }).get()
})
.then(commit)
