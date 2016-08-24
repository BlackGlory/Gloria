Promise.all([
  importScripts('gloria-utils')
, fetch('https://cowlevel.net/user/notify/check?is_detail=1').then(res => res.json())
])
.then(([{ underscoreString }, json]) => {
  let msg = json.data.msg
    , comment = msg.comment.map(x => {
        if (x.action === 'answer_question_followed') {
          return {
            title: `${x.publisher_user.name} 回答了`
          , message: x.question.title
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/question/${x.question.id}#answer-${x.answer.id}`
          }
        }
        if (x.action === 'article_comment') {
          return {
            title: `${x.publisher_user.name} 回复了您`
          , message: x.article_comment.content
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/article/${x.article.id}`
          }
        }
        if (x.action === 'at_article_comment_level2') {
          return {
            title: `${x.publisher_user.name} @了您`
          , message: x.article_comment_level2.content
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/article/${x.article.id}`
          }
        }
        if (x.action === 'reply_comment' || x.action === 'reply_answer') {
          return {
            title: `${x.publisher_user.name} 回复了您`
          , message: x.comment.content
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/game/${x.question.id}`
          }
        }
      })
    , follow = msg.follow.map(x => ({
        title: '新的关注'
      , message: `${x.publisher_user.name} 关注了您`
      , iconUrl: x.publisher_user.avatar
      , updateAt: x.update_time
      }))
    , vote = msg.vote.map(x => {
        if (x.action === 'vote_answer') {
          return {
            title: `${x.publisher_user.name} 赞同了`
          , message: `您在 ${x.question.title} 的回答`
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/question/${x.question.id}#answer-${x.answer.id}`
          }
        }
        if (x.action === 'vote_comment') {
          return {
            title: `${x.publisher_user.name} 赞同了`
          , message: `您在 ${(x.question || x.post).title} 的评价`
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/game/${(x.question || x.post).id}/review/${x.comment.id}`
          }
        }
        if (x.action === 'vote_article') {
          return {
            title: `${x.publisher_user.name} 赞同了`
          , message: `您的文章 ${x.article.title}`
          , iconUrl: x.publisher_user.avatar
          , updateAt: x.update_time
          , url: `https://cowlevel.net/article/${x.article.id}`
          }
        }
      })
  return [...comment, ...follow, ...vote].filter(x => !!x).map(x => {
    return Object.assign({}, x, {
      title: underscoreString.stripTags(x.title).trim()
    , message: underscoreString.stripTags(x.message).trim()
    })
  })
})
.then(commit)
