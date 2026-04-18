<template>
  <div class="profile-container">
    <div class="profile-header-bar">
      <button class="back-btn" @click="goBack">
        <img :src="IconBack" alt="返回" />
        <span>返回</span>
      </button>
      <h1 class="page-title">个人信息</h1>
      <div class="header-spacer"></div>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <div v-if="userStore.userInfo?.avatar" class="avatar-preview">
              <img :src="userStore.userInfo.avatar" alt="头像" />
            </div>
            <div v-else class="avatar-placeholder">
              <span>{{ usernameInitial }}</span>
            </div>
          </div>
          <div class="avatar-actions">
            <label class="upload-btn">
              <input type="file" accept="image/*" @change="handleAvatarUpload" />
              更换头像
            </label>
            <button v-if="userStore.userInfo?.avatar" class="remove-btn" @click="removeAvatar">
              移除头像
            </button>
          </div>
        </div>

        <form class="profile-form" @submit.prevent="handleSave">
          <div class="form-group">
            <label class="form-label">账号</label>
            <input
              v-model="form.username"
              type="text"
              class="form-input disabled"
              disabled
              placeholder="账号不可修改"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="phone">手机号</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="请输入手机号"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">邮箱</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱"
            />
          </div>

          <div class="form-divider">
            <span>修改密码（可选）</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="currentPassword">当前密码</label>
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入当前密码"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              {{ showCurrentPassword ? '隐藏' : '显示' }}
            </button>
          </div>

          <div class="form-group">
            <label class="form-label" for="newPassword">新密码</label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入新密码（留空则不修改）"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showNewPassword = !showNewPassword"
            >
              {{ showNewPassword ? '隐藏' : '显示' }}
            </button>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">确认新密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请再次输入新密码"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? '隐藏' : '显示' }}
            </button>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? '保存中...' : '保存修改' }}
          </button>
        </form>
      </div>
    </div>

    <div class="gradient-bg">
      <div class="gradient-top"></div>
      <div class="gradient-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import IconBack from '@/assets/icons/icon-back.svg'
import { useUserStore } from '@/store/user'
import type { UserInfo } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  phone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const usernameInitial = computed(() => {
  return form.value.username.charAt(0).toUpperCase()
})

function goBack(): void {
  router.back()
}

function initForm(): void {
  if (userStore.userInfo) {
    form.value.username = userStore.userInfo.username
    form.value.phone = userStore.userInfo.phone
    form.value.email = userStore.userInfo.email
  }
}

function handleAvatarUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    userStore.updateProfile({ avatar: dataUrl } as Partial<UserInfo>)
  }
  reader.readAsDataURL(file)
}

function removeAvatar(): void {
  userStore.updateProfile({ avatar: '' } as Partial<UserInfo>)
}

function validateForm(): boolean {
  errorMessage.value = ''
  successMessage.value = ''

  if (form.value.newPassword) {
    if (!form.value.currentPassword) {
      errorMessage.value = '请输入当前密码'
      return false
    }

    if (!userStore.checkPassword(form.value.currentPassword)) {
      errorMessage.value = '当前密码不正确'
      return false
    }

    if (form.value.newPassword.length < 4) {
      errorMessage.value = '新密码至少需要4个字符'
      return false
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
      errorMessage.value = '两次输入的新密码不一致'
      return false
    }
  }

  return true
}

async function handleSave(): Promise<void> {
  if (!validateForm()) return

  saving.value = true

  setTimeout(() => {
    userStore.updateProfile({
      phone: form.value.phone,
      email: form.value.email,
    } as Partial<UserInfo>)

    if (form.value.newPassword) {
      userStore.updatePassword(form.value.newPassword)
    }

    saving.value = false
    successMessage.value = '保存成功！'

    form.value.currentPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }, 500)
}

onMounted(() => {
  initForm()
})
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.profile-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var.$color-page-bg;
  color: var.$color-text;
  position: relative;
  overflow: hidden;
}

.profile-header-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var.$layout-header-height;
  padding: 1rem 2rem;
  background-color: var.$color-dark;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: var.$color-text;
    font-size: 0.95rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.2s;

    &:hover {
      background-color: var.$color-gray;
    }

    img {
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  .page-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    font-weight: bold;
  }

  .header-spacer {
    width: 6rem;
  }
}

.profile-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  z-index: 5;
}

.profile-card {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background-color: var.$color-dark;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(var.$color-text, 0.1);

  .avatar-wrapper {
    width: 6rem;
    height: 6rem;
    margin-bottom: 1rem;

    .avatar-preview {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var.$color-accent;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var.$color-accent, var.$color-secondary);
      border-radius: 50%;
      font-size: 2.5rem;
      font-weight: bold;
      color: #fff;
    }
  }

  .avatar-actions {
    display: flex;
    gap: 1rem;

    .upload-btn {
      position: relative;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      color: var.$color-accent;
      background-color: rgba(var.$color-accent, 0.1);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(var.$color-accent, 0.2);
      }

      input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }

    .remove-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      color: #f87171;
      background-color: rgba(239, 68, 68, 0.1);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(239, 68, 68, 0.2);
      }
    }
  }
}

.profile-form {
  .form-group {
    margin-bottom: 1.25rem;
    position: relative;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var.$color-text;
  }

  .form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    color: var.$color-text;
    background-color: var.$color-gray;
    border: 2px solid transparent;
    border-radius: 0.6rem;
    outline: none;
    transition: border-color 0.2s, background-color 0.2s;
    box-sizing: border-box;

    &::placeholder {
      color: rgba(var.$color-text, 0.4);
    }

    &:focus {
      border-color: var.$color-accent;
      background-color: darken(var.$color-gray, 2);
    }

    &.disabled,
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 2.25rem;
    background: none;
    border: none;
    color: rgba(var.$color-text, 0.6);
    font-size: 0.85rem;
    cursor: pointer;

    &:hover {
      color: var.$color-accent;
    }
  }

  .form-divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    color: rgba(var.$color-text, 0.5);
    font-size: 0.85rem;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: rgba(var.$color-text, 0.1);
    }

    span {
      padding: 0 1rem;
    }
  }

  .error-message {
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0.5rem;
    color: #f87171;
    font-size: 0.9rem;
    text-align: center;
  }

  .success-message {
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 0.5rem;
    color: #4ade80;
    font-size: 0.9rem;
    text-align: center;
  }

  .save-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1.05rem;
    font-weight: bold;
    color: #fff;
    background-color: var.$color-accent;
    border: none;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;

    &:hover:not(:disabled) {
      background-color: hsl(241, 99%, 65%);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@supports (filter: blur(4rem)) or (-webkit-filter: blur(4rem)) or
  (-moz-filter: blur(4rem)) {
  .gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    @mixin gradient-style($color) {
      position: absolute;
      width: 80vh;
      height: 80vh;
      background-image: radial-gradient(
        rgba($color, 0.8) 20%,
        rgba($color, 0.6) 40%,
        rgba($color, 0.4) 60%,
        rgba($color, 0.2) 80%,
        transparent 100%
      );
      border-radius: 50%;
      opacity: 0.25;
      filter: blur(4rem);
    }

    .gradient-top {
      @include gradient-style(var.$color-secondary);
      top: -40%;
      right: -20%;
    }

    .gradient-bottom {
      @include gradient-style(var.$color-accent);
      bottom: -40%;
      left: -20%;
    }
  }
}
</style>
