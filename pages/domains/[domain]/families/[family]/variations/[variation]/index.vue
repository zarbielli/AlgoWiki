<script setup>
const route = useRoute()
const [
    { data: variation },
    { data: algorithms }
] = await Promise.all([
    useFetch(`${useRuntimeConfig().public.API_URL}/variations/` + route.params.variation, {
        query: {
            domain: route.params.domain,
            family: route.params.family
        }
    }),
    useFetch(`${useRuntimeConfig().public.API_URL}/algorithms`, {
        query: {
            domain: route.params.domain,
            family: route.params.family,
            variation: route.params.variation
        }
    })
])

const { $renderMathString } = useNuxtApp();

const tabs = [
    {
        name: 'Sequential',
        numberOfAlgorithms: algorithms.value.filter(algorithm => !Number(algorithm.parallel) && !Number(algorithm.distributed)).length
    },
    {
        name: 'Parallel',
        numberOfAlgorithms: algorithms.value.filter(algorithm => Number(algorithm.parallel)).length
    },

]
const selectedTab = ref('Sequential')
const activeFilters = ref([])


const filteredAlgorithms = computed(() => {
    return algorithms.value.filter(algorithm => {

        // randomized filter
        const randomizedFilter = activeFilters.value.filter(filter => filter.key === 'randomized').map(x => x.value)
        if (randomizedFilter.length > 0) {
            if (!randomizedFilter.includes(algorithm.randomized)) {
                return false
            }
        }

        const randomizedTypeFilter = activeFilters.value.filter(filter => filter.key === 'typeOfRandomizedAlgorithm').map(x => x.value)
        if (randomizedTypeFilter.length > 0) {
            if (!randomizedTypeFilter.includes(algorithm.typeOfRandomizedAlgorithm)) {
                return false
            }
        }

        // approximation factor filter
        const approximationFactorFilter = activeFilters.value.filter(filter => filter.key === 'approximate').map(x => x.value)
        if (approximationFactorFilter.length > 0) {
            if (!approximationFactorFilter.includes(algorithm.approximate)) {
                return false
            }
        }



        if (selectedTab.value === 'Sequential') {
            // model filter
            const modelFilter = activeFilters.value.filter(filter => filter.key === 'model').map(x => x.value)
            if (modelFilter.length > 0) {
                if (!modelFilter.includes(algorithm.computationalModel)) {
                    return false;
                }
            }



            return !Number(algorithm.parallel) && !Number(algorithm.distributed)
        } else if (selectedTab.value === 'Parallel') {
            // model filter
            const modelFilter = activeFilters.value.filter(filter => filter.key === 'model').map(x => x.value)
            if (modelFilter.length > 0) {
                const modelEncoding = algorithm.modelEncoding.split(';').map(x => x.trim())
                if (!modelFilter.some(model => modelEncoding.includes(model))) {
                    return false
                }
            }

            return algorithm.parallel == 1
        } else if (selectedTab.value === 'Distributed') {
            return algorithm.distributed == 1
        }

    })
})


const relevantAlgorithms = computed(() => {
    return filteredAlgorithms.value.filter(algorithm => Number(algorithm.reviewed) > 0.001)
})

const otherAlgorithms = computed(() => {
    return filteredAlgorithms.value.filter(algorithm => Number(algorithm.reviewed) <= 0.001)
})

function nestObjects(array) {

    const itemMap = {};
    // Create a mapping from id to item
    array.forEach(item => {
        itemMap[item.id] = { ...item, children: [] };
    });

    // Create the nested structure
    const result = [];
    array.forEach(item => {
        if (item.parentId === null) {
            result.push(itemMap[item.id]);
        } else {
            if (itemMap[item.parentId]) { // Check if the parent exists
                itemMap[item.parentId].children.push(itemMap[item.id]);
            }
        }
    });
    return result
}

function handleFilter(e) {
    activeFilters.value = e

}

