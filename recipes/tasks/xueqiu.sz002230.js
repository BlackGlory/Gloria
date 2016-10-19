fetch('https://xueqiu.com/v4/stock/quotec.json?code=SZ002230&_=' + Date.now())
.then(res => res.json())
.then(({ SZ002230: [price, stockUp, quotePercentage, date] }) => ({
  title: '科大讯飞 股价变动'
, message: `￥${price} ${stockUp > 0 ? '+' + stockUp : stockUp} (${ quotePercentage })`
, url: 'https://xueqiu.com/S/SZ002230'
, iconUrl: 'https://assets.imedao.com/images/favicon.png'
}))
.then(commit)
