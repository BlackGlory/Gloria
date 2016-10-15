Promise.all([
  importScripts('gloria-utils')
, fetch('http://store.steampowered.com/').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('#tab_newreleases_content .tab_item').map((i, el) => {
    return {
      title: $('#tab_newreleases_content_trigger').text() + ': ' + $(el).find('.tab_item_name').text()
    , message: $(el).find('.tab_item_top_tags').text()
    , iconUrl: $(el).find('img.tab_item_cap_img').attr('src')
    , url: $(el).attr('href')
    }
  }).get()
})
.then(commit)
