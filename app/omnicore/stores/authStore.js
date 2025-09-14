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
      menus: [],
      permissions: [],
    },
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

    setUserData(userData) {
      if (userData) {
        const { menus, permissions } = userData

        const menus2 = [
          {
            title: 'Dashboard',
            icon: 'home',
            route: 'dashboard',
          },
          {
            title: 'Project Overview',
            icon: 'chart-line',
            route: 'projectDashboard',
          },
          {
            title: 'Projects',
            icon: 'folder',
            route: 'project/project',
            children: [
              {
                title: 'All Projects',
                route: 'project/project',
              },
              {
                title: 'Create Project',
                route: 'project/project/create',
              },
            ],
          },
          {
            title: 'Expenses',
            icon: 'money-bill-trend-up',
            route: 'project/expense',
            children: [
              {
                title: 'All Expenses',
                route: 'project/expense',
              },
              {
                title: 'Create Expense',
                route: 'project/expense/create',
              },
            ],
          },
          {
            title: 'Expense Contributions',
            icon: 'hand-holding-dollar',
            route: 'project/expensecontribution',
            children: [
              {
                title: 'All Contributions',
                route: 'project/expensecontribution',
              },
              {
                title: 'Create Contribution',
                route: 'project/expensecontribution/create',
              },
            ],
          },
          {
            title: 'Financiers',
            icon: 'users',
            route: 'project/financier',
            children: [
              {
                title: 'All Financiers',
                route: 'project/financier',
              },
              {
                title: 'Create Financier',
                route: 'project/financier/create',
              },
            ],
          },
          {
            title: 'Project Expenses',
            icon: 'file-invoice-dollar',
            route: 'project/projectexpense',
            children: [
              {
                title: 'All Project Expenses',
                route: 'project/projectexpense',
              },
              {
                title: 'Create Project Expense',
                route: 'project/projectexpense/create',
              },
            ],
          },
          {
            title: 'Project Financiers',
            icon: 'user-tie',
            route: 'project/projectfinancier',
            children: [
              {
                title: 'All Project Financiers',
                route: 'project/projectfinancier',
              },
              {
                title: 'Create Project Financier',
                route: 'project/projectfinancier/create',
              },
            ],
          },
        ]

        this.user.menus = menus2 || {}
        this.user.permissions = permissions || []

        const encryptedMenus = encrypt(JSON.stringify(this.user.menus))
        const encryptedPermissions = encrypt(JSON.stringify(this.user.permissions))

        localStorage.setItem('user.menus', encryptedMenus)
        localStorage.setItem('user.permissions', encryptedPermissions)
      } else {
        console.warn('User data is missing or invalid.')
      }
    },

    getMenus() {
      return this.user.menus || []
    },

    getPermissions() {
      const encryptedPermissions = localStorage.getItem('user.permissions')
      if (!encryptedPermissions) return []

      try {
        return JSON.parse(decrypt(encryptedPermissions))
      } catch (error) {
        console.error('Failed to decrypt permissions:', error)
        return []
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

    logOutRequest() {
      this.removeToken()
      this.removeRefreshToken()
      localStorage.removeItem('user.menus')
      localStorage.removeItem('user.permissions')
    },
  },

  getters: {
    isAuthenticated: (state) => state.user.isAuthenticated,
  },
})
