
<template>
    <div>

        <slot :openModal="openModal" />
    </div>
    <TransitionRoot :show="isOpen" as="template" @after-leave="query = ''">
        <ClientOnly>

            <Dialog v-if="isOpen" as="div" class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20" @close="closeModal">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                    leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <DialogOverlay as="div" class="fixed inset-0 bg-gray-500 backdrop-blu bg-opacity-25 transition-opacity" />
                </TransitionChild>
    
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95">
                    <Combobox as="div"
                        class="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                        @update:modelValue="onSelect">
                        <div class="relative">
    
    
                            <Icon name="heroicons:magnifying-glass"
                                class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                aria-hidden="true" />
                            <ComboboxInput
                                class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                                placeholder="Search..." @change="query = $event.target.value" />
                        </div>
    
                        <div v-if="query === ''" class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
                            <Icon name="carbon:chart-network" class="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                            <p class="mt-4 font-semibold text-gray-900">Search for domains, problems and algorithms</p>
                        </div>
    
                        <ComboboxOptions v-if="query !== '' && items && Object.keys(items).length > 0" static
                            class="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2">
                            <li v-for="[category, itemsOptions] in Object.entries(items)" :key="category">
                                <h2 class="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">
                                    {{ category }}
                                </h2>
                                <ul class="mt-2 text-sm text-gray-800">
                                    <ComboboxOption v-for="item in itemsOptions" :key="item.id" :value="item" as="template"
                                        v-slot="{ active }">
                                        <li
                                            :class="['cursor-default select-none px-4 py-2', active && 'bg-[#4E9BB9] text-white']">
                                            {{ item.algorithm || item.variation || item.family || item.domain }}
                                        </li>
                                    </ComboboxOption>
                                </ul>
                            </li>
                        </ComboboxOptions>
    
                        <div v-if="query !== '' && !loading && Object.keys(items).length === 0"
                            class="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
                            <Icon name="heroicons:face-frown" class="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                            <p class="mt-4 font-semibold text-gray-900">No results found</p>
                            <p class="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
                        </div>
                    </Combobox>
                </TransitionChild>
            </Dialog>
        </ClientOnly>
    </TransitionRoot>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { watchDebounced } from '@vueuse/core'


const items = ref({})
const query = ref('')
const loading = ref(false)


const isOpen = ref(false)

function closeModal() {
  isOpen.value = false
}
function openModal() {
  isOpen.value = true
}

watchDebounced(
    query,
    async () => {
        loading.value = true
        const { data } = await useFetch(`${useRuntimeConfig().public.API_URL}`, {
            query: {
                search: query.value.trim(),
            }
        });
        items.value = data.value
        loading.value = false
    },
    { debounce: 500, maxWait: 1000 },
)
const router = useRouter()

function onSelect(item) {
    query.value = item.algorithm || item.variation || item.family || item.domain
    let url = ''
    if (item.domainSlug) {
        url = url.concat(`/domains/${item.domainSlug}`)
    }
    if (item.familySlug) {
        url = url.concat(`/families/${item.familySlug}`)
    }
    if (item.variationSlug) {
        url = url.concat(`/variations/${item.variationSlug}`)
    }
    if (item.algorithmSlug) {
        url = url.concat(``)
    }
    query.value = ''
    router.push(url)
    closeModal()
}


</script>