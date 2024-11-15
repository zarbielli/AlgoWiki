<template>
  <div class="my-8 text-[#665E7A]">
    <div class="mx-auto max-w-2xl px-6 lg:px-8">
      <dl class="grid grid-cols-3 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
        <div class="mx-auto flex max-w-xs flex-col gap-y-1">
          <dt class="text-base text-[#665E7A]">Domains</dt>
          <dd class="order-first text-xl font-semibold tracking-tight text-[#665E7A] sm:text-3xl">{{ stats.domains }}</dd>
        </div>
        <div class="mx-auto flex max-w-xs flex-col gap-y-1">
          <dt class="text-base text-[#665E7A]">Problems</dt>
          <dd class="order-first text-xl font-semibold tracking-tight text-[#665E7A] sm:text-3xl">{{ stats.variations }}
          </dd>
        </div>
        <div class="mx-auto flex max-w-xs flex-col gap-y-1">
          <dt class="text-base text-[#665E7A]">Algorithms</dt>
          <dd class="order-first text-xl font-semibold tracking-tight text-[#665E7A] sm:text-3xl">{{ stats.algorithms }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>

const { data: stats } = useFetch(`${useRuntimeConfig().public.API_URL}/stats`)

</script>