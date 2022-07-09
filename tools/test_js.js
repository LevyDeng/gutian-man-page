var axios = require('axios')

function test() {
  axios.get('http://gutian-dev.oss-cn-zhangjiakou.aliyuncs.com/work/arknights.json?OSSAccessKeyId=LTAI5tG7M76EjJdB7BSzEe47&Expires=1647970912&Signature=QyA9mykJK%2FnDPDPEob%2Fi%2FIOGeDM%3D').then(response => {
    console.log(response.data)
    return response
  }).catch(error => {
    console.error(error)
  })
}

test()
