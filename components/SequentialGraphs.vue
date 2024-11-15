<script setup>
const { $renderMathString } = useNuxtApp();

const props = defineProps({
    algorithms: Array,
});

const yLabels = {
    1: "Constant",
    2: "Logarithmic",
    3: "Linear",
    4: "n log n",
    5: "Quadratic",
    6: "Cubic",
    7: "Poly (> Cubic)",
    8: "Exponential",
};

const chart = ref(null);

const timeData = computed(() => {
    const sortedAlgorithms = props.algorithms.filter(algorithm => algorithm.timeComplexityClass).map((algorithm) => {
        return {
            ...algorithm,
            x: algorithm.year,
            y: Number(algorithm.timeComplexityClass),
        };
    }).sort((a, b) => a.year - b.year);
    const lowerBoundPoints = []
    const others = []
    let bestTime = Infinity;
    sortedAlgorithms.forEach((algorithm) => {
        if (Number(algorithm.timeComplexityClass) < bestTime) {
            lowerBoundPoints.push(algorithm);
            bestTime = Number(algorithm.timeComplexityClass);
        } else {
            others.push(algorithm);
        }
    });
    const lowerBoundLine = lowerBoundPoints.length ? [...lowerBoundPoints, {
        x: new Date().getFullYear(),
        y: Number(lowerBoundPoints[lowerBoundPoints.length - 1].timeComplexityClass)

    }] : []

    return {
        lowerBoundLine,
        lowerBoundPoints,
        others
    }
});

const spaceData = computed(() => {
    const sortedAlgorithms = props.algorithms.filter(algorithm => algorithm.spaceComplexityClass).map((algorithm) => {
        return {
            ...algorithm,
            x: algorithm.year,
            y: Number(algorithm.spaceComplexityClass),
        };
    }).sort((a, b) => a.year - b.year);
    const lowerBoundPoints = []
    const others = []
    let bestSpace = Infinity;
    sortedAlgorithms.forEach((algorithm) => {
        if (Number(algorithm.spaceComplexityClass) < bestSpace) {
            lowerBoundPoints.push(algorithm);
            bestSpace = Number(algorithm.spaceComplexityClass);
        } else {
            others.push(algorithm);
        }
    });
    const lowerBoundLine = lowerBoundPoints.length ? [...lowerBoundPoints, {
        x: new Date().getFullYear(),
        y: Number(lowerBoundPoints[lowerBoundPoints.length - 1].spaceComplexityClass)

    }] : []

    return {
        lowerBoundLine,
        lowerBoundPoints,
        others
    }
});

const timeSpaceData = computed(() => {
    const sortedAlgorithms = props.algorithms.filter(algorithm => algorithm.spaceComplexityClass && algorithm.timeComplexityClass).map((algorithm) => {
        return {
            ...algorithm,
            x: Number(algorithm.timeComplexityClass),
            y: Number(algorithm.spaceComplexityClass),
        };
    }).sort((a, b) => a.year - b.year);
    let lowerBoundPoints = []
    let bestAlgorithm = Infinity;
    sortedAlgorithms.forEach((algorithm) => {
        const distance = Math.sqrt(Number(algorithm.spaceComplexityClass) ** 2 + Number(algorithm.timeComplexityClass) ** 2);

        if (distance < bestAlgorithm) {
            bestAlgorithm = distance;
            lowerBoundPoints = [algorithm];
        } else if (distance === bestAlgorithm) {
            lowerBoundPoints.push(algorithm);
        }
    });

    const others = sortedAlgorithms.filter(algorithm => {
        const distance = Math.sqrt(Number(algorithm.spaceComplexityClass) ** 2 + Number(algorithm.timeComplexityClass) ** 2);
        return distance !== bestAlgorithm;
    });



    const lowerBoundLine = lowerBoundPoints

    return {
        lowerBoundLine,
        lowerBoundPoints,
        others
    }
});



const chartOptionsTemplate = ref({
    chart: {
        type: "scatter",

    },
    credits: {
        enabled: false
    },
    title: {
        text: null,
    },

    xAxis: {
        title: {
            text: "Year",
        },
        showLastLabel: true,

        max: new Date().getFullYear(),
    },
    yAxis: {
        title: {
            text: "Time Complexity",
        },

        min: 1,
        max: 8,
        tickInterval: 1,
        labels: {
            formatter: function () {
                return yLabels[this.value];
            },
        },
    },
    tooltip: {
        borderRadius: 3,
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        useHTML: true,
        formatter: function () {
            if (this.point && typeof this.point === "object") {
                const header = `
                    <div class="flex w-full justify-between gap-8">
                        <div style="color: ${this.series.color};"  class="font-bold">${$renderMathString(this.point.name)}</div>
                        <div class="font-bold">${this.point.year}</div>

                    </div><br>`;
                const time = `
                    <div class="">
                        <span style="color: gray; font-size: 11px">Time complexity </span><br>
                        <span class="font-bold">${$renderMathString(
                    this.point.timeComplexityWorstOnly,
                    { mode: "block" }
                )}</span>

                    </div><br>

                    `;
                const space = `
                    <div class="">
                        <span style="color: gray; font-size: 11px">Space complexity </span><br>
                        <span class="font-bold">${$renderMathString(
                    this.point.spaceComplexityAuxiliary,
                    { mode: "block" }
                )}</span>

                    </div>

                    `;

                return `
                    <div 
                    style="border-color: ${this.series.color};"
                    class="bg-white/70 backdrop-blur-sm shadow-sm p-4 border rounded-lg">
                        ${header}
                        ${time}
                        ${space}
                    </div>
                `

            }
            return "unknown";
        },
    },
    series: [
        {
            type: "line",
            step: true,

            name: "Lower Bound",
            data: timeData.value.lowerBoundLine,
            color: "#4E9BB9",
            lineWidth: 4,

            marker: {
                enabled: false,
            },
            states: {
                hover: {
                    lineWidth: 0,
                },
            },
            enableMouseTracking: false,
        },
        {
            name: "Lower Bound",
            data: timeData.value.lowerBoundPoints,
            color: "#4E9BB9",
            marker: {
                symbol: "circle",
                radius: 6,
            },
            dataLabels: {
                position: "left",
                enabled: true,
                useHTML: true,
                formatter: function () {
                    return `<span style="z-index: -9999;">${$renderMathString(this.point.name)}</span>`;
                },
                style: {
                    fontSize: "11px",
                },
            },
            jitter: {
                x: 0.04,
            },
        },
        {
            name: "Others",
            data: timeData.value.others,
            color: "#838383",
            marker: {
                symbol: "circle",
                radius: 4,
            },

            jitter: {
                x: -0.04,
            },
        },



    ],
})


