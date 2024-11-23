<script setup>
import { ref, computed } from 'vue';

const columnsOptions = [
    { name: "Name", value: "name" },
    { name: "Year", value: "year" },
    { name: "Time Complexity", value: 'timeComplexityWorstOnly' },
    { name: "Space Complexity", value: 'spaceComplexityAuxiliary' },
    { name: "Computational Model", value: 'computationalModel' },
    { name: "Randomized?", value: 'randomized' },
    { name: "Type of Randomized Algorithm", value: 'typeOfRandomizedAlgorithm' },
    { name: "Approximate?", value: 'approximate' },
    { name: "Approximation Factor", value: 'approximationFactor' },
    { name: "Parameter definitions", value: "parameterDefinitions" },
    { name: "Span/Depth", value: "parallelAlgorithmSpanDepth" },
    { name: "Work", value: "parallelAlgorithmWork" },
    { name: "Number of Processors", value: "numberOfProcessors" },
    { name: "Link", value: "paperReferenceLink" }
];

const showExportModal = ref(false);
const selectAllDomains = ref(true);
const selectAllFamilies = ref(true);
const selectAllVariations = ref(true);
const selectAll = ref(true);
const activeColumns = ref([...columnsOptions]);
const selectedDomains = ref([]);
const selectedFamilies = ref([]);
const selectedVariations = ref([]);

// Search queries
const domainSearch = ref('');
const familySearch = ref('');
const variationSearch = ref('');
const columnSearch = ref('');

const { data: domains } = await useFetch(`${useRuntimeConfig().public.API_URL}/domains`);
const { data: families } = await useFetch(`${useRuntimeConfig().public.API_URL}/families`);
const { data: variations } = await useFetch(`${useRuntimeConfig().public.API_URL}/variations`);

// Filtered lists based on search and hierarchy
const filteredDomains = computed(() => {
    if (!domains.value) return [];
    const searchTerm = domainSearch.value.toLowerCase();
    return domains.value.filter(domain =>
        searchTerm === '' || domain.domain.toLowerCase().includes(searchTerm)
    );
});

const filteredFamilies = computed(() => {
    if (!families.value || selectedDomains.value.length === 0) return [];
    const searchTerm = familySearch.value.toLowerCase();
    const familiesMap = new Set(selectedDomains.value);

    return families.value.filter(family =>
        familiesMap.has(family.domainSlug) &&
        (searchTerm === '' || family.family.toLowerCase().includes(searchTerm))
    );
});

const filteredVariations = computed(() => {
    if (!variations.value || selectedFamilies.value.length === 0) return [];
    const searchTerm = variationSearch.value.toLowerCase();
    const familiesMap = new Set(selectedFamilies.value);

    return variations.value.filter(variation =>
        familiesMap.has(variation.familySlug) &&
        (searchTerm === '' || variation.variation.toLowerCase().includes(searchTerm))
    );
});

const filteredColumns = computed(() => {
    return columnsOptions.filter(column =>
        column.name.toLowerCase().includes(columnSearch.value.toLowerCase())
    );
});

const toggleSelectAllColumns = () => {
    if (!selectAll.value) {
        activeColumns.value = [...columnsOptions];
    } else {
        activeColumns.value = [];
    }
    selectAll.value = !selectAll.value;
};

const toggleSelectAllDomains = () => {
    if (selectAllDomains.value) {
        selectedDomains.value = filteredDomains.value.map(d => d.domainSlug);
    } else {
        selectedDomains.value = [];
    }
    selectAllDomains.value = !selectAllDomains.value;
};

const toggleSelectAllFamilies = () => {
    if (selectAllFamilies.value) {
        selectedFamilies.value = filteredFamilies.value.map(f => f.familySlug);
    } else {
        selectedFamilies.value = [];
    }
    selectAllFamilies.value = !selectAllFamilies.value;
};

const toggleSelectAllVariations = () => {
    if (selectAllVariations.value) {
        selectedVariations.value = filteredVariations.value.map(v => v.variationSlug);
    } else {
        selectedVariations.value = [];
    }
    selectAllVariations.value = !selectAllVariations.value;
};

