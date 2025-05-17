import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import { encrypt, decrypt } from '../helpers/crypto'
import { decodeJwt } from '../helpers/jwtDecode'

export const useAuthStore = defineStore('userAuth', {
  state: () => ({
    user: {
      isAuthenticated: false,
      username: null,
      token: null,
      ipAddr: null,
      menus: (() => {
        try {
          const value = localStorage.getItem('user.menus')
          return value ? JSON.parse(value) : {}
        } catch (e) {
          console.warn('Failed to parse user.menus:', e)
          return {}
        }
      })(),
      permissions: (() => {
        try {
          const value = localStorage.getItem('user.permissions')
          return value ? JSON.parse(value) : []
        } catch (e) {
          console.warn('Failed to parse user.permissions:', e)
          return []
        }
      })()
    }
  }),

  actions: {

    initStore() {
      const encryptedToken = localStorage.getItem('user.token')
      const storedUsername = localStorage.getItem('user.username')

      if (encryptedToken && storedUsername) {
        try {
          const token = decrypt(encryptedToken)
          this.setToken(token, storedUsername)
          console.log('Store initialized with decrypted token')
        } catch (e) {
          console.warn('Failed to decrypt token:', e)
          this.removeToken()
        }
      } else {
        console.log('No stored token or username found')
      }
    },


    setToken(token, username) {
      const encryptedToken = encrypt(token)
      this.user.token = token
      this.user.username = username
      this.user.isAuthenticated = true

      localStorage.setItem('user.token', encryptedToken) // Save encrypted token
      localStorage.setItem('user.username', username)
      localStorage.setItem('loggedIn', true)
    },


    setUserDataFromToken(dataToken) {
      const decoded = decodeJwt(dataToken)

      if (decoded?.data) {
        const { username, menus, permissions } = decoded.data

        if (username) {
          this.user.username = username
          localStorage.setItem('user.username', username)
        }

        this.user.menus = menus || {}
        this.user.permissions = permissions || []

        localStorage.setItem('user.menus', JSON.stringify(this.user.menus))
        localStorage.setItem('user.permissions', JSON.stringify(this.user.permissions))
      } else {
        console.warn('Could not decode data token or missing data.')
      }
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
    },

    logOutRequest(){

    }
  },

  getters: {
    isAuthenticated: (state) => state.user.isAuthenticated
  }
})
