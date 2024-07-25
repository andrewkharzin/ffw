<script setup lang="ts">
// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Airlines' })

const { airlines } = useAirlines()
const colorMode = useColorMode()

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Airlines',
    icon: 'i-heroicons-table-cells',
  },
]
</script>

<template>
  <LayoutsPageWrapper>
    <LayoutPageSection>
      <LayoutPageHeader>
        <UBreadcrumb :links="links" class="p-4" />
        <div class="mt-5">
          <AirlinesAppBar />
        </div>
      </LayoutPageHeader>

      <div class="airlines-grid">
        <AirlinesCard
          v-for="airline in airlines"
          :key="airline.id"
          :airline="airline"
        />
      </div>
    </LayoutPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
.airlines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Add media query for smaller screens */
@media (max-width: 640px) {
  .airlines-grid {
    grid-template-columns: 1fr; /* Single column layout on small screens */
  }
}
</style>
