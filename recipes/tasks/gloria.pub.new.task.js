fetch('https://api.gloria.pub/tasks?page=1')
.then(res => res.json())
.then(({ list }) => {
  return list.map(task => {
    return {
      title: 'Gloria.Pub new task!'
    , message: `${task.name} by ${task.author}`
    , url: `https://gloria.pub/task/${task._id}`
    }
  })
})
.then(commit)
