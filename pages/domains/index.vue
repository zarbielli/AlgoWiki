<script setup>


const { data: domains } = await useFetch(`${useRuntimeConfig().public.API_URL}/domains`)

function getInitials(name) {
    const words = name?.split(' ')
    const initials = words.map(word => word.charAt(0)).join('')
    return initials.slice(0, 3).toUpperCase()
}


const query = ref('')
const filteredDomains = computed(() => {
    if (!query.value) return domains.value
    return domains.value.filter((domain) => {
        return domain.domain.toLowerCase().includes(query.value.toLowerCase())
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
                    Domains
                </h1>

            </div>
        </section>

        <div class="max-w-7xl mx-auto mt-8 px-4">
            <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(domain, idx) in filteredDomains" :key="idx" class="col-span-1 flex shadow-sm rounded-md">
                    <div
                        :class="['bg-[#4E9BB9]', 'flex-shrink-0 flex items-center justify-center w-16 text-white text-lg font-bold rounded-l-md']">

                        <!-- initials -->
                        <span>{{ getInitials(domain.domain) }}</span>
                    </div>
                    <div
                        class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                        <div class="flex-1 px-4 py-2 text-sm truncate">
                            <NuxtLink :to="'/domains/' + domain.domainSlug"
                                class="text-gray-900 font-medium hover:text-gray-600">{{ domain.domain }}</NuxtLink>
                            <p class="text-gray-500">{{ domain.algorithms }} Algorithms</p>
                        </div>

                    </div>
                </li>
            </ul>
        </div>

    </main>
</template>
