import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v2/auth/login',
    // url: '/vue-admin-template/user/login',
    method: 'post',
    headers: {
      'X-Ca-Stage': process.env.VUE_APP_API_TAG,
      'Authorization': process.env.VUE_APP_APPCODE
    },
    params: {
      login_type: 'password'
    },
    data: new URLSearchParams({
      username: data['username'],
      password: data['password']
    })
  })
}

export function passwordRegist(data) {
  return request({
    url: '/api/v2/auth/regist',
    // url: '/vue-admin-template/user/login',
    method: 'post',
    headers: {
      'X-Ca-Stage': process.env.VUE_APP_API_TAG,
      'Authorization': process.env.VUE_APP_APPCODE
    },
    params: {
      regist_type: 'password'
    },
    data: new URLSearchParams({
      username: data['username'],
      password: data['password']
    })
  })
}

export function refreshToken(refresh_token) {
  return request({
    url: '/api/v2/auth/login',
    method: 'get',
    headers: {
      'X-Ca-Stage': process.env.VUE_APP_API_TAG,
      'Authorization': process.env.VUE_APP_APPCODE,
      'X_TOKEN': refresh_token
    },
    params: {
      action: 'refresh_token'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v2/users/myself',
    method: 'get',
    headers: {
      'X-Ca-Stage': process.env.VUE_APP_API_TAG,
      'Authorization': process.env.VUE_APP_APPCODE,
      'X_TOKEN': token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
