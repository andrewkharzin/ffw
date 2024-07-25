<template>
  <div>
    <h1>Login with Telegram</h1>
    <div id="telegram-login-widget"></div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  script: [
    {
      src: 'https://telegram.org/js/telegram-widget.js?19',
      async: true,
      'data-telegram-login': 'YOUR_BOT_USERNAME', // replace with your bot username
      'data-size': 'large',
      'data-auth-url': 'http://localhost:3000/api/auth/telegram', // your auth callback URL
      'data-request-access': 'write',
    },
  ],
})
</script>
