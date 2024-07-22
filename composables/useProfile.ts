import { ref } from 'vue'

export function useProfile() {
  const supabase = useSupabaseClient()
  const profiles = ref([])

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, role, location, followers')

    console.log('Profile', data)
    if (error) {
      console.error('Error fetching profiles:', error)
      return
    }

    profiles.value = data.map((profile) => ({
      id: profile.id,
      name: profile.full_name || profile.username,
      role: profile.role || 'Developer', // Placeholder role
      location: profile.location || 'Unknown', // Placeholder location
      followers: profile.followers ? parseInt(profile.followers) : 0, // Parse followers to number
      avatarUrl: profile.avatar_url,
    }))
  }

  return { profiles, fetchProfiles }
}
