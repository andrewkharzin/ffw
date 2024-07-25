import { ref, onMounted } from 'vue'

export const useRefCodes = () => {
  const supabase = useSupabaseClient()

  const dgrClasses = ref([])
  const loadingClasses = ref(false)
  const errorClasses = ref(null)

  const dgrUnList = ref([])
  const loadingUnList = ref(false)
  const errorUnList = ref(null)

  const fetchDgrClasses = async () => {
    loadingClasses.value = true
    errorClasses.value = null

    try {
      const { data, error } = await supabase
        .from('dgr_classes')
        .select('*')
        .order('label', { ascending: true })

      if (error) throw error

      dgrClasses.value = data
    } catch (err) {
      errorClasses.value = err.message
    } finally {
      loadingClasses.value = false
    }
  }

  const fetchDgrUnList = async (unNumber = null) => {
    loadingUnList.value = true
    errorUnList.value = null

    try {
      let query = supabase
        .from('dgr_un_list')
        .select('*')
        .order('un_number', { ascending: true })

      if (unNumber !== null) {
        query = query.eq('un_number', unNumber)
      }

      const { data, error } = await query

      if (error) throw error

      dgrUnList.value = data
    } catch (err) {
      errorUnList.value = err.message
    } finally {
      loadingUnList.value = false
    }
  }


  onMounted(() => {
    fetchDgrClasses()
    fetchDgrUnList()
  })

  return {
    dgrClasses,
    loadingClasses,
    errorClasses,
    fetchDgrClasses,
    dgrUnList,
    loadingUnList,
    errorUnList,
    fetchDgrUnList,
  }
}
