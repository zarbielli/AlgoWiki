<script setup>
import {

  Popover,
  PopoverButton,
  PopoverPanel,

} from '@headlessui/vue'
const { $renderMathString } = useNuxtApp();
const props = defineProps(['reductions', 'defaultColumns'])

watch(() => props.defaultColumns, (value) => {
  activeColumns.value = value
})

const query = ref('')
const sortBy = ref('year')
const collapsed = ref(true);
const sortDirection = ref('DESC')
const disableButton = computed(() => {
  return props.reductions.length === 0;
});

const activeColumns = ref([
  { value: "year", name: "Year" }
])

const columnsOptions = [
  // { value: "fromVariation", name: "From Variation" },
  // { value: "toVariation", name: "To Variation" },
  { value: "fromFamily", name: "From Family" },
  { value: "toFamily", name: "To Family" },
  { value: "type", name: "Type" },
  { value: "randomized", name: "Randomized" },
  { value: "calls", name: "Calls" },
  { value: "model", name: "Model" },
  { value: "assumptionHypothesis", name: "Assumption/Hypothesis" },
  { value: "implications", name: "Implications" },
  { value: "impliedLowerBoundPower", name: "Implied Lower Bound Power" },
  { value: "reductionReferences", name: "Reduction References" },
  { value: "link", name: "Link" },
  { value: "year", name: "Year" },
  { value: "preserves", name: "Preserves" },
  { value: "notes", name: "Notes" },
  { value: "reductionId", name: "Reduction ID" },
  { value: "description", name: "Description" },
]

const handleColumns = (e) => {
  const value = e.target.value
  const index = activeColumns.value.findIndex(x => x.value === value)
  if (index === -1) {
    activeColumns.value.push(columnsOptions.find(x => x.value === value))
  } else {
    activeColumns.value.splice(index, 1)
  }
}

const filteredReductions = computed(() => {
  return props.reductions.filter(reduction => {
    if (query.value) {
      const queryLower = query.value.toLowerCase()
      if (!reduction.fromVariation.toLowerCase().includes(queryLower) && !reduction.toVariation.toLowerCase().includes(queryLower)) {
        return false
      }
    }
    return true
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
  }
  )
})

const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = column
    sortDirection.value = 'ASC'
  }
}

