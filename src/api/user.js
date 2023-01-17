import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/attend/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/attend/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/attend/user/logout',
    method: 'post'
  })
}
