<script setup>
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,

} from '@headlessui/vue'

const query = ref('')
const { data: families } = await useFetch(`${useRuntimeConfig().public.API_URL}/families`)
const sortOptions = [
    '# of algorithms',
    'Name: A-Z',
    'Name: Z-A',
]
const sortBy = ref(sortOptions[0])

function getInitials(name) {
    const words = name?.split(' ')
    const initials = words.map(word => word.charAt(0)).join('')
    return initials.slice(0, 3).toUpperCase()
}

const filteredFamilies = computed(() => {
    let result = families.value
    if (query.value)
        result = families.value.filter((family) => {
            return family.family.toLowerCase().includes(query.value.toLowerCase())
        })
    return result.sort((a, b) => {
        if (sortBy.value == '# of algorithms') {
            return b.algorithms - a.algorithms
        } else if (sortBy.value == 'Name: A-Z') {
            return a.family.localeCompare(b.family)
        } else if (sortBy.value == 'Name: Z-A') {
            return b.family.localeCompare(a.family)
        }
    })
})
</script>

<template>
    <main class="">
        <section class="bg-[#91CBD7] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <Breadcrumbs :crumbs="[
                ]" />
                <h1 class="text-[#665E7A] text-4xl font-bold mt-4">
                    Families
                </h1>

            </div>
        </section>

        <div class="mx-auto max-w-7xl my-4 flex justify-end  gap-8 items-center">
            <div class="relative rounded-xl bg-white shadow-2xl ring-2 ring-black ring-opacity-5">
                <Icon name="heroicons:magnifying-glass"
                    class="pointer-events-none absolute top-2 left-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                    class=" w-full border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0 "
                    placeholder="Filter..." v-model="query" />
            </div>

            <div class="">
                <Menu as="div" class="relative inline-block text-left">
                    <div>
                        <MenuButton
                            class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                            Sort
                            <Icon name="heroicons-solid:chevron-down"
                                class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                        </MenuButton>
                    </div>

                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="py-1">
                                <MenuItem v-for="option in sortOptions" :key="option" v-slot="{ active }">
                                <button @click="sortBy = option"
                                    :class="[option == sortBy ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-left w-full']">{{
                    option }}</button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>

        <div class="max-w-7xl mx-auto mt-8 px-4">
            <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(family, idx) in filteredFamilies" :key="idx" class="col-span-1 flex shadow-sm rounded-md">
                    <div
                        :class="['bg-[#4E9BB9]', 'flex-shrink-0 flex items-center justify-center w-16 text-white text-lg font-bold rounded-l-md']">
                        <span>{{ getInitials(family.family) }}</span>
                    </div>
                    <div
                        class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                        <div class="flex-1 px-4 py-2 text-sm truncate">
                            <NuxtLink :to="'/domains/' + family.domainSlug + '/families/' + family.familySlug"
                                class="text-gray-900 font-medium hover:text-gray-600">{{ family.family }}</NuxtLink>
                            <p class="text-gray-500">{{ family.algorithms }} Algorithms</p>
                        </div>

                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>
