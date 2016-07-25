Promise.all([
  importScripts('http://cdn.blackglory.me/cheerio-bundle.js')
, fetch('http://www.xiami.com/notice/head').then(res => res.text())
])
.then(([cheerio, body]) => {
  let $ = cheerio.load(body)
    , notifications = []
  $('.content_block ul li:not(.fence):not(.read)').each((i, el) => {
    if (!$(el).find('a').attr('href')) {
      return
    }
    notifications.push({
      iconUrl: 'http://img.xiami.net/images/group_photo/logo/47/12940146_3.png'
    , message: $(el).text().trim()
    , url: ((base, href) => {
        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            return `${base}${href}`
          } else {
            return `${base}/${href}`
          }
        }
        return href
      })('http://www.xiami.com', $(el).find('a').attr('href'))
    })
  })
  commit(notifications)
})
