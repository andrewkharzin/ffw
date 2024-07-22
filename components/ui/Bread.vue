<template>
  <UBreadcrumbs>
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.path">
      <UBreadcrumbItem
        v-if="index !== breadcrumbs.length - 1"
        :to="breadcrumb.path"
      >
        {{ breadcrumb.name }}
      </UBreadcrumbItem>
      <UBreadcrumbItem v-else>
        {{ breadcrumb.name }}
      </UBreadcrumbItem>
    </template>
  </UBreadcrumbs>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  routeMap: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter((path) => path)
  const breadcrumbsArray = pathArray.map((path, index) => {
    const breadcrumbPath = `/${pathArray.slice(0, index + 1).join('/')}`
    const breadcrumbName =
      props.routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1)

    return {
      path: breadcrumbPath,
      name: breadcrumbName.replace(/-/g, ' '),
    }
  })

  return [{ path: '/', name: 'Home' }, ...breadcrumbsArray]
})
</script>

<style scoped>
/* Add your styles here if needed */
</style>