const defaultColumns = computed(() => {
    if (selectedTab.value === 'Sequential') {
        return [
            { name: "Name", value: "name" },
            { name: "Year", value: "year" },
            { name: "Time Complexity", value: 'timeComplexityWorstOnly' },
            { name: "Space Complexity", value: 'spaceComplexityAuxiliary' },
        ]
    }
    else if (selectedTab.value === 'Parallel') {
        return [
            { name: "Name", value: "name" },
            { name: "Year", value: "year" },
            { name: "Span/Depth", value: 'parallelAlgorithmSpanDepth' },
            { name: "Work", value: 'parallelAlgorithmWork' },
            { name: "Number of Processors", value: 'numberOfProcessors' },
        ]
    }
})

</script>

<template>
    <main class="">
        <section class="bg-[#ABD7E0] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <Breadcrumbs :crumbs="[
                    { name: 'Domains', href: '/domains' },
                    { name: variation.domain, href: '/domains/' + variation.domainSlug },
                    { name: variation.family, href: '/domains/' + variation.domainSlug + '/families/' + variation.familySlug, current: true },
                ]" />
                <div class="max-w-prose">

                    <h1 class="text-[#665E7A] text-4xl font-bold mt-4">
                        <span v-html="$renderMathString(variation.variation)"> </span>
                    </h1>
                </div>
                <div class="flex justify-between flex-wrap text-gray-700">

                    <div class="max-w-prose mt-4">
                        <p class="text-justify mb-4">
                            <span v-html="$renderMathString(variation.description)"> </span>
                        </p>
                        <div v-if="variation.parameters">
                            <p><b>Parameters</b> </p>
                            <ul>
                                <li class="max-w-[24ch]" v-for="(param, idx) in variation.parameters.split('\n')"
                                    :key="idx">
                                    <span v-html="$renderMathString(param)"> </span>

                                </li>
                            </ul>
                        </div>


                    </div>
                    <div class="text-sm" v-if="variation.related && variation.related.length > 0">
                        <h2 class="font-bold">Related Problems</h2>
                        <div v-for="(related, idx) in nestObjects(variation.related)" :key="idx">
                            <SimpleTreeNode :variation="related" />
                        </div>

                    </div>

                </div>
            </div>
        </section>
        <div class="max-w-7xl mx-auto">
            <div class="sm:hidden">
                <label for="tabs" class="sr-only">Select a tab</label>
                <select id="tabs" name="tabs" v-model="selectedTab"
                    class="block w-full focus:ring-[#4E9BB9] focus:border-[#4E9BB9] border-gray-300 rounded-md">
                    <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }} {{ }}</option>
                </select>
            </div>
            <div class="hidden sm:block">
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex" aria-label="Tabs">
                        <a v-for="tab in tabs" :key="tab.name" @click="() => selectedTab = tab.name" :class="[
                            selectedTab == tab.name ?
                                'border-[#4E9BB9] text-[#4E9BB9]' :
                                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer']"
                            :aria-current="selectedTab == tab.name ? 'page' : undefined">
                            {{ tab.name }} <span class="text-xs">({{ tab.numberOfAlgorithms }})</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
        <div class="mx-auto max-w-7xl my-4 ">

            <div class="flex flex-col">
                <SequentialGraphs v-if="selectedTab == 'Sequential'" :algorithms="relevantAlgorithms" />
                <ParallelGraphs v-else-if="selectedTab == 'Parallel'" :algorithms="relevantAlgorithms" />

                <AlgorithmsFilter :algorithms="algorithms" @filter="handleFilter" :type="selectedTab" />

                <AlgorithmsTable :algorithms="relevantAlgorithms" :defaultColumns="defaultColumns" :tab="selectedTab" />
                <ReductionsTable :reductions="variation.reductions" />
                <RelevantAlgorithmsTable :algorithms="otherAlgorithms" />
            </div>
        </div>

    </main>
</template>


<style scoped>
.katex-html>.base {
    white-space: normal;
}
</style>
