<template>
    <div class="hidden sm:block pt-4 relative" :class="{
        'ml-8 pl-4': level > 0,
        'border-l-4': level > 0,
        'last-child border-transparent': isLast
    }">
        <div ref="node" class="flex w-fit shadow-sm relative">
            <div :style="{ 'background-color': `hsl(${140 + (level * 20) % 360}, 70%, 50%)` }"
                :class="['flex-shrink-0 flex relative items-center justify-center w-16 text-white text-lg font-bold rounded-l-md ']">
                <!-- initials -->
                <div v-if="level > 0" class="absolute h-1 bg-gray-200 w-5 top-1/2 -left-5"></div>
                <span>{{ getInitials(props.variation.problemProperties || props.variation.variation) }}</span>
            </div>
            <div
                class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
                <div class="flex-1 max-w-prose px-4 py-2 text-sm">
                    <NuxtLink
                        :to="'/domains/' + props.variation.domainSlug + '/families/' + props.variation.familySlug + '/variations/' + props.variation.variationSlug"
                        class="text-gray-900 font-medium hover:text-gray-600">
                        <span
                            v-html="$renderMathString(props.variation.problemProperties || props.variation.variation)"></span>
                    </NuxtLink>
                    <p v-if="props.variation.shortDescription" class="max-w-prose text-xs text-gray-400"
                        v-html="$renderMathString(props.variation.shortDescription)"></p>
                    <p class="text-gray-500">{{ props.variation.algorithms }} Algorithms</p>
                </div>
                <button v-if="hasChildren" @click="toggleCollapse"
                    :class="['transform transition-transform', { 'rotate-180': isCollapsed }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="#898A8D"
                            d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
                <span v-if="isCollapsed && hasChildren"
                    class="absolute top-0 right-0 bg-[#4E9BB9] text-white text-s rounded-full w-5 h-5 flex items-center justify-center">{{
                        props.variation.children.length }}</span>
            </div>
        </div>
        <div v-if="!isCollapsed">
            <div v-if="props.variation.children.length">
                <div v-if="props.variation.children[0].problemProperties" class="text-gray-500 text-xs pt-2">
                    <TableNode :variations="props.variation.children" />
                </div>
                <template v-else>
                    <div v-for="(item, index) in props.variation.children" :key="index" class="flex relative gap-2">
                        <TreeNode :variation="item" :level="level + 1"
                            :is-last="index === props.variation.children.length - 1" />
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div class="sm:hidden">
        <ul>
            <li class="list-disc">
                <NuxtLink
                    :to="'/domains/' + props.variation.domainSlug + '/families/' + props.variation.familySlug + '/variations/' + props.variation.variationSlug"
                    class="text-gray-900 font-medium hover:text-gray-600">{{ props.variation.variation }}
                </NuxtLink>
            </li>
            <li v-for="(item, index) in props.variation.children" :key="index" class="ml-4">
                <TreeNode :variation="item" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TableNode from './TableNode.vue';

const props = defineProps({
    variation: {
        type: Object,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    isLast: {
        type: Boolean,
        default: false
    }
});

const isCollapsed = ref(props.level > 1);

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}

function getInitials(name) {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
    const initials = words.map(word => word.charAt(0)).join('');
    return initials.slice(0, 3).toUpperCase();
}

const node = ref(null);

const height = computed(() => {
    if (node.value) {
        return (node.value.clientHeight / 2) + 18 + 'px';
    }
    return 'auto';
});

const hasChildren = computed(() => props.variation.children && props.variation.children.length > 0);
</script>


<style scoped>
.last-child::after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: -4px;
    width: 4px;
    height: v-bind(height);
    background-color: #e2e8f0;
}

.transform {
    transition: transform 0.3s ease;
}

.uis--angle-up {
    display: inline-block;
    width: 1em;
    height: 1em;
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4'/%3E%3C/svg%3E");
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
}
</style>
