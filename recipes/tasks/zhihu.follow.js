Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.zhihu.com/noti7/stack/follow?limit=10').then(res => res.json())
])
.then(([{ cheerio }, { msg }]) => {
  let $ = cheerio.load(msg)
  return $('.zm-noti7-content-item').map((i, el) => {
    return {
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
  }).get()
})
.then(commit)
