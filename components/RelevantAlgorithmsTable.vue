<script setup>
const { $renderMathString } = useNuxtApp();
const props = defineProps(['algorithms']);

const query = ref('');
const sortBy = ref('year');
const collapsed = ref(true);
const sortDirection = ref('DESC');
const disableButton = computed(() => {
    return props.algorithms.length === 0;
});
const columns = ref([
    { name: "Name", value: "name" },
    { name: "Year", value: "year" },
    { name: "Reference", value: 'reference' }
]);

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
};

const handleSort = (column) => {
    if (sortBy.value === column) {
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC';
    } else {
        sortBy.value = column;
        sortDirection.value = 'ASC';
    }
};

const filteredAlgorithms = computed(() => {
    return props.algorithms.filter(algorithm => {
        if (query.value) {
            const queryLower = query.value.toLowerCase();
            if (!algorithm.name.toLowerCase().includes(queryLower)) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        const aValue = Number(a[sortBy.value]);
        const bValue = Number(b[sortBy.value]);

        if (sortDirection.value === 'ASC') {
            // If both values are numbers, sort numerically
            if (!isNaN(aValue) && !isNaN(bValue)) {
                return aValue - bValue;
            } else {
                // Otherwise, sort alphabetically
                return a[sortBy.value].localeCompare(b[sortBy.value]);
            }
        } else {
            if (!isNaN(aValue) && !isNaN(bValue)) {
                return bValue - aValue;
            } else {
                return b[sortBy.value].localeCompare(a[sortBy.value]);
            }
        }
    });
});
</script>

<template>
    <div class="bg-white shadow sm:rounded-lg text-sm w-full mb-4 border border-gray-100 p-2">
        <div class="w-full relative p-2">
            <div class="flex flex-wrap gap-4 justify-between items-center mb-2 px-6">
                <div>
                    <h1 class="text-lg font-bold text-gray-600"> Other relevant algorithms </h1>
                    <p v-show="!disableButton" class="text-sm text-gray-500"> Displaying {{ filteredAlgorithms.length }}
                        of {{ props.algorithms.length }} other relevant algorithms </p>
                    <p v-show="disableButton" class="text-gray-500 font-semibold"> Insuffient Data to display table </p>
                </div>
                <button @click="toggleCollapse" :disabled="disableButton"
                    :class="['transform transition-transform', { 'rotate-180': collapsed, 'opacity-50 cursor-not-allowed': disableButton }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="#898A8D"
                            d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
            </div>
            <div v-show="!collapsed" class="overflow-clip">
                <div class="overflow-auto w-full">
                    <table class="relative divide-y w-full divide-gray-300">
                        <thead class="sticky top-0 bg-gray-50">
                            <tr>
                                <th scope="col" v-for="column in columns" :key="column.value"
                                    class="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <button @click="handleSort(column.value)" class="group inline-flex">
                                        {{ column.name }}
                                        <span class="ml-2 flex-none rounded group-hover:bg-gray-300" :class="{
                                            'invisible group-hover:visible': sortBy !== column.value,
                                            'bg-gray-200 text-gray-900': sortBy === column.value,
                                            'visible': sortBy === column.value
                                        }">
                                            <Icon v-if="sortDirection === 'ASC' && sortBy === column.value"
                                                name="heroicons-solid:chevron-up" class="h-5 w-5" aria-hidden="true" />
                                            <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5"
                                                aria-hidden="true" />
                                        </span>
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(algorithm, algorithmIdx) in filteredAlgorithms" :key="algorithmIdx"
                                :class="algorithmIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                <td v-for="column in columns" :key="column.value"
                                    class="px-3 py-4 text-sm text-gray-500">
                                    <span :style="{ whiteSpace: 'pre-wrap' }"
                                        v-html="$renderMathString(algorithm[column.value])"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.transform {
    transition: transform 0.3s ease;
}
</style>
