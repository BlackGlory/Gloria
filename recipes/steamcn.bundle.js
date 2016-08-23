Promise.all([
  importScripts('gloria-utils')
, fetch('http://steamcn.com/forum.php?mod=forumdisplay&fid=271&filter=author&orderby=dateline').then(res => res.arrayBuffer())
])
.then(([{ cheerio }, html]) => {
  html = new TextDecoder('gbk').decode(html)
  let $ = cheerio.load(html)

  return $('#threadlisttableid [id^=normalthread] .common > a').map((i, el) => {
    return {
      message: $(el).text()
    , url: $(el).attr('href')
    , iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABqCAMAAADkzt2jAAAB11BMVEVXuuj39/dYuuhau+hswuqT0e5Zu+iR0O1fvel6x+tmwOlpwepqwepbvOhuw+pzxet0xet4x+uMzu2Nz+1hvulkv+mU0e6W0u6g1u/x9fby9ffz9vdlv+ns8/bu8/bT6fSx3PDK5vN7yOt/yezv9Pa23vFbu+hxxOqOz+1owOpgvul3xutdvOlivumY0+6a0+6e1e9nwOmh1u+t2/CKzu2z3fF8yOu33/G43/G74PHC4/LD4/LF5PLH5fPJ5fOQ0O3M5vPP6PNvw+rY6/Ta7PTb7PTg7vXk8PXm8fXp8vaLzu2FzOyJze2AyuyCy+yDy+z09vf19vf29/eEy+zV6vTu9Pbn8fam2O/O5/Or2vDR6PPR6fNeveltwurW6/TX6/SHzO203fFcvOjc7fTd7fXe7fXf7vV+yezj7/V2xuu53/Ho8fbp8fZlwOm+4fLB4vJyxOt4xutgvemPz+3G5PKi1++j1+/J5vOl2O+64PHq8vZjv+nW6vS03vF9yOya1O6b1O6Fy+yf1e+f1u91xevA4vLi7/WP0O15x+vl8PVrwurE5PKk1++S0O6Kze2n2fCo2fDt8/ap2fCByuzN5/Pw9Pas2/CV0u6u2/Cv2/BwxOrU6vSX0u4ex80IAAADr0lEQVR4Xu3YRZMqWRCG4fxOCe7uTru7u7ted3f3UXd3+bETQPeNZoCaKqBWXe+OzbPICOBkEtTr2NiardlUe8fH1mzGKY/JtHmdbkJZOh0v0xagPEGm/QTKeyLTdkF5rjrZmq3Zmq3ZjSragnr2XEote/6Hh6SSnegnUskefUNq2TMeUsv+1U6q2ZdINTtgV2YLkF+MU2b3Qn5xUmZ72hNRyOy5Qpvo3urgZ5DVhmKbiCW//1sGnckqtQtN/z76I6SbdVf9tvd8mJEcTdBRy97AffE8hop9XOtOMi2M7KFsT7labSLPRt8CSls01WWXsjj8paNZrtueZtV9Giz5Riq3zdPlR/Pzn0dG8467KvvzuVOPqFyXP/GfRr7orIOqsnXYmh9yMioT4yfub27e9qb+oupsJwAsTXXcqzCaNXf1e3Ej8u3NnkqS7JjC/53QzWGnPLn1K6U2gKUzH5j+n7ae9FZhA3vX/zCQdCvXoKNqbCD05YiLk6BP3AGcVdoAXp/vrDSarq8Dtb6R0/PxG+Xo9+a26/C2D91JTJSOpq9ee0Pk/MP/2k8lbIX3kx4qrmlR2f1EkLD3+SKanUAhofZ7lU4wsaO2uO5Vdq9iXOWyYpHNlN7ZpGPH8q6p2Sp03GzN1uyoP2kzCCHILvDTmq2l9wXgc95ErjFnurw905a1GXhxERj+BnJ64BZ5g12fBJrJgFzdtFjevqW/CuBqAOBtkNEoZ50BsBUDmtvoXUnb7UChQ/vu+DzyLYzPotDcyS0g8uJ6zgx3vR1A87rVHZGyp/UF6lV+NUMgJRKz3QXOmBkRvwDQhJ3Ic8GfJbYGZKgPb+2NXW5Hyh616LtDAF6PNZ0bS8CgH9p8oO8H4qux7QFuBaDWZ5v3LV3hqfR3NIhlMXDEho+NSNiYslJbz+FMJikOoEOMYhsAbGaAWgCs0wCQFp3of4yj9pbJGJSwgVdm2jmw25nX5/Ot0WTubtlo0BsB8gLwUbCA3ThbZGNS1Ena2L5I8YLtZHy+GDrFsMFlztm+vH2ACXSlyIaLOy1pI8StFOwOlka+fdEFwFFi/0K9xXYwzPsr2bsAcIV9C/ANQIK6ASCAcboERPUlNlrE35ArdGBjmFkr2W3293v+8bReA1KWvgweccLI7ZWLiFhMQwNWd6m9b2b2j3o6DalDGztUyW43Z9nj5C6ACybmQWBVT5dtY8BgmDU/W74FGF8CeGkEgAYBQLC9iaOzDZmDj0DknHHpePx+a7Zm/wvwVqj2lpzPIgAAAABJRU5ErkJggg=='
   }
 }).get()
})
.then(commit)
