<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeader>
        <UBreadcrumb :links="links" class="p-4" />
      </LayoutsPageHeader>

      <div class="p-4">
        <form @submit.prevent="onSearch">
          <div class="relative">
            <div
              class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              id="search"
              v-model="unNumber"
              type="search"
              placeholder="Enter UN Number"
              class="block w-full p-4 ps-10 text-lg font-bold text-gray-900 border border-slate-700/40 rounded-lg bg-slate-800 focus:ring-blue-500 focus:border-slate-500/40 dark:bg-slate-800/40 dark:border-slate-500 dark:placeholder-gray-400 dark:text-sky-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            <button
              type="submit"
              class="text-white absolute end-2.5 bottom-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md p-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-slate-700"
            >
              Search
            </button>
          </div>
        </form>

        <div
          v-if="loadingUnList"
          class="mt-6 text-center text-3xl font-bold text-gray-400 mt-5"
        >
          Loading...
        </div>
        <div v-if="errorUnList" class="text-center text-red-500">
          {{ errorUnList }}
        </div>

        <div
          v-if="!loadingUnList && !errorUnList && dgrUnList.length"
          class="grid grid-cols-1 gap-2 mt-6"
        >
          <ReferencesUnCard v-for="un in dgrUnList" :key="un.id" :un="un" />
        </div>

        <div
          v-if="!loadingUnList && !dgrUnList.length"
          class="text-center p-4 mt-10 text-3xl font-bold text-gray-500/40"
        >
          No UNXXXX results found
        </div>

        <!-- <div v-if="dgrUnList.length" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div> -->
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: 'page' })
useHead({ title: 'References|UN' })

const {
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
} = useRefCodes()

const unNumber = ref('')
const links = [
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: 'References' },
]

const onSearch = () => {
  search(unNumber.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}

const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value),
)
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}

.input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:disabled {
  background-color: #ccc;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #ccc;
}
</style>
