<template>
    <div>
        <ul>
            <li class="list-disc list-inside flex items-center">
                <NuxtLink
                    :to="'/domains/' + variation.domainSlug + '/families/' + variation.familySlug + '/variations/' + variation.variationSlug"
                    :class="{
                        'text-gray-900 font-bold': current,
                        'text-gray-900 hover:text-gray-900 font-medium hover:underline': !current,
                    }">
                    <span v-html="$renderMathString(variation.variation)"> </span>
                </NuxtLink>
                <button v-if="hasChildren" @click="toggleCollapse"
                    :class="['ml-2 transform transition-transform', { 'rotate-180': !isCollapsed }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="#898A8D"
                            d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
                <span v-if="isCollapsed && hasChildren"
                    class="ml-2 bg-[#4E9BB9] text-white text-s rounded-full w-5 h-5 flex items-center justify-center shadow-lg">{{
                        variation.children.length }}</span>
            </li>
            <li v-for="(item, index) in variation.children" :key="index" class="ml-4" v-show="!isCollapsed">
                <SimpleTreeNode :variation="item" :level="level + 1" />
            </li>
        </ul>
    </div>
</template>

<script setup>
const route = useRoute();
const isCollapsed = ref(true);

const props = defineProps({
    variation: Object,
    level: {
        type: Number,
        default: 0
    }
});

const current = computed(() => route.params.variation === props.variation.variationSlug);
const hasChildren = computed(() => props.variation.children && props.variation.children.length > 0);

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};

const shouldExpandNode = (node, level) => {
    if (level < 2) {
        return true;
    }
    if (node.variationSlug === route.params.variation) {
        return true;
    }
    if (node.children) {
        return node.children.some(child => shouldExpandNode(child, level + 1));
    }
    return false;
};

onMounted(() => {
    if (shouldExpandNode(props.variation, props.level)) {
        isCollapsed.value = false;
    }
});
</script>

<style scoped>
.transform {
    transition: transform 0.3s ease;
}
</style>
