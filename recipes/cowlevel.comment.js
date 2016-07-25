fetch('https://cowlevel.net/user/notify/read-tab?type=comment')
.then(res => res.json())
.then(json => {
  if (json.data.length > 0) {
    console.log(json.data)
    commit({
      message: '夭寿啦'
    })
  }
})
