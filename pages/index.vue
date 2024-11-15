<script setup>
const [
    { data: domains },
    { data: families },
    { data: variations }
] = await Promise.all([
    useFetch(`${useRuntimeConfig().public.API_URL}/domains`,
        {
            query: {
                limit: 4
            }
        }
    ),
    useFetch(`${useRuntimeConfig().public.API_URL}/families`,
        {
            query: {
                limit: 4
            }
        }
    ),
    useFetch(`${useRuntimeConfig().public.API_URL}/variations`,
        {
            query: {
                limit: 4
            }
        }
    )
])


function getInitials(name) {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ')
    const initials = words.map(word => word.charAt(0)).join('')
    return initials.slice(0, 3).toUpperCase()
}

</script>

<template>
    <main class="">
        <section class="bg-[#ABD7E0] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-wrap items-center justify-center gap-4 mb-3">
                    <img class="h-20" src="~/assets/logo.svg" alt="Algorithm Wiki" />

                    <h1 class="text-[#665E7A] text-center text-6xl font-bold ">
                        Algorithm Wiki
                    </h1>
                </div>
                <p class="text-[#665E7A] text-center text-2xl">
                    Resource on Algorithms and their Development
                </p>
            </div>
        </section>
        <Stats />

        <div class="max-w-7xl mx-auto mt-8 px-4">
            <div class="flex items-center">
                <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Domains</h2>
                <NuxtLink to="/domains" class="ml-auto text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]">View all
                </NuxtLink>
            </div>
            <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(domain, idx) in domains" :key="idx" class="col-span-1 flex shadow-sm rounded-md">
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

        <div class="max-w-7xl mx-auto mt-8 px-4">
            <div class="flex items-center">
                <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Families</h2>
                <NuxtLink to="/families" class="ml-auto text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]">View all
                </NuxtLink>
            </div>
            <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(family, idx) in families" :key="idx" class="col-span-1 flex shadow-sm rounded-md">
                    <div
                        :class="['bg-[#4E9BB9]', 'flex-shrink-0 flex items-center justify-center w-16 text-white text-lg font-bold rounded-l-md']">

                        <!-- initials -->
                        <span>{{ getInitials(family.family) }}</span>
                    </div>
                    <div
                        class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                        <div class="flex-1 px-4 py-2 text-sm truncate">
                            <NuxtLink :href="'/domains/' + family.domainSlug + '/families/' + family.familySlug"
                                class="text-gray-900 font-medium hover:text-gray-600">{{ family.family }}</NuxtLink>
                            <p class="text-gray-500">{{ family.algorithms }} Algorithms</p>
                        </div>

                    </div>
                </li>
            </ul>
        </div>

        <div class="max-w-7xl mx-auto mt-8 px-4">
            <div class="flex items-center">
                <h2 class="text-gray-500 text-sm font-medium uppercase tracking-wide">Variations</h2>
                <NuxtLink to="/variations" class="ml-auto text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]">View all
                </NuxtLink>
            </div>
            <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <li v-for="(variation, idx) in variations" :key="idx" class="col-span-1 flex shadow-sm rounded-md">
                    <div
                        :class="['bg-[#4E9BB9]', 'flex-shrink-0 flex items-center justify-center w-16 text-white text-lg font-bold rounded-l-md']">

                        <!-- initials -->
                        <span>{{ getInitials(variation.variation) }}</span>
                    </div>
                    <div
                        class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                        <div class="flex-1 px-4 py-2 text-sm truncate">
                            <NuxtLink
                                :href="'/domains/' + variation.domainSlug + '/families/' + variation.familySlug + '/variations/' + variation.variationSlug"
                                class="text-gray-900 font-medium hover:text-gray-600">{{ variation.variation }}
                            </NuxtLink>
                            <p class="text-gray-500">{{ variation.algorithms }} Algorithms</p>
                        </div>

                    </div>
                </li>
            </ul>
        </div>

    </main>
</template>
