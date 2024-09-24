<script setup>
import { ref } from 'vue'
// import Logo from '@/assets/images/logo.svg'
import Logo from '@/assets/images/logo_2.svg'
// import Logo from '@/assets/images/logo.png'

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

// Set form focus when inputs are clicked
const setFormFocused = () => {
  isFormFocused.value = true
}

const removeFormFocus = () => {
  isFormFocused.value = false
}
</script>

<template>
  <NuxtLayout name="login">
    <div
      class="logon min-h-screen flex justify-center items-center bg-cover bg-center px-4 sm:px-8 md:px-12 lg:px-24"
    >
      <!-- Логотип -->
      <div
        class="logo-container w-full max-w-[440px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[400px] mx-auto"
      >
        <Logo
          class="w-full h-auto rounded-tl-2xl rounded-br-2xl bg-gradient-to-br from-pink-600/20 via-slate-800 text-gray-200 to-slate-900/10"
          :font-controlled="false"
        />
      </div>
      <form
        :class="isFormFocused ? 'form-focused' : ''"
        class="bg-opacity-80 flex flex-col rounded-lg bg-gray-900 p-8 w-full max-w-md"
        @submit.prevent="userLogin"
      >
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
            @focus="setFormFocused"
            @blur="removeFormFocus"
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
            @focus="setFormFocused"
            @blur="removeFormFocus"
          />
        </div>

        <button
          class="mt-4 rounded border-0 bg-[#0369a1] py-2 px-8 font-sans font-bold text-gray-200 transition-colors duration-500 hover:bg-[#38bdf8] focus:outline-none"
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
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(31, 41, 55, 0.5),
    rgba(23, 42, 57, 0.5)
  );
  z-index: 1;
}

form {
  position: relative;
  z-index: 2;
}

.logo-container {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 300px;
  z-index: 3;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

/* New rule for focused form */
.form-focused {
  z-index: 4; /* Focused form above everything */
  transform: translateY(-50px); /* Move form higher when focused */
  background: linear-gradient(
    0deg,
    rgba(0, 11, 19, 0.8631827731092436) 0%,
    rgba(0, 30, 43, 1) 13%,
    rgba(0, 0, 0, 1) 59%
  ); /* Gradient background */
}

@media (min-width: 1024px) {
  .logo-container {
    top: 20%;
    max-width: 480px;
  }
}

@media (max-width: 768px) {
  .logo-container {
    top: 2%; /* Adjust this as needed */
    max-width: 400px;
  }

  /* On small devices, shift the form above the logo and adjust z-index */
  .form-focused {
    transform: translateY(-100px); /* Move form higher when focused */
    z-index: 2; /* Lower z-index to place it under the logo */
  }

  /* Ensure the login container is beneath the focused form */
  .logo-container {
    z-index: 2; /* Ensure logon is lower than the focused form */
  }
}
</style>