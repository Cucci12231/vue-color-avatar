<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <Logo />
        <h1 class="login-title">Color Avatar</h1>
        <p class="login-subtitle">登录您的账户</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="hint-text">默认账号: admin / admin</p>
      </div>
    </div>

    <div class="gradient-bg">
      <div class="gradient-top"></div>
      <div class="gradient-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Logo from '@/components/Logo.vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin(): Promise<void> {
  errorMessage.value = ''

  if (!form.value.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }

  if (!form.value.password.trim()) {
    errorMessage.value = '请输入密码'
    return
  }

  loading.value = true

  setTimeout(() => {
    const success = userStore.login(form.value.username, form.value.password)
    loading.value = false

    if (success) {
      router.push('/home')
    } else {
      errorMessage.value = '用户名或密码错误'
    }
  }, 500)
}
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var.$color-page-bg;
  color: var.$color-text;
  position: relative;
  overflow: hidden;
}

.login-box {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var.$color-dark;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;

  .login-title {
    margin-top: 1rem;
    font-size: 1.8rem;
    font-weight: bold;
    color: var.$color-text;
  }

  .login-subtitle {
    margin-top: 0.5rem;
    font-size: 1rem;
    color: rgba(var.$color-text, 0.7);
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;
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

    &::placeholder {
      color: rgba(var.$color-text, 0.4);
    }

    &:focus {
      border-color: var.$color-accent;
      background-color: darken(var.$color-gray, 2);
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

  .login-btn {
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

.login-footer {
  margin-top: 1.5rem;
  text-align: center;

  .hint-text {
    font-size: 0.85rem;
    color: rgba(var.$color-text, 0.5);
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
