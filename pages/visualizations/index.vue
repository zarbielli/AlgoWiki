<script setup>

const visualizations = ref([
  {
    name: 'Reductions',
    icon: 'ph:graph-duotone',
    description: 'A reduction is an algorithm for transforming one problem into another problem. A reduction from one problem to another may be used to show that the second problem is at least as difficult as the first.',
  },
  // {
  //   name: "Problems tree",
  //   icon: 'ph:tree-structure-duotone',
  //   description: 'A tree structure is a way of representing the hierarchical nature of a structure in a graphical form. It is named a "tree structure" because the classic representation resembles a tree, even though the chart is generally upside down compared to an actual tree, with the "root" at the top and the "leaves" at the bottom.',
  // }
])

function getInitials(name) {
  const words = name?.split(' ')
  const initials = words.map(word => word.charAt(0)).join('')
  return initials.slice(0, 3).toUpperCase()
}

function slugfy(text) {
  // slugify a string to be used as an id, string can contain special caracteres and spaces. only allow a-z, 0-9 and - and ' 
  return text.toLowerCase().replace(/[^a-z0-9-']/g, '-').replace(/-+/g, '-')

}

</script>

<template>
  <main class="">
    <section class="bg-[#ABD7E0] py-8 px-2">
      <div class="max-w-7xl mx-auto">
        <Breadcrumbs :crumbs="[
        ]" />
        <h1 class="text-[#665E7A] text- text-4xl font-bold mt-4">
          Visualizations
        </h1>
      </div>
    </section>

    <div class="max-w-7xl mx-auto mt-8 px-4">
      <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(visualization, idx) in visualizations" :key="idx"
          class="col-span-1 flex flex-col items-center shadow-sm rounded-md">
          <NuxtLink :to="'/visualizations/' + slugfy(visualization.name)" class="hover:opacity-50"
            :class="['bg-[#4E9BB9] flex items-center justify-center w-full p-4 text-white text-xl font-bold rounded-t-md']">
            <span>{{ visualization.name }}</span>
          </NuxtLink>
          <div class="flex-1  border-t border-r border-b border-gray-200 bg-white rounded-r-md">
            <div class="p-4 pt-2 text-sm text-justify">

              <p class="text-gray-500">{{ visualization.description }} Algorithms</p>
            </div>

          </div>
        </li>
      </ul>
    </div>

  </main>
</template>

<style>
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>