<template>
  <div class="carousel-container relative overflow-hidden">
    <div
      class="carousel-track flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item flex-shrink-0 w-full text-center"
      >
        <div
          class="w-25 border-2 border-pink-500 text-pink-500 rounded-tr-lg rounded-bl-lg p-2"
        >
          <h2 class="text-3xl font-bold dark:text-gray-300">{{ item }}</h2>
        </div>
      </div>
    </div>
    <div
      class="absolute inset-y-0 left-0 flex items-center justify-center cursor-pointer"
      @click="prevSlide"
    >
      <!-- <span class="material-icons">arrow_back</span> -->
    </div>
    <div
      class="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer"
      @click="nextSlide"
    >
      <!-- <span class="material-icons">arrow_forward</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  items: string[]
  autoplay?: boolean
  autoplaySpeed?: number
}

const props = defineProps<Props>()

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.items.length) % props.items.length
}

const startAutoplay = () => {
  if (props.autoplay) {
    interval = setInterval(nextSlide, props.autoplaySpeed || 7000)
  }
}

const stopAutoplay = () => {
  if (interval) {
    clearInterval(interval)
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-track {
  display: flex;
}

.carousel-item {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.material-icons {
  font-size: 24px;
  color: white;
}
</style>
