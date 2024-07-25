<template>
  <LayoutsPageWrapper>
    <!-- <LayoutsPageSection> -->
    <LayoutsPageHeader>
      <UBreadcrumb :links="links" class="p-4" />
    </LayoutsPageHeader>

    <ReferencesAppBar @filter="fetchFilteredList" />

    <div class="p-4">
      <div v-if="loadingUnList" class="text-center">Loading...</div>
      <div v-if="errorUnList" class="text-center text-red-500">
        {{ errorUnList }}
      </div>
      <div v-if="!loadingUnList && !errorUnList" class="grid grid-cols-1 gap-2">
        <ReferencesUnCard v-for="un in dgrUnList" :key="un.id" :un="un" />
      </div>
    </div>
    <!-- </LayoutsPageSection> -->
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'References|UNLIST' })

const { dgrUnList, fetchDgrUnList } = useRefCodes()
const colorMode = useColorMode()

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'References',
    // icon: 'carbon:assembly-reference',
  },
]

const fetchFilteredUnList = (unNumber) => {
  console.log(`Fetching filtered list for UN Number: ${unNumber}`)
  fetchDgrUnList(unNumber)
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
</style>
