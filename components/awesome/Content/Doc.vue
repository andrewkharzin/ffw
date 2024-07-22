<script lang="ts" setup>
const props = defineProps({
  emptyTip: {
    type: String,
    required: false,
    default: 'This page is empty',
  },
})
</script>

<template>
  <ContentDoc>
    <template #default="{ doc }">
      <LayoutsPageHeader>
        <LayoutsPageTitle :text="doc.title" />
      </LayoutsPageHeader>
      <LayoutsPageSection>
        <ContentRenderer :value="doc" />
      </LayoutsPageSection>
    </template>
    <template #empty>
      <h1>{{ emptyTip }}</h1>
    </template>
    <template #not-found>
      <AwesomeError :code="404" wrap />
    </template>
  </ContentDoc>
</template>
