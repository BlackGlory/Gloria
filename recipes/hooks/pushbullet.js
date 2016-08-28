function reducer(notification) {
  let data = {
    type: 'note'
  , title: notification.title
  , body: notification.message
  }

  if (notification.url) {
    data.type = 'link'
    data.url = notification.url
  }

  fetch('https://api.pushbullet.com/v2/pushes', {
    method: 'POST'
  , headers: {
      'Access-Token': 'YOUR_ACCESS_TOKEN'
    , 'Content-Type': 'application/json'
    }
  , body: JSON.stringify(data)
  })
  .then(res => res.json())

  return notification
}
