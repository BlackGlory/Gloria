fetch('https://cowlevel.net/user/notify/check?is_detail=1')
.then(res => res.json())
.then(json =>
  Array
  .from(Object.keys(json.data.msg))
  .reduce((result, val) => result.concat(json.data.msg[val]), [])
  .map(({ publisher_user: { name, avatar }, notify_title, update_time, notify_url  }) => ({
    title: `${ name } ${ notify_title.split(' ')[0] }`
  , message: notify_title.split(' ').slice(1).join(' ')
  , iconUrl: avatar
  , updateAt: update_time
  , url: notify_url
  }))
)
.then(commit)
