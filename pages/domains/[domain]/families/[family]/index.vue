<script setup>

const route = useRoute()
const [
    { data: family },
    { data: variations }
] = await Promise.all([
    useFetch(`${useRuntimeConfig().public.API_URL}/families/` + route.params.family, {
        query: {
            domain: route.params.domain
        }
    }),
    useFetch(`${useRuntimeConfig().public.API_URL}/variations`, {
        query: {
            domain: route.params.domain,
            family: route.params.family
        }
    })
])

function getInitials(name) {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ')
    const initials = words.map(word => word.charAt(0)).join('')
    return initials.slice(0, 3).toUpperCase()
}

function nestObjects(array) {
    const itemMap = {};
    // Create a mapping from id to item
    array.forEach(item => {
        itemMap[item.id] = { ...item, children: [] };
    });

    // Create the nested structure
    const result = [];
    array.forEach(item => {
        if (item.parentId === null) {
            result.push(itemMap[item.id]);
        } else {
            if (itemMap[item.parentId]) { // Check if the parent exists
                itemMap[item.parentId].children.push(itemMap[item.id]);
            }
        }
    });
    return result
}

const nested = nestObjects(variations.value)



</script>

<template>
    <main class="">
        <section class="bg-[#ABD7E0] py-8 px-2">
            <div class="max-w-7xl mx-auto">
                <Breadcrumbs :crumbs="[
                    { name: 'Domains', href: '/domains', current: true },
                    { name: family.domain, href: '/domains/' + route.params.domain, current: true },
                ]" />
                <h1 class="text-[#665E7A] text-4xl font-bold mt-4">
                    {{ family.family }}
                </h1>
                <div class="max-w-prose mt-4">
                    <p class="text-justify mb-4">
                        <span v-html="$renderMathString(family.familyDescription)"> </span>
                    </p>
                </div>


            </div>
        </section>






        <div class="max-w-7xl mx-auto mt-8 px-4">
            <div v-for="(item, index) in nested" :key="index">
                <div class="">
                    <TreeNode :variation="item" />
                </div>
            </div>
        </div>

    </main>
</template>
