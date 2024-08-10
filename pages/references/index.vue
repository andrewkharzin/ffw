<script setup lang="ts">
definePageMeta({ layout: 'page' })
useHead({ title: 'References' })

const { airlines } = useAirlines()
const colorMode = useColorMode()

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'References',
    icon: 'i-heroicons-table-cells',
  },
]
</script>

<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeader>
        <UBreadcrumb :links="links" class="p-4" />
      </LayoutsPageHeader>
      <div class="refs-grid">
        <div>
          <UCard
            class="hover:cursor-pointer shadow-lg hover:dark:shadow-slate-800"
          >
            <template #header>
              <NuxtLink to="/references/dgr/un">
                <h2
                  class="text-xl font-bold hover:cursor-pointer hover:dark:text-teal-600"
                >
                  UN |
                  <span class="text-xl font-bold text-pink-600 uppercase"
                    >Classes</span
                  >
                </h2>
              </NuxtLink>
            </template>
          </UCard>
        </div>
        <div>
          <UCard>
            <template #header>
              <h2 class="text-xl font-bold">
                DGR |
                <span class="text-xl font-bold text-pink-600 uppercase"
                  >Classes</span
                >
              </h2>
            </template>
          </UCard>
        </div>
        <div>
          <UCard>
            <template #header>
              <h2 class="text-xl font-bold">
                IMP |
                <span class="text-xl font-bold text-pink-600 uppercase"
                  >Codes</span
                >
              </h2>
            </template>
          </UCard>
        </div>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
.refs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Add media query for smaller screens */
@media (max-width: 640px) {
  .refs-grid {
    grid-template-columns: 1fr; /* Single column layout on small screens */
  }
}
</style>
