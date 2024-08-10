import { ref } from 'vue'

export const useRefCodes = () => {
  const supabase = useSupabaseClient()

  const dgrUnList = ref([])
  const loadingUnList = ref(false)
  const errorUnList = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalItems = ref(0)
  const searchQuery = ref('')

  const fetchDgrUnList = async (
    unNumber,
    page = 1,
    limit = itemsPerPage.value,
  ) => {
    loadingUnList.value = true
    errorUnList.value = null

    try {
      let query = supabase
        .from('dgr_un_list')
        .select('*', { count: 'exact' })
        .order('un_number', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)

      if (unNumber) {
        query = query.eq('un_number', unNumber)
      }

      const { data, error, count } = await query

      if (error) throw error

      dgrUnList.value = data
      totalItems.value = count || 0
    } catch (err) {
      errorUnList.value = err.message
    } finally {
      loadingUnList.value = false
    }
  }

  const changePage = (page) => {
    currentPage.value = page
    fetchDgrUnList(searchQuery.value, currentPage.value, itemsPerPage.value)
  }

  const search = (unNumber) => {
    searchQuery.value = unNumber
    currentPage.value = 1
    fetchDgrUnList(unNumber, currentPage.value, itemsPerPage.value)
  }

  return {
    dgrUnList,
    loadingUnList,
    errorUnList,
    fetchDgrUnList,
    currentPage,
    itemsPerPage,
    totalItems,
    changePage,
    search,
    searchQuery,
  }
}
