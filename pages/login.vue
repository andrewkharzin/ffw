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
        class="bg-opacity-60 flex flex-col rounded-lg bg-gray-800 p-8 w-full max-w-md"
        @submit.prevent="userLogin"
      >
        <!-- <h2 class="mb-5 text-lg font-medium text-[#aac8e4]">Login</h2> -->
        <div class="relative mb-4">
          <label
            for="email"
            class="text-xs leading-7 text-gray-400 tracking-wide uppercase"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            color="sky"
            variant="outline"
            class="mt-2 bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-2 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-[#0891b2] focus:ring-2 focus:ring-[#06b6d4]"
            required
          />
        </div>

        <div class="relative mb-4">
          <label
            for="password"
            class="text-xs leading-7 text-gray-400 tracking-wide uppercase"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            class="mt-2 bg-opacity-20 w-full rounded border border-gray-600 bg-transparent py-2 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-[#0891b2] focus:ring-2 focus:ring-[#06b6d4]"
            required
          />
        </div>

        <button
          class="rounded border-0 bg-[#0369a1] py-2 px-8 font-sans font-bold text-gray-200 transition-colors duration-500 hover:bg-[#38bdf8] focus:outline-none"
        >
          Submit
        </button>

        <span
          v-if="errorMsg"
          class="bg-opacity-50 mt-3 rounded-lg bg-[#242424] px-4 py-2 text-red-500"
        >
          {{ errorMsg }}
        </span>

        <!-- <p class="mt-3 text-xs">You don't have an account yet?</p>
        <nuxt-link
          class="w-fit text-sm text-[#aac8e4] hover:text-[#42b883]"
          to="/register"
        >
          Register
        </nuxt-link> -->
      </form>
      <div class="gradient-overlay"></div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.logon {
  background-image: url('~/assets/images/covers/boeing.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* For pseudo-element positioning */
}

.logon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(0, 11, 19);
  background: radial-gradient(
    circle,
    rgba(0, 11, 19, 0.7651435574229692) 0%,
    rgba(0, 30, 43, 1) 53%,
    rgba(0, 0, 0, 1) 100%
  );
  z-index: 1; /* Behind the form */
}
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(60, 41, 59, 0.5),
    rgba(45, 41, 59, 0.5)
  );
  /* Change colors to slate-900 and slate-800 */
  background: linear-gradient(
    to bottom,
    rgba(31, 41, 55, 0.5),
    rgba(23, 42, 57, 0.5)
  );
  z-index: 1; /* Make sure it sits below the form */
}
form {
  position: relative; /* Ensures the form sits above the gradient overlay */
  z-index: 2; /* Higher z-index to ensure it's above the gradient */
}
</style>
