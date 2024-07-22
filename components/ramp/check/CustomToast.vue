!-- CustomToast.vue -->
<template>
  <Transition name="bounce">
    <div
      v-if="showToast"
      class="fixed z-50 grid items-center justify-center w-full h-full top-0 left-0"
    >
      <div
        class="bg-gray-800 text-white p-4 rounded shadow-md grid gap-4 items-center"
      >
        <div class="text-center">
          <slot name="message"></slot>
        </div>
        <div class="flex justify-center">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const showToast = ref(false);

const open = () => {
  showToast.value = true;
};

const close = () => {
  showToast.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-out 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0);
  }
}
</style>
