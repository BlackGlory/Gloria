Promise.all([
  importScripts('gloria-utils')
, fetch('https://github.com/').then(res => res.text())
])
.then(([{ cheerio, lodash }, html]) => {
  let $ = cheerio.load(html)
    , users = lodash.union(
    $('.title a:first-of-type')
    .map((i, el) => $(el).attr('href').split('/').filter(x => !!x))
    .get()
  )
  return fetch('https://api.github.com/search/users?q=' + encodeURIComponent(
    users
    .map(x => `user:${x}`)
    .join(' ')
  ))
  .then(res => res.json())
  .then(({ items }) => {
    let dict = {}
    items.forEach(item => dict[item.login] = item.avatar_url)
    return dict
  })
  .then(dict => {
    return $('.simple .title, .alert .title').map((i, el) => {
      let userName = $(el).find('a:first-of-type').attr('href').split('/')[1]
      return {
        title: $(el).text().trim()
      , url: 'https://github.com' + $(el).find('a:last-child').attr('href')
      , iconUrl: dict[userName]
      }
    }).get()
  })
})
.then(commit)
