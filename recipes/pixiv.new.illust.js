Promise.all([
  importScripts('http://bundle.gloria.pub/cheerio-0.20.0-bundle.js')
, fetch('http://www.pixiv.net/bookmark_new_illust.php').then(res => res.text())
])
.then(([cheerio, html]) => {
  let $ = cheerio.load(html)
    , user_ids = $('.image-item').map((i, el) => $(el).find('[data-user_id]').attr('data-user_id')).get()
  return fetch(`http://www.pixiv.net/rpc/get_profile.php?user_ids=${user_ids.join(',')}`)
  .then(res => res.json())
  .then(({ body }) => {
    let profile_img_dict = {}
    body.forEach(({ user_id, profile_img }) => {
      profile_img_dict[user_id] = profile_img
    })
    return profile_img_dict
  })
  .then(profile_img_dict => {
    return $('.image-item').map((i, el) => {
      let user_id = $(el).find('[data-user_id]').attr('data-user_id')
        , profile_img = profile_img_dict[user_id]
      return {
        title: $(el).find('h1').text()
      , message: $(el).find('[data-user_name]').data('user_name')
      , iconUrl: profile_img
      , imageUrl: $(el).find('img').attr('src')
      , url: 'http://www.pixiv.net' + $(el).find('a').attr('href')
      }
    }).get()
  })
})
.then(commit)
