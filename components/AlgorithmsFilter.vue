<script setup>

const props = defineProps({
    algorithms: Array,
    type: String,
});

const emit = defineEmits(["filter"]);

const collapsed = ref(false);
const activeFilters = ref([]);

watch(activeFilters.value, (newVal, oldVal) => {
    emit("filter", newVal);
});

const modelDict = {
    100: "PRAM",
    110: "PRAM-EREW",
    120: "PRAM-CREW",
    130: "PRAM-CRCW",
    131: "PRAM-CRCW-ARBITRARY",
    132: "PRAM-CRCW-COMMON",
    133: "PRAM-CRCW-PRIORITY",
    135: "Probabilistic PRAM-CRCW",
    200: "SIMD-SM",
    210: "SIMD-SM-R",
    220: "SIMD-SM-RW",
    300: "MIMD with shared memory (MIMD-TC)",
    310: "MIMD-TC EREW",
    320: "MIMD-TC CREW",
    330: "MIMD-TC CRCW",
    400: "BSP",
    500: "comparator circuits",
    510: "sorting network",
    520: "hardware sorter",
    600: "Other",
    610: "external memory model",
    700: "Distributed memory models",
};

function stringToColor(string, saturation = 80, lightness = 50, opacity = 1) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%, ${opacity})`;
}

const modelDictOptions = computed(() => {
    // if key is in any algorithm, then add it to the list
    const keys = Object.keys(modelDict);
    const algorithmsModels = props.algorithms.map((algorithm) => {
        return algorithm.modelEncoding;
    });
    const uniqueModels = algorithmsModels.flat().filter((v, i, a) => a.indexOf(v) === i);
    const filteredKeys = keys.filter((key) => {
        return uniqueModels.includes(`${key}`);
    });
    return filteredKeys.map((key) => {
        return {
            id: key,
            name: modelDict[key],
            value: `${key}`,
            count: algorithmsModels.filter((model) => model.includes(key)).length,
        };
    }).sort((a, b) => a.name.length - b.name.length);

});

const computationalModelOptions = computed(() => {
    if (props.type === "Sequential") {
        return [
            { id: 1, name: "Word RAM", value: 'Word RAM' },
            { id: 2, name: "Real RAM", value: 'Real RAM' },
        ]
    } else {
        return modelDictOptions.value
    }
});

const randomizedOptions = [
    { id: 1, name: "Randomized", value: '1', key: 'randomized'},
    { id: 2, name: "Deterministic", value: '0', key: 'randomized' },
    { id: 3, name: "Las Vegas", value: 'Las Vegas' , key: 'typeOfRandomizedAlgorithm'},
    { id: 4, name: "Monte Carlo", value: 'Monte Carlo', key: 'typeOfRandomizedAlgorithm' },
];

const approximationFactorOptions = [
    { id: 1, name: "Exact", value: '0' },
    { id: 2, name: "Approximate", value: '1' },
];

function handleFilter(key, value) {
    const index = activeFilters.value.findIndex((filter) => filter.key === key && filter.value === value);
    if (index === -1) {
        activeFilters.value.push({ key, value });
    } else {
        activeFilters.value.splice(index, 1);
    }
    
}

function clearFilters() {
    activeFilters.value.splice(0, activeFilters.value.length);
}

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
};

</script>

<template>
    <div class="bg-white shadow sm:rounded-lg text-sm  w-full mb-4 border border-gray-100 p-10">
        <div class="flex justify-between">
            <h2 class="text-lg font-bold text-gray-600">Filters</h2>
            <div class="flex justify-between gap-8">
                <button v-show="!collapsed" @click="clearFilters" class="text-sm font-medium text-gray-700 hover:text-[#4E9BB9AA] mb-2">Clear all</button>
                <button @click="toggleCollapse" :class="['transform transition-transform', { 'rotate-180': collapsed }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="#898A8D" d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
            </div>
        </div>
        <div v-show="!collapsed" class="inline-flex flex-wrap gap-x-8 gap-y-4">

            <div class="">
                <h3>Computational Model</h3>
                <div class="inline-flex mt-2 flex-wrap gap-1">
                    <span v-for="option in computationalModelOptions" :key="option.id">
                        <button 
                        @click="handleFilter('model', option.value)"
                        class="px-2 py-1 text-xs bg-gray-100 rounded-full  border"
                        :class="activeFilters.find(filter => filter.key === 'model' && filter.value === option.value) ? 'border-[#4E9BB9] text-[#4E9BB9]' : 'border-gray-200 text-gray-500'"
                        >

                            {{ option.name
                            }}
                        {{ option.count > 0 ? `(${option.count})` : '' }}    
                        </button>
                    </span>
                </div>
            </div>
            <div class="">
                <h3>Randomization</h3>
                <div class="inline-flex mt-2 flex-wrap gap-1">
                    <span v-for="option in randomizedOptions" :key="option.id">
                        <button class="px-2 py-1 text-xs bg-gray-100 rounded-full border "
                        :class="activeFilters.find(filter => filter.key === option.key && filter.value === option.value) ? 'border-[#4E9BB9] text-[#4E9BB9]' : 'border-gray-200 text-gray-500'"

                        @click="handleFilter(option.key, option.value)"

                        >{{ option.name
                            }}</button>
                    </span>
                </div>
            </div>
            <div class="">
                <h3>Approximation</h3>
                <div class="inline-flex mt-2 flex-wrap gap-1">
                    <span v-for="option in approximationFactorOptions" :key="option.id">
                        <button class="px-2 py-1 text-xs bg-gray-100 rounded-full border "
                        @click="handleFilter('approximate', option.value)"
                        :class="activeFilters.find(filter => filter.key === 'approximate' && filter.value === option.value) ? 'border-[#4E9BB9] text-[#4E9BB9]' : 'border-gray-200 text-gray-500'"
                        
                        >{{ option.name
                            }}</button>
                    </span>
                </div>
            </div>

        </div>

    </div>
</template>