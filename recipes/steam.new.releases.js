Promise.all([
  importScripts('http://bundle.gloria.pub/cheerio-0.20.0-bundle.js')
, fetch('http://store.steampowered.com/').then(res => res.text())
])
.then(([cheerio, html]) => {
  let $ = cheerio.load(html)
  return $('#tab_newreleases_content .tab_item').map((i, el) => {
    return {
      title: $('#tab_newreleases_content_trigger').text() + ': ' + $(el).find('.tab_item_name').text()
    , message: $(el).find('.tab_item_top_tags').text()
    , iconUrl: $(el).find('img.tab_item_cap_img').attr('src')
    , url: $(el).find('a.tab_item_overlay').attr('href')
    }
  }).get().filter(x => !!x.title)
})
.then(commit)
