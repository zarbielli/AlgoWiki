<!-- TODO: make graph an isolated component to be reused -->
<script setup>
const { $renderMathString } = useNuxtApp();

import ReductionsTable from "../../components/ReductionsTable.vue";


const { data: reductions } = await useFetch(
  `${useRuntimeConfig().public.API_URL}/reductions`
);

</script>

<template>
  <main>
    <section class="bg-[#ABD7E0] py-8 px-2">
      <div class="max-w-7xl mx-auto">
        <Breadcrumbs :crumbs="[
          { name: 'Visualizations', link: '/visualizations' }
        ]" />
        <h1 class="text-[#665E7A] text- text-4xl font-bold mt-4">
          Reductions
        </h1>
      </div>
    </section>
    <section class="max-w-7xl mx-auto py-8 px-2">
      <ClientOnly>
      <ReductionsGraph :reductions="reductions" />
      </ClientOnly>
      <ReductionsTable :reductions="reductions" />
    </section>
  </main>
</template>

<style>
#cyContainer {
  width: 100%;
  height: 100%;
}
</style>