const from_link = (reduction) => { return `/domains/${reduction.fromDomainSlug}/families/${reduction.fromFamilySlug}/variations/${reduction.fromVariationSlug}` };
const to_link = (reduction) => { return `/domains/${reduction.toDomainSlug}/families/${reduction.toFamilySlug}/variations/${reduction.toVariationSlug}` };

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg text-sm w-full  mb-4 border border-gray-100 p-2">
    <div class="w-full relative p-2 ">
      <div class="flex flex-wrap gap-4 justify-between items-center mb-2  px-6">
        <div>
          <h1 class="text-lg font-bold text-gray-600">
            Reductions Table
          </h1>
          <p v-show="!disableButton" class="text-sm text-gray-500">Displaying {{ filteredReductions.length }} of {{
            props.reductions.length }} reductions</p>
          <p v-show="disableButton" class="text-gray-500 font-semibold"> Insuffient Data to display table </p>
        </div>
        <div class="flex items-center gap-8">
          <div v-show="!collapsed" class="flex inline-flex items-center gap-8">
            <div class="relative rounded-xl bg-white shadow-2xl ring-2 ring-black ring-opacity-5">
              <Icon name="heroicons:magnifying-glass"
                class="pointer-events-none absolute top-2 left-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                class=" w-full border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0 "
                placeholder="Filter..." v-model="query" />
            </div>
            <Popover as="div" class="relative inline-block text-left">
              <div>
                <PopoverButton
                  class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Columns
                  <Icon name="heroicons-solid:chevron-down"
                    class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true" />
                </PopoverButton>
              </div>

              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <PopoverPanel
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-2 px-4">
                    <div>
                      <label class="flex">
                        <input type="checkbox" disabled
                          class="h-4 w-4 rounded border-gray-300 outline-red outline-offset-0 ring-offset-0 text-[#4E9BB9]/70 focus:ring-[#4E9BB9]"
                          checked>
                        <span class="ml-2">From Problem Variation</span>
                      </label>

                    </div>
                    <div>
                      <label class="flex">
                        <input type="checkbox" disabled
                          class="h-4 w-4 rounded border-gray-300 outline-red outline-offset-0 ring-offset-0 text-[#4E9BB9]/70 focus:ring-[#4E9BB9]"
                          checked>
                        <span class="ml-2">To Problem Variation</span>
                      </label>

                    </div>
                    <div v-for="option in columnsOptions" :key="option.value">
                      <label class="flex">
                        <input @change="handleColumns" type="checkbox"
                          :checked="activeColumns.find(x => x.value == option.value)"
                          class="h-4 w-4 rounded border-gray-300 outline-red outline-offset-0 ring-offset-0 text-[#4E9BB9] focus:ring-[#4E9BB9]"
                          :value="option.value">
                        <span class="ml-2">{{ option.name }}</span>
                      </label>
                    </div>
                  </div>
                </PopoverPanel>
              </transition>
            </Popover>
            <ExportData :filteredAlgorithms="filteredReductions" :tab="null" :columnsOptions="columnsOptions"
              :reduction="true" />
          </div>
          <button @click="toggleCollapse" :disabled="disableButton"
            :class="['transform transition-transform', { 'rotate-180': collapsed, 'opacity-50 cursor-not-allowed': disableButton }]">
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path fill="#898A8D"
                d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
            </svg>
          </button>
        </div>
      </div>

      <div class="overflow-clip">
        <div v-show="!collapsed" class="overflow-auto w-full">
          <table class="relative divide-y w-full divide-gray-300">
            <thead class="sticky top-0 bg-gray-50">
              <tr class="">
                <th scope="col"
                  class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/4">
                  <button @click="handleSort('fromVariation')" class="group inline-flex">
                    From Problem Variation
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
                      'invisible group-hover:visible': sortBy !== 'fromVariation',
                      'bg-gray-200 text-gray-900': sortBy === 'fromVariation',
                      'visible': sortBy === 'fromVariation'
                    }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === 'fromVariation'"
                        name="heroicons-solid:chevron-up" class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                </th>
                <th scope="col"
                  class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/4">
                  <button @click="handleSort('toVariation')" class="group inline-flex">
                    To Problem Variation
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
                      'invisible group-hover:visible': sortBy !== 'toVariation',
                      'bg-graycreateLink-200 text-gray-900': sortBy === 'toVariation',
                      'visible': sortBy === 'toVariation'
                    }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === 'toVariation'" name="heroicons-solid:chevron-up"
                        class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                </th>
                <th scope="col" v-for="column in activeColumns" :key="column.value"
                  class="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <button @click="handleSort(column.value)" class="group inline-flex">
                    {{ column.name }}
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
                      'invisible group-hover:visible': sortBy !== column.value,
                      'bg-gray-200 text-gray-900': sortBy === column.value,
                      'visible': sortBy === column.value
                    }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === column.value" name="heroicons-solid:chevron-up"
                        class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                </th>

                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">See more</span>
                </th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(reduction, reductionIdx) in filteredReductions" :key="reductionIdx"
                :class="reductionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <a :href="from_link(reduction)"> {{ reduction.fromVariation }} </a>
                </td>
                <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <a :href="to_link(reduction)"> {{ reduction.toVariation }} </a>
                </td>
                <td v-for="column in activeColumns" :key="column.value" class=" px-3 py-4 text-sm text-gray-500">
                  <span v-if="column.name === 'Link'">
                    <a :href="reduction[column.value].split(',')[0]" target="_blank"> {{
                      $renderMathString(reduction[column.value]) }} </a>
                  </span>
                  <span v-else v-html="$renderMathString(reduction[column.value])"></span>
                </td>
                <td class="px-6 py-4  text-right text-sm font-medium">
                  <ReductionsDetails :reduction="reduction" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>