<template>
  <UCard class="hover:shadow-lg rounded-tl-3xl rounded-br-3xl">
    <div class="p-2 border-hidden rounded-lg shadow bg-slate-800">
      <h2 class="font-bold text-sm mb-4 text-white">UN Information</h2>
      <table class="w-full table-auto">
        <thead>
          <tr class="text-xs text-slate-400 font-extralight">
            <th class="p-2 border-l">UN Number</th>
            <th class="p-2 border">Name/Description</th>
            <th class="p-2 border">Class/Division</th>
            <th class="p-2 border">Sub Risk</th>
            <th class="p-2 border">Packing Group</th>
            <th class="p-2 border">Special Provision</th>
            <th class="p-2 border">Limited Quantities</th>
            <th class="p-2 border">Excepted Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-sm font-bold text-white">
            <td class="p-2 border text-teal-500 font-bold font-mono">
              {{ un.un_number }}
            </td>
            <td class="p-2 border text-[0.7rem] font-mono">
              {{ un.name_description }}
            </td>
            <td class="p-2 border text-yellow-500 font-bold font-mono">
              {{ un.class_devision }}
            </td>
            <td class="p-2 border">{{ un.sub_risk }}</td>
            <td class="p-2 border">{{ un.un_packing_group }}</td>
            <td class="p-2 border">{{ un.special_provision }}</td>
            <td class="p-2 border">{{ un.limited_quantities }}</td>
            <td class="p-2 border text-pink-500 font-bold">
              {{ un.excepted_qnty }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  un: {
    type: Object as () => {
      un_number: number
      name_description: string
      class_devision: string
      sub_risk: string
      un_packing_group: string
      special_provision: string
      limited_quantities: string
      excepted_qnty: string
    },
    required: true,
  },
})
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #334155; /* Darker border color to match the slate theme */
  padding: 8px;
  text-align: center;
}
</style>
