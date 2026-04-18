<template>
  <header class="header">
    <Logo />

    <h2 class="site-title">Color Avatar</h2>

    <div class="header-right">
      <a
        href="https://github.com/Codennnn/vue-color-avatar"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <button
          type="button"
          class="github-button"
          @click="
            recordEvent('click_github', {
              event_category: 'click',
            })
          "
        >
          <img :src="IconGitHub" alt="GitHub" />
          <span class="text">GitHub</span>
        </button>
      </a>

      <div class="user-dropdown" :class="{ 'is-open': dropdownOpen }">
        <button type="button" class="user-avatar-btn" @click="toggleDropdown">
          <div v-if="userStore.userInfo?.avatar" class="user-avatar">
            <img :src="userStore.userInfo.avatar" alt="用户头像" />
          </div>
          <div v-else class="user-avatar-placeholder">
            <span>{{ usernameInitial }}</span>
          </div>
        </button>

        <div v-if="dropdownOpen" class="dropdown-menu">
          <div class="dropdown-item" @click="goToProfile">
            <span class="item-icon">👤</span>
            <span class="item-text">个人信息</span>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout" @click="handleLogout">
            <span class="item-icon">🚪</span>
            <span class="item-text">退出登录</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import IconGitHub from '@/assets/icons/icon-github.svg'
import Logo from '@/components/Logo.vue'
import { useUserStore } from '@/store/user'
import { recordEvent } from '@/utils/ga'

const router = useRouter()
const userStore = useUserStore()

const dropdownOpen = ref(false)

const usernameInitial = computed(() => {
  return userStore.userInfo?.username?.charAt(0).toUpperCase() || 'A'
})

function toggleDropdown(): void {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown')) {
    dropdownOpen.value = false
  }
}

function goToProfile(): void {
  dropdownOpen.value = false
  router.push('/profile')
}

function handleLogout(): void {
  dropdownOpen.value = false
  userStore.logout()
  router.push('/login')
}

document.addEventListener('click', closeDropdown)

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.header {
  display: flex;
  align-items: center;
  height: var.$layout-header-height;
  padding: 1rem 2rem;

  .site-title {
    margin-left: 1rem;
    font-weight: bold;
    font-size: 1.9rem;
    cursor: default;

    @media screen and (max-width: var.$screen-sm) {
      display: none;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;

    .github-button {
      position: relative;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 9rem;
      height: 2.6rem;
      overflow: hidden;
      color: var.$color-text;
      font-weight: bold;
      font-size: 1.05rem;
      background-color: var.$color-dark;
      border-radius: 0.6rem;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: darken(var.$color-dark, 3);
      }

      .text {
        margin-left: 0.5rem;
        letter-spacing: 0.03rem;
      }
    }

    .user-dropdown {
      position: relative;

      .user-avatar-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.6rem;
        height: 2.6rem;
        padding: 0;
        background: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: scale(1.05);
        }

        &:focus {
          outline: 2px solid var.$color-accent;
          outline-offset: 2px;
        }

        .user-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var.$color-accent;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .user-avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var.$color-accent, var.$color-secondary);
          border-radius: 50%;
          font-size: 1rem;
          font-weight: bold;
          color: #fff;
          border: 2px solid var.$color-accent;
        }
      }

      &.is-open .user-avatar-btn {
        box-shadow: 0 0 0 3px rgba(var.$color-accent, 0.3);
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 160px;
        padding: 0.5rem 0;
        background-color: var.$color-dark;
        border-radius: 0.6rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 1000;
        animation: dropdownFadeIn 0.2s ease-out;

        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: var.$color-text;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background-color 0.15s;

          &:hover {
            background-color: var.$color-gray;
          }

          .item-icon {
            font-size: 1.1rem;
            margin-right: 0.75rem;
          }

          .item-text {
            flex: 1;
          }

          &.logout {
            color: #f87171;
          }
        }

        .dropdown-divider {
          height: 1px;
          margin: 0.25rem 0;
          background-color: rgba(var.$color-text, 0.1);
        }
      }
    }
  }
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
