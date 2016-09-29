Promise.all([
  importScripts('gloria-utils')
, fetch('http://steamcommunity.com/my/commentnotifications/').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return $('.commentnotification').map((i, el) => {
    return {
      title: $('.profile_small_header_location').text()
    , message: $(el).find('.commentnotification_description').text()
    , id: $(el).find('.commentnotification_click_overlay a').attr('href')
    , url: $(el).find('.commentnotification_click_overlay a').attr('href')
    , iconUrl: $(el).find('.commentnotification_icon img').attr('src')
    }
  }).get()
})
.then(commit)
