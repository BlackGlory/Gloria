export const TRANSPARENT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII='

export const CHROME_VERSION_MAIN = Number(/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1].split('.')[0])

export function loadVideo(url) : Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    let video = <HTMLVideoElement> document.createElement('video')
    video.addEventListener('load', () => resolve(video))
    video.addEventListener('error', reject)
    video.src = url
  })
}

export function imageToDataURI(img: HTMLImageElement) : string {
  let { canvas, ctx } = create2DCanvas(img.width, img.height)
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL()
}

export function loadImage(url) : Promise<HTMLImageElement> {
  if (url.startsWith('//')) {
    return Promise.race([
      loadImage(`https://${ url }`)
    , loadImage(`http://${ url }`)
    ])
  } else {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.addEventListener('load', () => resolve(img))
      img.addEventListener('error', reject)
      img.src = url
    })
  }
}

export function create2DCanvas(width: number, height: number) : { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return {
    canvas
  , ctx: canvas.getContext('2d')
  }
}
