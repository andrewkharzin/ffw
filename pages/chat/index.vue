<script setup>
import { computed } from 'vue'

const { session } = useAuth()
const isLogin = computed(() => !!session.value)
</script>

<template>
  <div
    v-if="!isLogin"
    class="relative h-screen flex justify-center items-center bg-gray-100"
  >
    <!-- Centered Content -->
    <div class="absolute inset-0 flex justify-center items-center">
      <div class="bg-white p-10 rounded shadow-md">
        <h1 class="text-3xl font-bold underline mb-4">
          This is a Vue 3 + Vite + Supabase + Tailwind CSS + TypeScript + Chat
        </h1>
        <SignInGithub />
      </div>
    </div>
  </div>
  <!-- ChatApp Component (will be overlaid above the centered content) -->
  <MessagesChat v-if="isLogin" />

  <!-- LogoutButton (positioned top-right of ChatApp) -->
  <!-- <div class="fixed top-4 right-4">
    <LogoutButton v-if="isLogin" />
  </div> -->
</template>
