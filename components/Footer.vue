<template>
  <footer class="px-2 md:px-12 flex flex-col justify-center gap-8 items-center bg-slate-100 mt-8 py-8">
    <ul class="flex  flex-col sm:flex-row items-center gap-8">
      <li v-for="link in links" :key="link.name">
        <NuxtLink class="" :to="link.path">
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>

    <!-- copyrights -->
    <div class="flex flex-col sm:flex-row  justify-center items-center gap-2">
      <p class="text-gray-500 text-sm order-last sm:order-first">© {{ new Date().getFullYear() }}</p>
      <img class="h-5" src="~/assets/logo.svg" alt="Algorithm Wiki" />
      <p class="text-gray-500 text-sm">Algorithm Wiki</p>
      <p class="text-gray-500 text-sm">From</p>
      <NuxtLink class="" to="https://futuretech.mit.edu/" target="_blank">
        <img class="h-4" src="~/assets/futuretech-logo.svg" alt="Algorithm Wiki" />
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup>
const links = [
  { name: "Algorithms", path: "/" },
  { name: "Visualizations", path: "/visualizations" },
  { name: "Glossary", path: "/glossary" },
  { name: "About", path: "/about" },
];
</script>