const tabs = [
    { name: "Time Complexity", current: true },
    { name: "Space Complexity", current: false },
    { name: "Time x Space Complexity", current: false },
];
const selectedTab = ref("Time Complexity");

const chartOptions = computed(() => {
    if (selectedTab.value === "Time Complexity") {
        return {
            ...chartOptionsTemplate.value,
            series: [
                {
                    ...chartOptionsTemplate.value.series[0],
                    data: timeData.value.lowerBoundLine,
                },
                {
                    ...chartOptionsTemplate.value.series[1],
                    data: timeData.value.lowerBoundPoints,
                },
                {
                    ...chartOptionsTemplate.value.series[2],
                    data: timeData.value.others,
                },
            ]
        }
    } else if (selectedTab.value === "Space Complexity") {
        return {
            ...chartOptionsTemplate.value,
            yAxis: {
                ...chartOptionsTemplate.value.yAxis,
                title: {
                    text: "Space Complexity",
                },
            },
            series: [
                {
                    ...chartOptionsTemplate.value.series[0],
                    data: spaceData.value.lowerBoundLine,
                },
                {
                    ...chartOptionsTemplate.value.series[1],
                    data: spaceData.value.lowerBoundPoints,
                },
                {
                    ...chartOptionsTemplate.value.series[2],
                    data: spaceData.value.others,
                },
            ]
        }
    } else if (selectedTab.value === "Time x Space Complexity") {
        return {
            ...chartOptionsTemplate.value,
            yAxis: {
                ...chartOptionsTemplate.value.yAxis,
                title: {
                    text: "Space Complexity",
                },
                gridLineWidth: 1,

            },
            xAxis: {
                ...chartOptionsTemplate.value.yAxis,
                gridLineWidth: 1,

                title: {
                    text: "Time Complexity",
                },
            },
            series: [
                {
                    ...chartOptionsTemplate.value.series[0],
                    step: false,
                    lineWidth: 1,
                    data: timeSpaceData.value.lowerBoundLine,
                },
                {
                    ...chartOptionsTemplate.value.series[2],
                    data: timeSpaceData.value.others,
                },
                {
                    ...chartOptionsTemplate.value.series[1],
                    jitter: false,
                    data: timeSpaceData.value.lowerBoundPoints,
                },
            ]
        }
    }
})

const key = ref(0);

watch(() => [selectedTab.value, props.algorithms], () => {
    key.value += 1;
});

const collapsed = ref(false)
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
    <div class="bg-white shadow sm:rounded-lg text-sm  w-full mb-4 border border-gray-100 p-4">
        <div class="flex justify-center items-center flex-wrap">
            <div class="flex gap-10">
                <button @click="() => selectedTab = 'Time Complexity'"
                    :class="selectedTab == 'Time Complexity' ? 'bg-[#4E9BB9] text-white' : 'bg-white text-gray-700'"
                    class="px-3 py-1 text-sm font-medium rounded-md cursor-pointer">Time Complexity</button>
                <button @click="() => selectedTab = 'Space Complexity'"
                    :class="selectedTab == 'Space Complexity' ? 'bg-[#4E9BB9] text-white' : 'bg-white text-gray-700'"
                    class="px-3 py-1 text-sm font-medium rounded-md cursor-pointer">Space Complexity</button>
                <button @click="() => selectedTab = 'Time x Space Complexity'"
                    :class="selectedTab == 'Time x Space Complexity' ? 'bg-[#4E9BB9] text-white' : 'bg-white text-gray-700'"
                    class="px-3 py-1 text-sm font-medium rounded-md cursor-pointer">Time x Space Complexity</button>

                <button @click="toggleCollapse" :class="['transform transition-transform', { 'rotate-180': collapsed }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="#898A8D" d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="pt-4">
            <div v-if="!props.algorithms.length" class="text-center text-gray-500 font-semibold">
                Insufficient data to display graph
            </div>
            <highchart v-show="!collapsed" v-else ref="chart" :options="chartOptions" :key="key" />
        </div>
    </div>
</template>
<style scoped>
.transform {
  transition: transform 0.3s ease;
}
</style>
