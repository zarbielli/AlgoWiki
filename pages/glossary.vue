<script setup>
const { data: glossary } = await useFetch(`${useRuntimeConfig().public.API_URL}/glossary`)

const route = useRoute()

// get hash
const activeId = ref(route.hash.slice(1))
// group by category
const glossaryByCategory = glossary.value.sort((a, b) => a.term.localeCompare(b.term)).reduce((acc, item) => {
    if(item.term === activeId.value) {
        item.active = true
    }
    if (!acc[item.category]) {
        acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
}, {})

const glossaryKeys = ref(Object.keys(glossaryByCategory).sort((a, b) => a.localeCompare(b)))


</script>

<template>
    <main class="">
        <section class="bg-[#ABD7E0] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <Breadcrumbs :crumbs="[
                ]" />
                <h1 class="text-[#665E7A] text- text-4xl font-bold mt-4">
                    Glossary
                </h1>
            </div>
        </section>
        <section class="max-w-7xl mx-auto py-8 flex justify-start">
            <div>
                <div class="top-16">
                    <ul class="space-y-4 shadow-md p-4 rounded-sm">
                        <li v-for="group in glossaryKeys" :key="group">
                            <a :href="'#' + group" class="text-gray-500 text-sm font-bold">
                                {{ group }}
                            </a>
                            <ul class="ml-4 space-y-2">
                                <li v-for="item in glossaryByCategory[group]" :key="item.id">
                                    <a :href="'#' + item.term" class="text-gray-500 text-sm">
                                        {{ item.term }}
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                
                </div>
            </div>
            <div class="mx-20">
                <div v-for="(group, index_group) in glossaryKeys" :key="group" class="mb-16" :id="group">
                    <h2 class="text-gray-700 text-2xl font-bold ">
                        {{ group }}
                    </h2>
                    <div>
                        <div>
                            <div v-for="(item, index) in glossaryByCategory[group]" :key="item.id" :id="item.term"
                                class="bg-white py-4 rounded-lg max-w-prose"
                                :class="{'shadow-[#ABD7E0]': item.active}"
                            >
                                <div class="flex flex-start">
                                    <h3 class="text-gray-500 text-lg font-bold">
                                        {{ item.term }}
                                    </h3>
                                    <span v-if="index_group > 0">
                                        <a :href="'#top'" class="mx-3 text-gray-500">↑</a>
                                    </span>
                                </div>
                                <p class="text-gray-500 text-sm mt-2">
                                    <span v-html="$renderMathString(item.definition)"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>
</template>
