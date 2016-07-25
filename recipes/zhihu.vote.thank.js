Promise.all([
  importScripts('http://cdn.blackglory.me/cheerio-bundle.js')
, fetch('https://www.zhihu.com/noti7/stack/vote_thank?limit=10').then(res => res.json())
])
.then(([cheerio, { msg }]) => {
  let $ = cheerio.load(msg)
    , notifications = []
  $('.zm-noti7-content-item').each((i, el) => {
    notifications.push({
      message: $(el).text()
    , url: ((base, href) => {
        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            return `${base}${href}`
          } else {
            return `${base}/${href}`
          }
        }
        return href
      })('http://www.zhihu.com', $(el).find('a').attr('href'))
    })
  })
  commit(notifications)
})
