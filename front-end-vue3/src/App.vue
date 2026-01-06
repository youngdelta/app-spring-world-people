<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Check if user is logged in
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
    ?.split('=')[1]
  
  if (!token && !window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
})
</script>

<style scoped>
</style>
