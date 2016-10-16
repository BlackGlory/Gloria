fetch('https://www.random.org/integers/?num=1&min=1&max=2&col=1&base=10&format=plain&rnd=new')
.then(res => res.text())
.then(oneOrTwo => ({ message: oneOrTwo }))
.then(commit)
