import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { UserInfo } from '@/types/user'
import { deleteCookie, getCookie, setCookie } from '@/utils/cookie'

const DEFAULT_USER: UserInfo = {
  id: '1',
  username: 'admin',
  phone: '13800138000',
  email: 'admin@example.com',
  avatar: '',
}

const DEFAULT_PASSWORD = 'admin'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref(false)

  function initFromCookie(): void {
    const savedUserInfo = getCookie('userInfo')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
        isLoggedIn.value = true
      } catch {
        userInfo.value = null
        isLoggedIn.value = false
      }
    }
  }

  function login(username: string, password: string): boolean {
    if (username === DEFAULT_USER.username && password === DEFAULT_PASSWORD) {
      const savedUserInfo = getCookie('userInfo')
      if (savedUserInfo) {
        try {
          const parsed = JSON.parse(savedUserInfo)
          userInfo.value = { ...DEFAULT_USER, ...parsed, username: DEFAULT_USER.username }
        } catch {
          userInfo.value = { ...DEFAULT_USER }
        }
      } else {
        userInfo.value = { ...DEFAULT_USER }
      }
      isLoggedIn.value = true
      saveToCookie()
      return true
    }
    return false
  }

  function logout(): void {
    userInfo.value = null
    isLoggedIn.value = false
    deleteCookie('userInfo')
  }

  function updateProfile(data: Partial<UserInfo> & { password?: string }): boolean {
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        ...data,
        username: userInfo.value.username,
      }
      saveToCookie()
      return true
    }
    return false
  }

  function saveToCookie(): void {
    if (userInfo.value) {
      setCookie('userInfo', JSON.stringify(userInfo.value), 7)
    }
  }

  function checkPassword(password: string): boolean {
    const savedPassword = getCookie('userPassword')
    if (savedPassword) {
      return password === savedPassword
    }
    return password === DEFAULT_PASSWORD
  }

  function updatePassword(newPassword: string): void {
    setCookie('userPassword', newPassword, 7)
  }

  return {
    userInfo,
    isLoggedIn,
    initFromCookie,
    login,
    logout,
    updateProfile,
    checkPassword,
    updatePassword,
  }
})
