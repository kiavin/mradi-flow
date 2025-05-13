import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import { encrypt, decrypt } from '../helpers/crypto'

export const useAuthStore = defineStore('userAuth', {
  state: () => ({
    user: {
      isAuthenticated: false,
      username: null,
      token: null,
      ipAddr: null
    }
  }),

  actions: {
    initStore() {
      const storedToken = localStorage.getItem('user.token')
      const storedUsername = localStorage.getItem('user.username')

      if (storedToken && storedUsername) {
        this.setToken(storedToken, storedUsername)
        console.log('Store initialized')
      }

      console.log('Store initialized')
    },

    setToken(token, username) {
      this.user.token = token
      this.user.username = username
      this.user.isAuthenticated = true

      localStorage.setItem('user.token', token)
      localStorage.setItem('user.username', username)
      localStorage.setItem('loggedIn', true)
    },

    removeToken() {
      this.user.token = null
      this.user.username = null
      this.user.isAuthenticated = false

      localStorage.removeItem('user.token')
      localStorage.removeItem('user.username')
      localStorage.removeItem('loggedIn')
    },

    setIp(ipAddr) {
      this.user.ipAddr = ipAddr
      sessionStorage.setItem('ipA', ipAddr)
    },

    // secure token
    setRefreshToken(refreshToken) {
      const encrypted = encrypt(refreshToken)
      localStorage.setItem('user.refreshToken', encrypted)
    },

    getRefreshToken() {
      const encrypted = localStorage.getItem('user.refreshToken')
      if (!encrypted) return null
      try {
        const bytes = decrypt(encrypted)
        return bytes.toString(CryptoJS.enc.Utf8)
      } catch (e) {
        return null
      }
    },

    removeRefreshToken() {
      localStorage.removeItem('user.refreshToken')
    }
  },

  getters: {
    isAuthenticated: (state) => state.user.isAuthenticated
  }
})
