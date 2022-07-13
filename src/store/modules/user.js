import { login, getInfo, refreshToken, passwordRegist } from '@/api/user'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    refresh_token: getRefreshToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.userGroup.includes(process.env.VUE_APP_GROUPID) === false) {
        // if ( false ) {
          reject('User not in admin group!')
        } else {
          commit('SET_TOKEN', response.access_token)
          commit('SET_REFRESH_TOKEN', response.refresh_token)
          commit('SET_NAME', response.userName)
          setToken(response.access_token)
          setRefreshToken(response.refresh_token)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  passwordRegist({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      passwordRegist({ username: username.trim(), password: password }).then(() => {
        // if (response.userGroup.includes(process.env.VUE_APP_GROUPID) === false) {
        // // if ( false ) {
        //   reject('User not in admin group!')
        // } else {
        //   commit('SET_TOKEN', response.access_token)
        //   commit('SET_REFRESH_TOKEN', response.refresh_token)
        //   commit('SET_NAME', response.userName)
        //   setToken(response.access_token)
        //   setRefreshToken(response.refresh_token)
        //   resolve()
        // }
        resolve()
      }).catch(response => {
        reject(response)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { username } = data
        commit('SET_NAME', username)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshToken(state.refresh_token).then(response => {
        commit('SET_TOKEN', response.access_token)
        setToken(response.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    removeToken() // must remove  token  first
    removeRefreshToken()
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeRefreshToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

