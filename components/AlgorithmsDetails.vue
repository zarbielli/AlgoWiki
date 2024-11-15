<template>
    <div class="">
        <button type="button" @click="openModal" class="text-[#4E9BB9] hover:text-[#4E9BB9AA]">
            Details
        </button>
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                <span v-html="$renderMathString(algorithm.name)"> </span>
                            </DialogTitle>
                            <div class="mt-2 grid sm:grid-cols-4 gap-8">
                                <div v-for="(value, key) in algorithmColumns" :key="key">
                                    <span class="text-xs text-gray-600" :style="{ whiteSpace: 'pre-wrap' }">{{ value }}:
                                    </span>
                                    <p class="text-sm" :style="{ whiteSpace: 'pre-wrap' }"
                                        v-html="$renderMathString(algorithm[key])"></p>
                                </div>
                            </div>
                            <div class="mt-8">
                                <h3>References</h3>
                                <div v-for="(reference, key) in referencesColumns" :key="key">
                                    <template v-if="algorithm[key] !== ''">
                                        <span class="text-xs text-gray-600">{{ reference }}: </span>
                                        <a v-if="isValidURL(algorithm[key])" :href="algorithm[key]" target="_blank"
                                            rel="noopener"
                                            class="text-xs overflow-hidden text-ellipsis hover:underline">
                                            {{ algorithm[key] }}
                                        </a>
                                        <span v-else class="text-xs overflow-hidden text-ellipsis"> {{ algorithm[key] }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    @click="closeModal">
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
const { $renderMathString } = useNuxtApp();


const props = defineProps({
    algorithm: Object,
})

const { algorithm } = toRefs(props);

const cleanAuthors = (authors) => {
    return authors.replace(/\[|\]|'/g, '');
};

const replaceBooleans = (boolean_value) => {
    return boolean_value === '0' ? "No" : "Yes";
};

const removeFieldsDinamically = (callback) => {
    algorithm.value.approximate === 'No' ? delete algorithmColumns['approximationFactor'] : '';
    algorithm.value.randomized === 'No' ? delete algorithmColumns['typeOfRandomizedAlgorithm'] : '';

    if (Number(algorithm.value.parallel) === 0) {
        parallelFields.forEach(field => delete algorithmColumns[field]);
        parallelReferenceFields.forEach(field => delete referencesColumns[field]);
    }

    callback();
}

const filterAlgorithmColumns = () => {
    const keys = Object.keys(algorithmColumns)

    keys.forEach(key => {
        if (algorithm.value[key].length === 0) {
            delete algorithmColumns[key]
        }
    })
};

onBeforeMount(() => {
    algorithm.value.authors = cleanAuthors(algorithm.value.authors);
    algorithm.value.approximate = replaceBooleans(algorithm.value.approximate);
    algorithm.value.randomized = replaceBooleans(algorithm.value.randomized);
    removeFieldsDinamically(filterAlgorithmColumns);
});

const isOpen = ref(false)

function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}

const algorithmColumns = {
    year: "Year",
    authors: "Authors",
    approximate: "Approximation Factor",
    timeComplexityWorstOnly: "Time Complexity",
    spaceComplexityAuxiliary: "Space Complexity",
    computationalModel: "Computational Model",
    randomized: "Randomized?",
    typeOfRandomizedAlgorithm: "Type of Randomized Algorithm",
    approximate: "Approximate?",
    approximationFactor: "Approximation Factor",
    parameterDefinitions: "Parameter definitions",
    parallelAlgorithmSpanDepth: "Span/Depth",
    parallelAlgorithmWork: "Work",
    numberOfProcessors: "Number of Processors",

}

const referencesColumns = {
    "reference": "Reference",
    "paperReferenceLink": "Paper Reference",
    "paperReferenceForConstants": "Constants",
    "parallelAlgorithmSpanReferences": "Parallel Algorithm Span",
    "parallelAlgorithmWorkReferences": "Parallel Algorithm Work",
    "workEfficiencyReference": "Work Efficiency",
    "timeComplexityReference": "Time Complexity",
    "spaceComplexityReference": "Space Complexity",
    "otherReferences": "Other",
}

const parallelFields = [
    'parallelAlgorithmSpanDepth',
    'numberOfProcessors',
    'parallelAlgorithmWork'
];

const parallelReferenceFields = [
    'parallelAlgorithmSpanReferences',
    'parallelAlgorithmWorkReferences',
    'workEfficiencyReference'
];


function isValidURL(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

</script>