const handleColumns = (e) => {
    const value = e.target.value;
    const index = activeColumns.value.findIndex(x => x.value === value);
    if (index === -1) {
        activeColumns.value.push(columnsOptions.find(x => x.value === value));
    } else {
        activeColumns.value.splice(index, 1);
    }
};

const normalizeData = (data) => {
    return String(data || '').replace(/[\$\n";]/g, match =>
        match === '\n' ? ', ' : ''
    );
};

const downloadData = async () => {
    try {
        // Batch fetch algorithms in parallel
        const algorithmPromises = selectedVariations.value.map(variationSlug =>
            fetch(`${useRuntimeConfig().public.API_URL}/algorithms?variation=${variationSlug}`)
                .then(res => res.json())
        );

        const algorithmsArrays = await Promise.all(algorithmPromises);
        const algorithms = algorithmsArrays.flat();

        // Pre-compute active column map for faster lookups
        const activeColumnMap = new Map(
            activeColumns.value.map(col => [col.value, col.name])
        );

        // Generate CSV content more efficiently
        const headers = Array.from(activeColumnMap.values());
        const rows = algorithms.map(algorithm =>
            Array.from(activeColumnMap.keys())
                .map(key => normalizeData(algorithm[key]))
        );

        const csvContent = [headers, ...rows]
            .map(row => row.join(';'))
            .join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'algowiki-dataset-export.csv';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading data:', error);
    }
};
</script>

<template>
    <main>
        <section class="bg-[#ABD7E0] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <Breadcrumbs :crumbs="[]" />
                <h1 class="text-[#665E7A] text-4xl font-bold mt-4">
                    Download
                </h1>
                <div class="flex justify-between flex-wrap text-gray-700">
                    <div class="max-w-prose mt-4">
                        <p class="max-w-prose">
                            Export a snapshot of the AlgoWiki Dataset by selecting the desired domains, families,
                            variations, and columns to include in the export.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto py-8 px-4">
            <div class="bg-white shadow sm:rounded-lg p-6">
                <div class="space-y-6">

                    <!-- Domains Selection -->
                    <div>
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-bold text-gray-600">Select Domains</h3>
                            <div class="flex items-center gap-4">
                                <button @click="toggleSelectAllDomains"
                                    class="text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]/80">
                                    {{ selectAllDomains ? 'Select All' : 'Unselect All' }}
                                </button>
                                <div class="w-64">
                                    <input type="text" v-model="domainSearch" placeholder="Search domains..."
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#4E9BB9] focus:ring-[#4E9BB9]">
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-4 p-1">
                            <div v-for="domain in filteredDomains" :key="domain.domainSlug" class="flex items-center">
                                <input type="checkbox" :value="domain.domainSlug" v-model="selectedDomains"
                                    class="h-4 w-4 rounded border-gray-300 text-[#4E9BB9] focus:ring-[#4E9BB9]">
                                <label class="ml-2 text-sm text-gray-700">{{ domain.domain }}</label>
                            </div>
                        </div>
                    </div>

                    <!-- Families Selection -->
                    <div>
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-bold text-gray-600">Select Families</h3>
                            <div v-if="selectedDomains.length > 0" class="flex items-center gap-4">
                                <button @click="toggleSelectAllFamilies"
                                    class="text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]/80">
                                    {{ selectAllFamilies ? 'Select All' : 'Unselect All' }}
                                </button>
                                <div class="w-64">
                                    <input type="text" v-model="familySearch" placeholder="Search families..."
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#4E9BB9] focus:ring-[#4E9BB9]">
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedDomains.length > 0">
                            <div class="mt-4">
                                <div
                                    class="grid grid-cols-2 gap-4 max-h-[calc(3*(theme(spacing.8)+theme(spacing.4)))] overflow-y-auto p-1">
                                    <div v-for="family in filteredFamilies" :key="family.familySlug"
                                        class="flex items-center">
                                        <input type="checkbox" :value="family.familySlug" v-model="selectedFamilies"
                                            class="h-4 w-4 rounded border-gray-300 text-[#4E9BB9] focus:ring-[#4E9BB9]">
                                        <label class="ml-2 text-sm text-gray-700">{{ family.family }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Variations Selection -->
                    <div>
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-bold text-gray-600">Select Variations</h3>
                            <div v-if="selectedFamilies.length > 0 && selectedDomains.length > 0"
                                class="flex items-center gap-4">
                                <button @click="toggleSelectAllVariations"
                                    class="text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]/80">
                                    {{ selectAllVariations ? 'Select All' : 'Unselect All' }}
                                </button>
                                <div v-if="selectedFamilies.length > 0" class="w-64">
                                    <input type="text" v-model="variationSearch" placeholder="Search variations..."
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#4E9BB9] focus:ring-[#4E9BB9]">
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedFamilies.length > 0 && selectedDomains.length > 0">
                            <div class="mt-4">
                                <div
                                    class="grid grid-cols-2 gap-4 max-h-[calc(3*(theme(spacing.8)+theme(spacing.4)))] overflow-y-auto p-1">
                                    <div v-for="variation in filteredVariations" :key="variation.variationSlug"
                                        class="flex items-center">
                                        <input type="checkbox" :value="variation.variationSlug"
                                            v-model="selectedVariations"
                                            class="h-4 w-4 rounded border-gray-300 text-[#4E9BB9] focus:ring-[#4E9BB9]">
                                        <label class="ml-2 text-sm text-gray-700">{{ variation.variation }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columns Selection -->
                    <div>
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-bold text-gray-600">Select Columns</h3>
                            <div v-if="selectedFamilies.length > 0 && selectedDomains.length > 0 && selectedVariations.length > 0"
                                class="flex items-center gap-4">
                                <button @click="toggleSelectAllColumns"
                                    class="text-sm font-medium text-[#4E9BB9] hover:text-[#4E9BB9]/80">
                                    {{ !selectAll ? 'Select All' : 'Unselect All' }}
                                </button>
                                <div class="w-64">
                                    <input type="text" v-model="columnSearch" placeholder="Search columns..."
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#4E9BB9] focus:ring-[#4E9BB9]">
                                </div>
                            </div>
                        </div>
                        <div v-if="selectedFamilies.length > 0 && selectedDomains.length > 0 && selectedVariations.length > 0"
                            class="mt-4">
                            <div
                                class="grid grid-cols-2 gap-4 max-h-[calc(3*(theme(spacing.8)+theme(spacing.4)))] overflow-y-auto p-1">
                                <div v-for="option in filteredColumns" :key="option.value" class="flex items-center">
                                    <input @change="handleColumns" type="checkbox" :value="option.value"
                                        :checked="activeColumns.find(x => x.value == option.value)"
                                        class="h-4 w-4 rounded border-gray-300 text-[#4E9BB9] focus:ring-[#4E9BB9]">
                                    <label class="ml-2 text-sm text-gray-700">{{ option.name }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Download Button -->
                    <div class="flex justify-end relative group">
                        <button @click="downloadData"
                            :disabled="!selectedDomains.length || !selectedFamilies.length || !selectedVariations.length || !activeColumns.length"
                            :class="[
                                'px-6 py-2 rounded-md inline-flex items-center',
                                selectedDomains.length && selectedFamilies.length && selectedVariations.length && activeColumns.length
                                    ? 'bg-[#4E9BB9] hover:bg-[#4E9BB9]/80 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            ]">
                            Download Dataset
                            <Icon name="heroicons-solid:download" class="-mr-1 ml-1 h-5 w-5 flex-shrink-0"
                                aria-hidden="true" />
                        </button>
                        <!-- Updated tooltip -->
                        <div class="absolute bottom-full mb-2 hidden group-hover:block"
                            v-if="!selectedDomains.length || !selectedFamilies.length || !selectedVariations.length || !activeColumns.length">
                            <div
                                class="bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-sm rounded-md py-2 px-3 whitespace-nowrap">
                                <div class="flex items-center gap-2 text-gray-700">
                                    <Icon name="heroicons-solid:information-circle" class="h-5 w-5 text-[#4E9BB9]" />
                                    A domain, family, variation, and column must be selected.
                                </div>
                            </div>
                            <div
                                class="w-3 h-3 bg-white transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-lg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>