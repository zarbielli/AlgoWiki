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
                                Reduction: {{ reduction.fromVariation }}
                                <Icon name="heroicons:arrow-long-right-16-solid" /> {{ reduction.toVariation }}
                            </DialogTitle>
                            <div class="grid sm:grid-cols-2 gap-8 my-8" >
                                <div>
                                    <span class="text-xs text-gray-600">From Variation: </span>
                                    <p class="text-sm">{{ reduction.fromVariation }}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-600">To Variation: </span>
                                    <p class="text-sm">{{ reduction.toVariation }}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-600">Type: </span>
                                    <p class="text-sm">{{ reduction.type || '-' }}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-600">Model: </span>
                                    <p class="text-sm">{{ reduction.model || '-' }}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-600">Year: </span>
                                    <p class="text-sm">{{ reduction.year || '-' }}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-600">Implied Lower Bound Power: </span>
                                    <p class="text-sm" v-html="$renderMathString(reduction.impliedLowerBoundPower || '-')"></p>
                                    </div>
                                <div>
                                    <span class="text-xs text-gray-600">Assumption/Hypothesis: </span>
                                    <p class="text-sm" v-html="$renderMathString(reduction.assumptionHypothesis || '-')"></p>
                                </div>
                                <div class="max-w-xs">
                                    <span class="text-xs text-gray-600">Description: </span>
                                    <p class="text-sm" v-html="$renderMathString(reduction.description || '-')"></p>
                                </div>
                                <div class="max-w-xs">
                                    <span class="text-xs text-gray-600">Implications: </span>
                                    <p class="text-sm" v-html="$renderMathString(reduction.implications || '-')"></p>
                                </div>

                                <div class="max-w-xs">
                                    <span class="text-xs text-gray-600">References: </span>
                                    <a :href="reduction.link"
                                        target="_blank" rel="noopener"
                                        class="inline-block text-xs overflow-hidden text-ellipsis hover:underline">{{ reduction.reductionReferences }}</a>
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
    reduction: Object,
})

const isOpen = ref(false)

function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}



</script>