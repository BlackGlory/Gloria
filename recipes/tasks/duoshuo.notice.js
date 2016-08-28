fetch('https://duoshuo.com/api/users/unreadNotifications.json')
.then(res => res.json())
.then(json => {
  return json.response.map(x => {
    return {
      message: x.content
    , url: ((content) => {
        let result = content.match(/href="([^"]*)"/)
        if (result) {
          return result[1]
        }
        return undefined
      })(x.content)
    }
  })
})
.then(commit)
