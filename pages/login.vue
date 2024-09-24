<script setup>
import { ref } from 'vue'
const user = useSupabaseUser()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const { auth } = useSupabaseClient()

const userLogin = async () => {
  try {
    const { error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    email.value = ''
    password.value = ''

    if (error) throw error
  } catch (error) {
    errorMsg.value = error.message
    setTimeout(() => {
      errorMsg.value = ''
    }, 3000)
  }
}

// watchEffect(() => {
//   if (user.value) {
//     return navigateTo('/')
//   }
// })
</script>

<template>
  <NuxtLayout name="login">
    <div
      class="logon min-h-screen flex justify-center items-center bg-cover bg-center"
    >
      <form
        class="bg-opacity-50 flex flex-col rounded-lg bg-[#242424] p-8 w-full max-w-md"
        @submit.prevent="userLogin"
      >
        <h2 class="mb-5 text-lg font-medium text-[#aac8e4]">Login</h2>
        <div class="relative mb-4">
          <label for="email" class="text-sm leading-7 text-gray-400"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            class="bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-2 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-[#42b883] focus:ring-2 focus:ring-[#42b883]"
            required
          />
        </div>

        <div class="relative mb-4">
          <label for="password" class="text-sm leading-7 text-gray-400"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            class="bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-2 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-[#42b883] focus:ring-2 focus:ring-[#42b883]"
            required
          />
        </div>

        <button
          class="rounded border-0 bg-[#42b883] py-2 px-8 font-sans font-bold text-[#213547] transition-colors duration-500 hover:bg-[#42d392] focus:outline-none"
        >
          Submit
        </button>

        <span
          v-if="errorMsg"
          class="bg-opacity-50 mt-3 rounded-lg bg-[#242424] px-4 py-2 text-red-500"
        >
          {{ errorMsg }}
        </span>

        <p class="mt-3 text-xs">You don't have an account yet?</p>
        <nuxt-link
          class="w-fit text-sm text-[#aac8e4] hover:text-[#42b883]"
          to="/register"
        >
          Register
        </nuxt-link>
      </form>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.logon {
  background-image: url('~/assets/images/header.png');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
