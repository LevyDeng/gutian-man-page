import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getRefreshToken, getToken } from '@/utils/auth'

async function againRequest(response) {
  await store.dispatch('user/refreshToken') // 同步以获取刷新 access_token 并且保存在 cookie/localstorage
  const config = response.config
  config.headers['X_TOKEN'] = getToken() // 以新的 access_token
  const res = await axios.request(config) // 重新进行原请求
  return res.data // 以error.response.config重新请求返回的数据包是在函数内是 被封装在data里面
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X_TOKEN'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X_TOKEN'] = getToken()
      config.headers['Authorization'] = process.env.VUE_APP_APPCODE
      config.headers['X-Ca-Stage'] = process.env.VUE_APP_API_TAG
    }
    const params = config.params
    if (params) {
      if (Object.keys(params).includes('action')) {
        if (params['action'] === 'refresh_token') {
          // console.log('config.url', config.url, getRefreshToken())
          config.headers['X_TOKEN'] = getRefreshToken() // 登录时本地 cookie/localstorage 存储的
        }
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    // if the custom code is not 20000, it is judged as an error.
    if ([200, 201, 202].includes(res.status) === false) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 401) {
        return againRequest(res)
      } else if (res.status === 402) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
