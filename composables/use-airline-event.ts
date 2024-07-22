// import { ref, onMounted, onUnmounted } from 'vue'
// import { useQueryClient } from '@tanstack/vue-query'
// import type { Database } from '@/types/supabase.ts'

// export function useAirlineEvent() {
//   const supabase = useSupabaseClient()

//   const events = ref<
//     Database['public']['Tables']['airlines_realtime_events']['Row'][]
//   >([])
//   const queryClient = useQueryClient()

//   const fetchInitialEvents = async () => {
//     const { data, error } = await supabase.from('airlines_realtime_events')
//       .select(`
//         id,
//         event_type,
//         event_timestamp,
//         airline_id,
//         event_date,
//         event_time,
//         event_title,
//         event_description,
//         user_id,
//         user:profiles (avatar_url, username)
//       `)
//     if (error) {
//       console.error('Error fetching initial events:', error)
//     } else {
//       events.value = data
//       console.log('Initial events fetched:', data)
//     }
//   }

//   const setupRealtimeSubscription = () => {
//     const subscription = supabase
//       .channel('custom-all-channel')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'airlines_realtime_events' },
//         async (payload) => {
//           console.log('Real-time event received:', payload)
//           const { eventType, new: newEvent, old: oldEvent } = payload

//           if (eventType === 'INSERT') {
//             events.value.push(newEvent)
//             await fetchProfile(newEvent.user_id) // Fetch profile for new event
//           } else if (eventType === 'DELETE') {
//             events.value = events.value.filter(
//               (event) => event.id !== oldEvent.id,
//             )
//           } else if (eventType === 'UPDATE') {
//             const index = events.value.findIndex(
//               (event) => event.id === oldEvent.id,
//             )
//             if (index !== -1) {
//               events.value[index] = newEvent
//               await fetchProfile(newEvent.user_id) // Update profile for updated event
//             }
//           }
//         },
//       )
//       .subscribe()

//     return subscription
//   }

//   const fetchProfile = async (userId) => {
//     if (!userId) return

//     const { data, error } = await supabase
//       .from('profiles')
//       .select('avatar_url, username')
//       .eq('id', userId)
//       .single()

//     if (error) {
//       console.error('Error fetching user profile:', error)
//     } else {
//       // Update user profile in the events
//       events.value = events.value.map((event) => {
//         if (event.user_id === userId) {
//           return { ...event, user: data }
//         }
//         return event
//       })
//     }
//   }

//   let subscription: ReturnType<(typeof supabase)['channel']>

//   onMounted(async () => {
//     console.log(
//       'Component mounted, setting up initial events and subscription...',
//     )
//     await fetchInitialEvents()
//     subscription = setupRealtimeSubscription()
//     console.log('Subscription setup complete.')
//   })

//   onUnmounted(() => {
//     if (subscription) {
//       supabase.removeChannel(subscription)
//       console.log('Subscription removed.')
//     }
//   })

//   return { events }
// }

import { ref, onMounted, onUnmounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type { Database } from '@/types/supabase'

export function useAirlineEvent() {
  const supabase = useSupabaseClient()

  const events = ref<Database['public']['Tables']['airlines_realtime_events']['Row'][]>([])
  const event = ref<Database['public']['Tables']['airlines_realtime_events']['Row'] | null>(null)
  const queryClient = useQueryClient()

  const fetchInitialEvents = async () => {
    const { data, error } = await supabase.from('airlines_realtime_events')
      .select(`
        id,
        event_type,
        event_timestamp,
        airline_id,
        event_date,
        event_time,
        event_title,
        event_description,
        user_id,
        user:profiles (avatar_url, username)
      `)
    if (error) {
      console.error('Error fetching initial events:', error)
    } else {
      events.value = data
      console.log('Initial events fetched:', data)
    }
  }

  const fetchEventById = async (eventId) => {
    const { data, error } = await supabase.from('airlines_realtime_events')
      .select(`
        id,
        event_type,
        event_timestamp,
        airline_id,
        event_date,
        event_time,
        event_title,
        event_description,
        user_id,
        user:profiles (avatar_url, username)
      `)
      .eq('id', eventId)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
    } else {
      event.value = data
      await fetchProfile(data.user_id)
    }
  }

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'airlines_realtime_events' },
        async (payload) => {
          console.log('Real-time event received:', payload)
          const { eventType, new: newEvent, old: oldEvent } = payload

          if (eventType === 'INSERT') {
            events.value.push(newEvent)
            await fetchProfile(newEvent.user_id) // Fetch profile for new event
          } else if (eventType === 'DELETE') {
            events.value = events.value.filter(
              (event) => event.id !== oldEvent.id,
            )
          } else if (eventType === 'UPDATE') {
            const index = events.value.findIndex(
              (event) => event.id === oldEvent.id,
            )
            if (index !== -1) {
              events.value[index] = newEvent
              await fetchProfile(newEvent.user_id) // Update profile for updated event
            }
          }
        },
      )
      .subscribe()

    return subscription
  }

  const fetchProfile = async (userId) => {
    if (!userId) return

    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, username')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
    } else {
      // Update user profile in the events
      events.value = events.value.map((event) => {
        if (event.user_id === userId) {
          return { ...event, user: data }
        }
        return event
      })
    }
  }

  let subscription: ReturnType<(typeof supabase)['channel']>

  onMounted(async () => {
    console.log(
      'Component mounted, setting up initial events and subscription...',
    )
    await fetchInitialEvents()
    subscription = setupRealtimeSubscription()
    console.log('Subscription setup complete.')
  })

  onUnmounted(() => {
    if (subscription) {
      supabase.removeChannel(subscription)
      console.log('Subscription removed.')
    }
  })

  return { events, event, fetchEventById }
}

