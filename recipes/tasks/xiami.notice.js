Promise.all([
  importScripts('gloria-utils')
, fetch('http://www.xiami.com/notice/head').then(res => res.text())
])
.then(([{ cheerio }, body]) => {
  let $ = cheerio.load(body)
  return $('.content_block ul li:not(.fence):not(.read)').map((i, el) => {
    if (!$(el).find('a').attr('href')) {
      return
    }
    return {
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
    }
  }).get().filter(x => !!x)
})
.then(commit)
