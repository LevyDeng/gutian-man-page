import request from '@/utils/request'

export function getWorkVersions() {
  return request({
    url: '/api/v2/works/1',
    method: 'get',
    params: {
      action: 'get_versions'
    }
  })
}

export function getWorkVersion(workname) {
  return request({
    url: '/api/v2/works/' + workname + '/modified_at',
    method: 'get'
  })
}

export function getWork(workname) {
  return request({
    url: '/api/v2/works/' + workname,
    method: 'get'
  })
}

export function getAllWorks() {
  return request({
    url: '/api/controllers/controllers',
    method: 'get',
    params: {
      action: 'get_all_work_files'
    }
  })
}

export function updateWork(workname, content) {
  return request({
    url: '/api/v2/works/' + workname + '/characters',
    method: 'PUT',
    data: new URLSearchParams({
      'object': content
    })
  })
}

export function createWork(content) {
  return request({
    url: '/api/v2/works/',
    method: 'POST',
    data: new URLSearchParams({
      'object': content
    })
  })
}

export function checkWorkName(key, value) {
  return request({
    url: '/api/v2/works/',
    method: 'GET',
    params: {
      action: 'validate',
      [key]: value
    }
  })
}

