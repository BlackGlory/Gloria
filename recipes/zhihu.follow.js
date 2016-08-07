Promise.all([
  importScripts('http://cdn.blackglory.me/cheerio-bundle.js')
, fetch('https://www.zhihu.com/noti7/stack/follow?limit=10').then(res => res.json())
])
.then(([cheerio, { msg }]) => {
  let $ = cheerio.load(msg)
    , notifications = []
  $('.zm-noti7-content-item').each((i, el) => {
    let notification = {
      iconUrl: $(el).find('img.zm-item-img-avatar').attr('src')
    , message: `${$(el).find('.author-link').text()} 关注了您`
    , url: ((base, href) => {
        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            return `${base}${href}`
          } else {
            return `${base}/${href}`
          }
        }
        return href
      })('http://www.zhihu.com', $(el).find('a.author-link').attr('href'))
    }
    notifications.push(notification)
  })
  commit(notifications)
})
