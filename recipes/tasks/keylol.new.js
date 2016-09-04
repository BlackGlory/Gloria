fetch('https://api.keylol.com/states/[entrance.discovery]/')
.then(res => res.json())
.then(({ entrance: { discovery: { latestArticles } } }) => {
  return latestArticles.map(article => {
    let [avatar] = /[\w\d]{40}|[\w\d]{32}/.exec(article.authorAvatarImage)
      , iconUrl = (length => {
          switch (length) {
            case 32: return `https://storage.keylol.com/${ avatar }.jpg`
            case 40: return `https://steamcdn.keylol.com/steamcommunity/public/images/avatars/${ avatar.slice(0, 2) }/${ avatar }_full.jpg`
            default: return undefined
          }
        })(avatar.length)
    return {
      title: `${ article.title }`
    , message: `作者:${ article.authorUserName } 据点:${ article.pointChineseName || article.pointEnglishName }`
    , url: `https://www.keylol.com/article/${ article.authorIdCode }/${ article.sidForAuthor }`
    , iconUrl
    }
  }).filter(x => !!x)
})
.then(commit)
