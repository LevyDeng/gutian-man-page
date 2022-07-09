import { getWorkVersions, getWorkVersion, getWork } from '@/api/work'
// import axios from 'axios'

// function get_file_from_url(file_url) {
//   return new Promise(
//     (resolve, reject) => {
//       axios.get(file_url).then(
//         response => {
//           resolve(response.data)
//         }
//       ).catch(error => {
//         reject(error)
//       })
//     }
//   )
// }

const state = {
  works: localStorage.getItem('works') ? JSON.parse(localStorage.getItem('works')) : {},
  workVersions: localStorage.getItem('workVersions') ? JSON.parse(localStorage.getItem('workVersions')) : {},
  currentWork: '',
  currentPage: '',
  createWorkVisible: false
}

const mutations = {
  UPDATE_WORK: (state, payload) => {
    var works = localStorage.getItem('works') ? JSON.parse(localStorage.getItem('works')) : {}
    try {
      var workname = payload['workname']
    } catch (e) {
      console.log(e)
    }
    state.works[workname] = payload
    works[workname] = payload
    localStorage.setItem('works', JSON.stringify(works))
  },
  CLEAR_WORK_VERSION: (state) => {
    state.workVersions = {}
  },
  UPDATE_WORK_VERSION: (state, payload) => {
    var workVersions = localStorage.getItem('workVersions') ? JSON.parse(localStorage.getItem('workVersions')) : {}
    try {
      var workname = payload['workname']
    } catch (e) {
      console.log(e)
    }
    state.workVersions[workname] = payload
    workVersions[workname] = payload
    localStorage.setItem('workVersions', JSON.stringify(workVersions))
  },
  SET_CURRENT_WORK: (state, workname) => {
    state.currentWork = workname
  },
  SET_CURRENT_PAGE: (state, pagename) => {
    state.currentPage = pagename
  },
  SET_CREATE_WORK_VISIBLE: (state) => {
    state.createWorkVisible = !state.createWorkVisible
  },
  CREATE_CHARACTER: (state, workname) => {
    state[workname]['characters']['new_character'] = { 'id': state[workname]['charecters'].length }
  }
}

const actions = {
  // user login
  async getWorkVersions({ commit, state }) {
    const resp = await getWorkVersions()
    const { data } = resp
    commit('CLEAR_WORK_VERSION')
    // console.debug(data)
    for (var k of data) {
      // console.debug(k)
      commit('UPDATE_WORK_VERSION', k)
    }
  },

  async checkUpdate({ commit, state }, workname) {
    const resp = await getWorkVersion(workname)
    const { data } = resp
    // console.debug(state.workVersions[workname]['modified_at'])
    if ((Object.keys(state.works).includes(workname) === false) || (Object.keys(state.works).includes(workname) === true && data > state.works[workname]['modified_at'])) {
      const resp1 = await getWork(workname)
      const data1 = resp1['data']
      console.debug(resp1)
      commit('UPDATE_WORK', data1)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
