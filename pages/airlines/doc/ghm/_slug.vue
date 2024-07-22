<script>
export default {
  async asyncData({ $content, params }) {
    const ghm = await $content('doc-airlines-ghm', params.slug).fetch()

    return { ghm }
  },
}
</script>

<template>
  <article>
    <nuxt-content :document="ghm" />
  </article>
</template>
