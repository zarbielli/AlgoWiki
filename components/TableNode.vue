<template>
    <div class="ml-8 pl-4">
      <div class="flex justify-end px-2 pb-2">

        <Popover as="div" class="relative inline-block text-left">
            <div>
              <PopoverButton
                class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Filter
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
                <div class=" px-4">
                  <div v-for="(values,key) in categories" :key="key" class="py-2">
                    {{ key }}
                    <label class="flex py-1" v-for="value in values" :key="value" >
                      <input @change="handleColumns" type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 outline-red outline-offset-0 ring-offset-0 text-[#4E9BB9] focus:ring-[#4E9BB9]"
                        :checked="filters[key] && filters[key].includes(value)" :value="key+':'+value">
                      <span class="ml-2">{{ value }}</span>
                    </label>
  
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>
      </div>
        <div class="overflow-auto w-full">

            <table class="relative divide-y w-full divide-gray-300 text-center">
                <thead class="sticky top-0 bg-gray-50">
                    <tr class="">
                        <th scope="col"
                            class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            <button @click="handleSort('variation')" class="group inline-flex">
                    Variation
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
              'invisible group-hover:visible': sortBy !== 'variation',
              'bg-gray-200 text-gray-900': sortBy === 'variation',
              'visible': sortBy === 'variation'
            }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === 'variation'" name="heroicons-solid:chevron-up"
                        class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                        </th>
                        <th scope="col"
                            class="whitespace-nowrap py-3.5 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-6">
                            <button @click="handleSort('algorithms')" class="group inline-flex">
                    # of Algorithms
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
              'invisible group-hover:visible': sortBy !== 'algorithms',
              'bg-gray-200 text-gray-900': sortBy === 'algorithms',
              'visible': sortBy === 'algorithms'
            }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === 'algorithms'" name="heroicons-solid:chevron-up"
                        class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                        </th>
                        <th scope="col"
                            class="whitespace-nowrap py-3.5 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-6"
                            v-for="(value, key) in categories">
                            <button @click="handleSort(key)" class="group inline-flex">
                    {{key}}
                    <span class="ml-2 flex-none rounded  group-hover:bg-gray-300" :class="{
              'invisible group-hover:visible': sortBy !== key,
              'bg-gray-200 text-gray-900': sortBy === key,
              'visible': sortBy === key
            }">
                      <Icon v-if="sortDirection === 'ASC' && sortBy === key" name="heroicons-solid:chevron-up"
                        class="h-5 w-5" aria-hidden="true" />
                      <Icon v-else name="heroicons-solid:chevron-down" class="h-5 w-5" aria-hidden="true" />

                    </span>
                  </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(variation, index) in getDataTable()" :key="index"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="py-4 pl-4 pr-3 text-sm text-left  text-gray-900 sm:pl-6">
                            <NuxtLink
                        :to="'/domains/' + variation.domainSlug + '/families/' + variation.familySlug + '/variations/' + variation.variationSlug"
                        class="text-gray-900 font-medium hover:text-gray-600">
                        <span v-html="$renderMathString(variation.variation)">

                        </span>
                    </NuxtLink>
                            <p v-if="variation.shortDescription" class="max-w-prose text-xs text-gray-400"
                            v-html="$renderMathString(variation.shortDescription)"></p>

                        </td>
                        <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {{ variation.algorithms }}
                        </td>
                        <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                            v-for="(value, key) in categories">
                            {{ variation[key] || '-' }}
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    </div>
</template>

<script setup>
import {

Popover,
PopoverButton,
PopoverPanel,

} from '@headlessui/vue'

const props = defineProps({
    variations: Object,
});



function parseCategories(str) {
    const lines = str.split(/\r?\n/);
    const categories = {};

    lines.forEach(line => {
        // Split the line at the first occurrence of ":"
        const [category, valuesStr] = line.split(/:\s*\[/);
        if (category && valuesStr) {
            // Trim the last character (should be "]"), split by ",", then trim each value
            const values = valuesStr.slice(0, -1).split(',')
                .map(value => value.trim().replace(/\]$/, '')); // Ensure removal of "]" from each value
            categories[category.trim()] = values;
        }
    });

    return categories;
}
const categories = parseCategories(props.variations[0].familyProperties);
console.log(categories)


const sortBy = ref('algorithms')
const sortDirection = ref('DESC')

const filters = ref({})


const handleColumns = (e) => {
  const [category, filter] = e.target.value.split(':')
  if (filters.value[category]) {
    if (filters.value[category].includes(filter)) {
      filters.value[category] = filters.value[category].filter(f => f !== filter)
    } else {
      filters.value[category].push(filter)
    }
  } else {
    filters.value[category] = [filter]
  }
  // remove empty filters
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key].length === 0) {
      delete filters.value[key]
    }
  })
}


function getDataTable() {
    const data = props.variations
        .filter(variation => variation.problemProperties)
        .map((variation) => {
            const row = {
                ...variation,
            };
            Object.entries(categories).forEach(([category, values]) => {
                row[category] = values.find(value => variation.problemProperties.includes(value)) || '';
            });
            return row;
        }).filter(variation => {
            return Object.entries(filters.value).every(([category, values]) => {
                return values.includes(variation[category])
            })
        })
    return data.sort((a, b) => {
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
}

const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = column
    sortDirection.value = 'ASC'
  }
}




function getInitials(name) {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ')
    const initials = words.map(word => word.charAt(0)).join('')
    return initials.slice(0, 3).toUpperCase()
}


</script>