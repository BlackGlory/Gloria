Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.douyu.com/3614').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  const $ = cheerio.load(html)
  const script = $('script')
  .map((i, el) => $(el).text())
  .get()
  .reduce((pre, cur) => cur.length > pre.length ? cur : pre, '')
  const ROOM = eval(`(function(){
    var $Activity
    ;${script};
    return $ROOM
  })()`)
  return {
    title: ROOM.room_name
  , message: ROOM.show_status === 1 ? '勃了' : '摸了'
  , url: ROOM.room_url
  , iconUrl: ROOM.avatar.middle
  , imageUrl: ROOM.room_pic
  }
})
.then(commit)
