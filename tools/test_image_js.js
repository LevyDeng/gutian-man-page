const { Image } = require('image-js')

const Pixels = [
  [108, 27],
  [108, 81],
  [108, 135],
  [108, 189],
  [108, 243],
  [108, 297],
  [108, 351],
  [108, 405]
]

async function execute(image_path) {
  const image = await Image.load(image_path)
  const data = image.data
  var arr = []
  for (var i in Pixels) {
    var p = (Pixels[i][1] * 216 + Pixels[i][0]) * 3
    arr.push([data[p], data[p + 1], data[p + 2]])
  }
  return arr
  // console.log(image)
}

