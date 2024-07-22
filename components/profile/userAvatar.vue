<script setup lang="ts">
import { defineProps, toRefs, ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
})

const { id, avatarUrl } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const fileInput = ref(null)
const uploading = ref(false)
const src = ref(avatarUrl.value)
const files = ref()

const triggerFileInput = () => {
  fileInput.value.click()
}

const downloadImage = async () => {
  if (!avatarUrl.value) return

  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(avatarUrl.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    emit('update:path', filePath)
    emit('upload')
    src.value = URL.createObjectURL(file)
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

downloadImage()

watch(avatarUrl, () => {
  if (avatarUrl.value) {
    downloadImage()
  }
})
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <img
      v-if="src"
      :src="src"
      class="rounded-lg h-24 sm:w-full lg:w-40 mb-4"
      alt="User Avatar"
    />
    <div
      v-else
      class="avatar no-image rounded-lg bg-gray-200 mb-4"
      :style="{ height: '10em', width: '10em' }"
    ></div>
    <div class="mt-4 mb-4 flex justify-center">
      <button
        :disabled="uploading"
        class="sm:w-full bg-red-500 text-white py-2 px-4 rounded-lg"
        @click="triggerFileInput"
      >
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </button>
      <input
        ref="fileInput"
        class="hidden md:w-1/2"
        type="file"
        accept="image/*"
        :disabled="uploading"
        @change="uploadAvatar"
      />
    </div>
  </div>
</template>

<style scoped>
.avatar.no-image {
  /* Default size for the avatar without an image */
  width: 10em;
  height: 10em;
}
</style>
