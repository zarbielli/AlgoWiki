<template>
  <header class="bg-slate-100 px-2">
    <nav class="max-w-7xl mx-auto  py-2 flex flex-wrap gap-4 justify-center md:justify-between items-center">
      <NuxtLink class="flex items-center gap-2" to="/">
        <img class="h-12" src="~/assets/logo.svg" alt="Algorithm Wiki" />
        <h1 class="text-[#665E7A] text-3xl font-sans font-extrabold">
          Algorithm Wiki
        </h1>
      </NuxtLink>
      <ul class="flex gap-8">
        <li v-for="link in links" :key="link.name">
          <NuxtLink class="" :to="link.path">
            {{ link.name }}
          </NuxtLink>
        </li>
      </ul>
      <div class="">
        
        <CommandPalette  v-slot="{ openModal }">
            <button
              @click="openModal"
              class="flex gap-2 items-center rounded-xl ransform   bg-white shadow-2xl ring-1 ring-black ring-opacity-5 pr-4 pl-2 py-2">
              <Icon name="heroicons:magnifying-glass"
                class="pointer-events-none top-3.5 left-4 h-5 w-5 text-gray-400" aria-hidden="true" />
              <p class="text-gray-400 w-full sm:w-36 text-left">
                Search...
              </p>
            </button>
        </CommandPalette>
      </div>

    </nav>
  </header>
</template>

<script setup>

const links = [
  { name: "Algorithms", path: "/" },
  { name: "Visualizations", path: "/visualizations" },
  { name: "Glossary", path: "/glossary" },
  { name: "About", path: "/about" },
];
</script>
