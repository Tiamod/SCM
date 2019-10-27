import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'querystring'
import Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUser: Cookie.get('account'),
    token: Cookie.get('token'),
    loginTime: Cookie.get('loginTime'),
    userList: []
  },
  mutations: {
    setUserList (state, payload) {
      state.userList = payload.userList
    }
  },
  actions: {
    login ({commit}, payload) {
      Cookie.set('loginTime', payload.time)
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: 'api/sys/login',
          data: qs.stringify(payload.user)
        }).then(
          resp => {
            const result = resp.data
            if (result.code === 2) {
              resolve(result)
              console.log(result)
              Cookie.set('account', result.data.user.account)
              Cookie.set('token', result.data.token)
            } else {
              reject(result)
            }
          }
        )
      })
    },
    getUserList ({commit}, payload) {
      console.log(payload.page)
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: 'api/main/system/user/show',
          params: {
            page:payload.page
          }
        }).then(
          resp => {
            const result = resp.data
            if (result.list) {
              resolve(result.list)
              commit({
                type: 'setUserList',
                userList: result.list
              })
            } else {
              reject(resp)
            }
          }
        )
      })
    }
  },
  modules: {
  }
})
