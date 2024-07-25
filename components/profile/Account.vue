<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'

const supabase = useSupabaseClient()
const { user } = useSupabaseUser()
const userId = ref('')
const avatarUrl = ref('')

// Fetch user profile data
const fetchUserProfile = async () => {
  if (!user.value) {
    console.error('User not authenticated')
    return
  }

  userId.value = user.value.id

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId.value)
      .single()

    if (error) throw error
    avatarUrl.value = data.avatar_url
  } catch (error) {
    console.error('Error fetching user profile: ', error.message)
  }
}

const updateAvatarUrl = async (path) => {
  if (!userId.value) {
    console.error('User ID not available')
    return
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: path })
      .eq('id', userId.value)

    if (error) throw error
    avatarUrl.value = path
  } catch (error) {
    console.error('Error updating avatar URL: ', error.message)
  }
}

watchEffect(() => {
  if (user.value) {
    fetchUserProfile()
  }
})
</script>

<template>
  <div>
    <ProfileUserAvatar
      :id="userId.value"
      :avatarUrl="avatarUrl.value"
      @update:path="updateAvatarUrl"
    />
  </div>
</template>

<style scoped>
/* Add any additional styling you need */
</style>
