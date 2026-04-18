<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.initFromCookie()
})
</script>

<style lang="scss" scoped>
</style>
