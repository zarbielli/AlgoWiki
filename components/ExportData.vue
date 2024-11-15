<script setup>
const showModal = ref(false);
const selectAll = ref(true);
const activeColumns = ref([]);

const props = defineProps(['filteredAlgorithms', 'tab', 'columnsOptions', 'reduction'])

watch(()=> props.filteredAlgorithms, (value) => {
    props.filteredAlgorithms = value;
})

const openModal = () => {
    activeColumns.value = [];

    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const closeModalOverlay = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const handleColumns = (e) => {
    const value = e.target.value;
    const index = activeColumns.value.findIndex(x => x.value === value);

    if (index === -1) {
        activeColumns.value.push(props.columnsOptions.find(x => x.value === value));
    } else {
        activeColumns.value.splice(index, 1);
    }
};

const toggleSelectAllColumns = () => {
    if (selectAll.value) {
        activeColumns.value = [...props.columnsOptions];
    } else {
        activeColumns.value = [];
    }
    selectAll.value = !selectAll.value;
};

const normalizeData = (data) => {
    return String(data)
        .replace(/\$/g, '')
        .replace(/\n/g, ', ')
        .replace(/"/g, '')
        .replace(/;/g, '');
};

const blob = () => {
    const rows = props.filteredAlgorithms.map(algorithm =>
        activeColumns.value.map(column => normalizeData(algorithm[column.value]))
    );

    const headers = activeColumns.value.map(column => column.name);
    const csvContent = [headers, ...rows].map(e => e.join(";")).join("\n");

    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

const fileName = () => {
    if (props.reduction) {
        return 'reductions.csv';
    }

    const baseFileName = `algorithms-${props.filteredAlgorithms[0]['variationSlug']}`;
    return props.tab ? `${baseFileName}-${props.tab.toLowerCase()}.csv` : `${baseFileName}.csv`;
};

const downloadCSV = () => {
    const link = document.createElement("a");

    link.setAttribute("href", URL.createObjectURL(blob()));
    link.setAttribute("download", fileName());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeModal();
};
</script>
<template>
    <button @click="openModal"
        class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
        Export Data
        <Icon name="heroicons-solid:download"
            class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
    </button>
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75"
        @click="closeModalOverlay">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden w-1/5" @click.stop>
            <div class="p-12">
                <h2 class="text-lg font-bold mb-2">Export Data</h2>
                <p class="text-gray-700 mb-4 font-semibold">Select the columns to export</p>
                <div class="flex justify-start gap-2">
                    <div class="py-2">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Columns</span>
                            <button @click="toggleSelectAllColumns"
                                class="text-sm font-medium text-gray-700 hover:text-blue-800">
                                {{ selectAll ? 'Select All' : 'Unselect All' }}
                            </button>
                        </div>
                        <div v-for="option in props.columnsOptions" :key="option.value">
                            <label class="flex">
                                <input @change="handleColumns" type="checkbox"
                                    :checked="activeColumns.find(x => x.value == option.value)"
                                    class="h-4 w-4 rounded border-gray-300 outline-red outline-offset-0 ring-offset-0 text-[#4E9BB9] focus:ring-[#4E9BB9]"
                                    :value="option.value">
                                <span class="ml-2 text-sm font-medium text-gray-700">{{ option.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end">
                    <button @click="downloadCSV"
                        class="bg-[#4E9BB9] text-white px-4 py-2 rounded-md hover:bg-[#4E9BB9]/80">Export
                        Data</button>
                </div>
            </div>
        </div>
    </div>
</template>
