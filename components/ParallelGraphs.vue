<script setup>
const { $renderMathString } = useNuxtApp();

const props = defineProps({
    algorithms: Array,
});

const modelDict = {
    100: "PRAM",
    110: "PRAM-EREW",
    120: "PRAM-CREW",
    130: "PRAM-CRCW",
    131: "PRAM-CRCW-ARBITRARY",
    132: "PRAM-CRCW-COMMON",
    133: "PRAM-CRCW-PRIORITY",
    135: "Probabilistic PRAM-CRCW",
    200: "SIMD-SM",
    210: "SIMD-SM-R",
    220: "SIMD-SM-RW",
    300: "MIMD with shared memory (MIMD-TC)",
    310: "MIMD-TC EREW",
    320: "MIMD-TC CREW",
    330: "MIMD-TC CRCW",
    400: "BSP",
    500: "comparator circuits",
    510: "sorting network",
    520: "hardware sorter",
    600: "Other",
    610: "external memory model",
    700: "Distributed memory models",
};

function stringToColor(string, saturation = 70, lightness = 50, opacity = 1) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return `hsl(${((string.length * 51) + hash % 360)}, ${((hash * string.length % 10 + saturation)) % 100}%, ${lightness}%, ${opacity})`;
}

const complexityEncodings = {
    "1": "$O(\\log{n})$",
    "2": "$O(\\log^2{n})$",
    "3": "$O(\\log^3{n})$",
    "4": "$O(\\log^4{n})$",
    "5": "$O(\\log^c{n})$",
    "6": "$O(n^{1/2})$",
    "7": "$O(n^{0.627} \\log^2{\\log{n}}/\\log^2{n})$",
    "8": "$O(n^{\\log{7}-2} \\log{n})$",
    "9": "$O(n/\\log{n})$",
    "10": "$O(n)$",
    "11": "$O(n \\log{n})$",
    "12": "$O(n \\log^2{n})$",
    "13": "$O(n \\log^3{n})$",
    "14": "$O(n \\log^4{n})$",
    "15": "$O(n \\log^c{n})$",
    "16": "$O(n^{1.5})$",
    "18": "$O(n^2/\\log^2{n})$",
    "19": "$O(n^2/\\log{n})$",
    "20": "$O(n^2)$",
    "21": "$O(n^2 \\log{n})$",
    "22": "$O(n^2 \\log^2{n})$",
    "23": "$O(n^2 \\log^3{n})$",
    "25": "$O(n^2 \\log^c{n})$",
    "27": "$O(n^{\\log{7}}/\\log{n})$",
    "28": "$O(n^{\\log{7}} \\log{n})$",
    "30": "$O(n^3)$",
    "31": "$O(n^3 \\log{n})$",
    "32": "$O(n^3 \\log^2{n})$",
    "33": "$O(n^3 \\log^3{n})$",
    "35": "$O(n^{3.25})$",
    "40": "$O(n^4)$",
    "41": "$O(n^4 \\log{n})$",
    "43": "$O(n^4 \\log^3{n})$",
    "46": "$O(n^5/ \\log^4{n})$",
    "49": "$O(n^5 / \\log{n})$",
    "51": "$O(n^5 \\log{n})$",
    "56": "$O(n^6/ \\log^4{n})$",
    "57": "$O(n^6/ \\log^3{n})$",
    "58": "$O(n^6/ \\log^2{n})$",
    "59": "$O(n^6/ \\log{n})$",
    "60": "$O(n^6)$",
    "61": "$O(n^6 \\log{n})$",
    "62": "$O(n^6 \\log^2{n})$",
    "70": "$O(n^7)$",
    "80": "$O(n^8)$",
    "90": "$O(n^9)$",
    "92": "$O(n^9 \\log^2{n})$",
    "938": "$O(2^{\\sqrt{n} \\log{3}/3})$",
    "940": "$O(2^{\\sqrt{n}})$",
    "942": "$O(2^{\\sqrt{n}} n^2)$",
    "944": "$O(2^{\\sqrt{n}} n^c)$",
    "950": "$O(4^{\\sqrt{n}})$",
    "960": "$2^{O(\\sqrt{n})}$",
    "974": "$O(2^{\\epsilon n}/n)$",
    "984": "$O(2^{n/8})$",
    "986": "$O(2^{n/4})$",
    "987": "$O(2^{3n/8})$",
    "988": "$O(2^{n/2})$",
    "990": "$O(2^n / n)$",
    "991": "$O(2^n \\log{n} / n)$",
    "1000": "$O(2^n)$",
    "1010": "$O(2^n n)$",
    "1020": "$O(2^n n^2)$",
    "1045": "$O(2^n n^c)$",
    "1099": "$O(2^{n+\\epsilon})$",
    "1515": "$O(2^{1.5n} n^{1.5})$",
    "1984": "$O(2^{2n} / n^{1.5})$",
    "2000": "$O(2^{2n})$",
    "2020": "$O(2^{2n} n^2)$",
    "2021": "$O(2^{2n} n^2 \\log{n})$",
    "3011": "$O(2^{3n} n \\log{n})$",
    "8000": "$O(\\log^n{\\log{n}})$",
    "8001": "$O(\\log{n} \\log^{n-1}{\\log{n}})$",
    "8010": "$O(n \\log^n{\\log{n}})$",
    "8011": "$O(n \\log{n} \\log^{n-1}{\\log{n}})$",
    "9000": "$O(n!)$",
    "9001": "$O(n n!)$",
    "9122": "$O(2^n n^{2n + 2})$",
    "9200": "$O(2^{2n^2})$",
    "9305": "$O(2^{\\log{5} n^3})$",
    "0.001": "$O(\\log^*{n})$",
    "0.1": "$O(\\log{\\log{n}})$",
    "0.2": "$O(\\log^2 {\\log{n}})$",
    "0.84": "$O(\\log{n}^{1/2} / \\log{\\log{n}}^{3/2})$",
    "0.85": "$O(\\log{n}^{1/2} / \\log{\\log{n}}^{1/2})$",
    "0.9": "$O(\\log{n}/\\log{\\log{n}})$",
    "1.001": "$O(\\log{n} \\log^*{n})$",
    "1.05": "$O(\\log{n} \\log{\\log{\\log{n}}})$",
    "1.1": "$O(\\log{n} \\log{\\log{n}})$",
    "1.101": "$O(\\log{n} \\log{\\log{n}} 2^{\\log^*{n}})$",
    "1.15": "$O(\\log{n} \\log^2{\\log{n}})$",
    "1.29": "$O(\\log{n}^{4/3} / \\log{\\log{n}}^{1/3})$",
    "1.5": "$O(\\log^{3/2}{n})$",
    "2.001": "$O(\\log^2{n} \\log^*{n})$",
    "2.07": "$O(\\log^2{n} \\log{\\log{n}}^3)$",
    "2.1": "$O(\\log^2{n} \\log{\\log{n}})$",
    "5.009": "$O(2^{\\log{n}^{0.5}})$",
    "5.01": "$O(2^{\\log{n}^{0.5}} \\log{n} / \\log{\\log{n}}^2)$",
    "5.02": "$O(n^\\epsilon)$",
    "5.021": "$O(n^\\epsilon \\log{n})$",
    "5.024": "$O(n^{0.00025} \\log{n})$",
    "5.025": "$O(n^{(\\log{7}-\\log{143640}/\\log{70})/2})$",
    "5.03": "$O(n^{0.062})$",
    "5.5": "$O(n^{0.25})$",
    "5.51": "$O(n^{1/4} \\log{n})$",
    "5.53": "$O(n^{0.312})$",
    "5.54": "$O(n^{0.3135} \\log^4{n})$",
    "5.545": "$O(n^{0.314} \\log^4{n})$",
    "5.55": "$O(n^{0.3145} \\log^4{n})$",
    "5.6": "$O(n^{1/3})$",
    "5.61": "$O(n^{1/3 + \\epsilon})$",
    "5.8": "$O(n^{1/2}/ \\log^2{n})$",
    "5.9": "$O(n^{1/2}/ \\log{n})$",
    "6.01": "$O(n^{1/2} \\log{\\log{n}})$",
    "6.1": "$O(n^{1/2} \\log{n})$",
    "6.11": "$O(n^{1/2} \\log{n} \\log{\\log{n}})$",
    "6.129": "$O(n^{1/2} \\log{n}^{4/3} / \\log{\\log{n}}^{1/3})$",
    "6.2": "$O(n^{1/2} \\log^2{n})$",
    "6.23": "$O(n^{1/2} \\log^3{n})$",
    "6.27": "$O(n^{\\log{3}-1})$",
    "6.5": "$O(n^{0.6})$",
    "7.15": "$O(n^{2/3-\\epsilon} \\log^c{n})$",
    "7.2": "$O(n^{2/3})$",
    "7.31": "$O(n^{0.69356805} \\log{n})$",
    "7.5": "$O(n^{0.75})$",
    "7.501": "$O(n^{0.75} \\log{\\log{n}})$",
    "7.51": "$O(n^{0.75} \\log{n})$",
    "8.1": "$O(n^{0.9})$",
    "8.3": "$O(n^{1-\\epsilon})$",
    "8.301": "$O(n^{1-\\epsilon} \\log^*{n})$",
    "8.31": "$O(n^{1-\\epsilon} \\log{n})$",
    "8.5": "$O(n/\\log^c{n})$",
    "8.7": "$O(n/\\log^4{n})$",
    "8.8": "$O(n/\\log^3{n})$",
    "8.895": "$O(n / (\\log^2{n} \\log^*{n}})$",
    "8.9": "$O(n/\\log^2{n})$",
    "8.9005": "$O(n \\alpha(n) /\\log^2{n})$",
    "8.94": "$O(n / (\\log{n} \\log{\\log{n}} 2^{\\log^*{n}}))$",
    "8.95": "$O(n / (\\log{n} \\log{\\log{n}}))$",
    "8.99": "$O(n / (\\log{n} \\log^*{n}})$",
    "9.0005": "$O(n \\alpha(n) /\\log{n})$",
    "9.05": "$O(n \\log{\\log{n}} / \\log{n})$",
    "9.06": "$O(n \\log^2{\\log{n}} / \\log{n})$",
    "9.08": "$O(n / \\log^{1/2}{n})$",
    "9.09": "$O(n / \\log^2{\\log{n}})$",
    "9.1": "$O(n/\\log{\\log{n}})$",
    "9.2": "$O(n/\\log{\\log{\\log{n}}})$",
    "9.999": "$O(n/\\log^*{n})$",
    "10.0005": "$O(n \\alpha(n))$",
    "10.001": "$O(n \\log^*{n})$",
    "10.1": "$O(n \\log{\\log{n}})$",
    "10.2": "$O(n \\log^2{\\log{n}})$",
    "10.4": "$O(n \\log^\\epsilon{n})$",
    "10.5": "$O(n \\log^{1/2}{n})$",
    "10.9": "$O(n \\log{n} / \\log{\\log{n}})$",
    "10.95": "$O(n \\log{n} \\log{\\log{\\log{n}}} / \\log{\\log{n}})$",
    "11.09": "$O(n \\log{n} \\log{\\log{n}} / \\log{\\log{\\log{n}}})$",
    "11.1": "$O(n \\log{n} \\log{\\log{n}})$",
    "11.2": "$O(n \\log{n} \\log{\\log{n}}^2)$",
    "11.3": "$O(n \\log{n} \\log{\\log{n}}^3)$",
    "11.41": "$O(n \\log^{1+\\epsilon}{n} / \\log{\\log{n}})$",
    "11.5": "$O(n \\log^{3/2}{n})$",
    "11.585": "$O(n \\log^{1.585}{n})$",
    "12.001": "$O(n \\log^2{n} \\log^*{n})$",
    "13.1": "$O(n \\log^3{n} \\log{\\log{n}})$",
    "15.011": "$O(n^{1+1/\\log{n}} \\log{n})$",
    "15.012": "$O(n^{1+1/\\log{n}} \\log^2{n})$",
    "15.019": "$O(n^{1+3\\epsilon} / \\log{n})$",
    "15.097": "$O(n^{1.1855})$",
    "15.099": "$O(n^{1.186})$",
    "15.101": "$O(n^{1.18643195})$",
    "15.103": "$O(n^{1.1864365})$",
    "15.104": "$O(n^{1.1865})$",
    "15.105": "$O(n^{1.1865} \\log{n})$",
    "15.107": "$O(n^{1.18775})$",
    "15.109": "$O(n^{1.188})$",
    "15.11": "$O(n^{1.188} \\log{n})$",
    "15.23": "$O(n^{\\log{54}/(2 \\log{5})})$",
    "15.236": "$O(n^{1.24})$",
    "15.238": "$O(n^{1.2475})$",
    "15.24": "$O(n^{1.247774})$",
    "15.25": "$O(n^{1.25})$",
    "15.26": "$O(n^{1.258325})$",
    "15.262": "$O(n^{1.259})$",
    "15.264": "$O(n^{1.26})$",
    "15.28": "$O(n^{1.305})$",
    "15.4": "$O(n^{4/3})$",
    "15.41": "$O(n^{4/3} \\log{n})$",
    "15.46": "$O(n^{1.39})$",
    "15.47": "$O(n^{\\log{143640}/(2 \\log{70})})$",
    "15.48": "$O(n^{1.4})$",
    "15.481": "$O(n^{1.4035})$",
    "15.49": "$O(n^{\\log{7}/2} / \\log{n})$",
    "15.5": "$O(n^{\\log{7}/2})$",
    "15.6": "$O(n^{\\log{7}/2} \\log{n})$",
    "15.603": "$O(n^{\\log{7}/2+0.25})$",
    "15.605": "$O(n^{\\log{7}/2+0.25} \\log^2{n})$",
    "15.61": "$O(n^{1.4255})$",
    "15.612": "$O(n^{1.4255} \\log^2{n})$",
    "15.614": "$O(n^{10/7} \\log^c{n})$",
    "15.7": "$O(n^{1.46})$",
    "15.92": "$O(n^{1.5} /2^{(\\log{n})^{0.5}})$",
    "15.925": "$O(n^{1.5} \\log{\\log{n}}^{3/2}/\\log{n}^{5/2})$",
    "15.93": "$O(n^{1.5}/\\log^2{n})$",
    "15.94": "$O(n^{1.5}/ (\\log{n} \\log{\\log{n}}))$",
    "15.95": "$O(n^{1.5}/\\log{n})$",
    "15.96": "$O(n^{1.5} \\log{\\log{n}}/\\log{n})$",
    "15.97": "$O(n^{1.5} \\log{\\log{n}}^2/\\log{n})$",
    "15.98": "$O(n^{1.5} \\log{\\log{n}}^{3/2}/\\log{n}^{1/2})$",
    "15.992": "$O(n^{1.5} \\log{\\log{n}}^3 / \\log{n}^2)$",
    "15.994": "$O(n^{1.5} \\log{\\log{n}}^{1/2} / \\log{n}^{3/2})$",
    "15.996": "$O(n^{1.5} \\log{\\log{n}}^{1/2} / \\log{n}^{1/2})$",
    "15.998": "$O(n^{1.5} \\log{\\log{n}}^{1/3} / \\log{n}^{1/3})$",
    "15.999": "$O(n^{1.5} / \\log{\\log{n}})$",
    "15.9995": "$o(n^{1.5})$",
    "16.01": "$O(n^{1.5} \\log{\\log{n}})$",
    "16.06": "$O(n^{1.5} \\log{n}^{1/2} \\log{\\log{n}}^{1/2})$",
    "16.07": "$O(n^{1.5} \\log{n} / \\log{\\log{n}})$",
    "16.1": "$O(n^{1.5} \\log{n})$",
    "16.2": "$O(n^{1.5} \\log^2{n})$",
    "16.23": "$O(n^{1.5} \\log^3{n})$",
    "16.24": "$O(n^{1.5} \\log^4{n})$",
    "16.27": "$O(n^{\\log{3}})$",
    "16.4": "$O(n^{1.6})$",
    "16.5": "$O(n^{5/3})$",
    "16.9": "$O(n^{11/6} \\log{n})$",
    "17.9": "$O(n^2/\\log^3{n})$",
    "17.99": "$O(n^2/ (\\log^2{n}\\log{\\log{n}}))$",
    "19.9": "$O(n^2/\\log{\\log{n}})$",
    "20.1": "$O(n^2 \\log{\\log{n}})$",
    "21.1": "$O(n^2 \\log{n} \\log{\\log{n}})$",
    "21.5": "$O(n^2 \\log^{3/2}{n})$",
    "25.02": "$O(n^{2 + 2\\epsilon})$",
    "26.1": "$O(n^{2.373} \\log n)$",
    "26.11": "$O(n^{2.376} \\log n)$",
    "26.5": "$O(n^{5/2})$",
    "26.6": "$O(n^{5/2} \\log{n})$",
    "26.7": "$O(n^{1+\\log{3}})$",
    "27.5": "$O(n^{\\log{7}})$",
    "29.2": "$O(n^3 \\log{\\log{n}}^{3/2}/\\log{n}^{5/2})$",
    "29.3": "$O(n^3/\\log{n}^2)$",
    "29.4": "$O(n^3 \\log{\\log{n}}^{1/2}/\\log{n}^{3/2})$",
    "29.45": "$O(n^3/(\\log{n} \\log{\\log{n}}))$",
    "29.5": "$O(n^3/\\log{n})$",
    "29.6": "$O(n^3 \\log{\\log{n}}/\\log{n})$",
    "29.7": "$O(n^3 \\log{\\log{n}}^2/\\log{n})$",
    "29.8": "$O(n^3 \\log{\\log{n}}^{3/2}/\\log{n}^{1/2})$",
    "29.995": "",
    "29.996": "",
    "29.997": "",
    "29.998": "",
    "29.9985": "",
    "29.999": "$o(n^3)$",
    "30.1": "$O(n^3 \\log{\\log{n}})$",
    "30.6": "$O(n^3 \\log{n}^{1/2} \\log{\\log{n}}^{1/2})$",
    "33.7": "$O(n^{1.5+\\log{3}})$",
    "35.3": "$O(n^{3.25} \\log^3{n})$",
    "36.5": "$O(n^{7/2})$",
    "40.1": "$O(n^4 \\log{\\log{n}})$",
    "44.8": "$O(n^{4.5} \\log^3{n})$",
    "55.4": "$O(n^6/ \\log^6{n})$",
    "55.5": "$O(n^6/ \\log^5{n})$",
    "65.3": "$O(n^{6.5} \\log^3{n})$",
    "937.9": "$O(2^{\\sqrt{n} \\log{3}/3} / (\\sqrt{n} \\log{n}))$",
    "938.1": "$O(2^{\\sqrt{n} \\log{3}/3} n)$",
    "941.5": "$O(2^{\\sqrt{n}} n^{1.5})$",
    "951.5": "$O(n^{1.5} 4^{\\sqrt{n}})$",
    "986.1": "$O(2^{n/4} n)$",
    "986.9": "$O(2^{\\log{1.2852}n})$",
    "987.8": "$O(2^{n/2} / n^2)$",
    "987.9": "$O(2^{n/2} / n)$",
    "988.1": "$O(2^{n/2} n)$",
    "988.2": "$O(2^{n/2} n^2)$",
    "1000.5": "-",
    "2070.5": "$O(2^{n(2+\\epsilon)}/n^3)$",
    "2090.5": "$O(2^{n(2+\\epsilon)}/n)$",
    "2091.5": "$O(2^{n(2+\\epsilon)} \\log{n} / n)$",
    "6000.5": "$O(2^{n(6+\\epsilon)})$",
    "7091.5": "$O(2^{n(7+\\epsilon)} \\log{n} / n)$"
}

const chart = ref(null);

const spanData = computed(() => {


    const sortedAlgorithms = props.algorithms.reduce((acc, algorithm) => {
        if (algorithm.spanEncoding && algorithm.year && algorithm.modelEncoding) {
            // if algorithm has multiple model encodings, duplicate the algorithm for each model encoding
            if (algorithm.modelEncoding.includes(";")) {
                const modelEncodings = algorithm.modelEncoding.split(";");
                return [
                    ...acc,
                    ...modelEncodings.map((modelEncoding) => {
                        return {
                            ...algorithm,
                            modelEncoding: modelEncoding.trim(),
                            x: Number(algorithm.year),
                            y: Number(algorithm.spanEncoding),
                        }
                    })
                ]
            }


            return [
                ...acc,
                {
                    ...algorithm,
                    x: Number(algorithm.year),
                    y: Number(algorithm.spanEncoding),
                }
            ]
        }
        return acc
    }, []).sort((a, b) => a.year - b.year);
    // group by modelEncoding
    const models = {}
    sortedAlgorithms.forEach((algorithm) => {
        if (!models[algorithm.modelEncoding]) {
            models[algorithm.modelEncoding] = {
                best: Infinity,
                lowerBound: [],
                others: [],
            }
        }
        if (Number(algorithm.spanEncoding) < models[algorithm.modelEncoding].best) {
            models[algorithm.modelEncoding].best = Number(algorithm.spanEncoding)
            models[algorithm.modelEncoding].lowerBound.push(algorithm)
        } else {
            models[algorithm.modelEncoding].others.push(algorithm)
        }

    })

    return models
});


const workData = computed(() => {
    const sortedAlgorithms = props.algorithms.reduce((acc, algorithm) => {
        if (algorithm.workEncoding && algorithm.year && algorithm.modelEncoding) {
            // if algorithm has multiple model encodings, duplicate the algorithm for each model encoding
            if (algorithm.modelEncoding.includes(";")) {
                const modelEncodings = algorithm.modelEncoding.split(";");
                return [
                    ...acc,
                    ...modelEncodings.map((modelEncoding) => {
                        return {
                            ...algorithm,
                            modelEncoding: modelEncoding.trim(),
                            x: Number(algorithm.year),
                            y: Number(algorithm.workEncoding),
                        }
                    })
                ]
            }


            return [
                ...acc,
                {
                    ...algorithm,
                    x: Number(algorithm.year),
                    y: Number(algorithm.workEncoding),
                }
            ]
        }
        return acc
    }, []).sort((a, b) => a.year - b.year);

    const models = {}
    sortedAlgorithms.forEach((algorithm) => {
        if (!models[algorithm.modelEncoding]) {
            models[algorithm.modelEncoding] = {
                best: Infinity,
                lowerBound: [],
                others: [],
            }
        }
        if (Number(algorithm.workEncoding) < models[algorithm.modelEncoding].best) {
            models[algorithm.modelEncoding].best = Number(algorithm.workEncoding)
            models[algorithm.modelEncoding].lowerBound.push(algorithm)
        } else {
            models[algorithm.modelEncoding].others.push(algorithm)
        }

    })

    return models
});


const spanWorkData = computed(() => {
    const sortedAlgorithms = props.algorithms.reduce((acc, algorithm) => {
        if (algorithm.spanEncoding && algorithm.workEncoding && algorithm.modelEncoding) {
            // if algorithm has multiple model encodings, duplicate the algorithm for each model encoding
            if (algorithm.modelEncoding.includes(";")) {
                const modelEncodings = algorithm.modelEncoding.split(";");
                return [
                    ...acc,
                    ...modelEncodings.map((modelEncoding) => {
                        return {
                            ...algorithm,
                            modelEncoding: modelEncoding.trim(),
                            x: Number(algorithm.spanEncoding),
                            y: Number(algorithm.workEncoding),
                        }
                    })
                ]
            }


            return [
                ...acc,
                {
                    ...algorithm,
                    x: Number(algorithm.spanEncoding),
                    y: Number(algorithm.workEncoding),
                }
            ]
        }
        return acc
    }, []).sort((a, b) => a.spanEncoding - b.spanEncoding);


    const models = {}
    sortedAlgorithms.forEach((algorithm) => {
        if (!models[algorithm.modelEncoding]) {
            models[algorithm.modelEncoding] = {
                best: Infinity,
                lowerBound: [],
                others: [],
            }
        }
        const distance = Math.sqrt(Number(algorithm.spanEncoding) ** 2 + Number(algorithm.workEncoding) ** 2);

        if (distance < models[algorithm.modelEncoding].best) {
            models[algorithm.modelEncoding].best = distance
            models[algorithm.modelEncoding].lowerBound = [algorithm]
        } else if (distance === models[algorithm.modelEncoding].best) {
            models[algorithm.modelEncoding].lowerBound.push(algorithm)
        }



    })

    sortedAlgorithms.forEach((algorithm) => {
        if (models[algorithm.modelEncoding].lowerBound.includes(algorithm)) {
            return
        }
        models[algorithm.modelEncoding].others.push(algorithm)
    })

    return models
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
        gridLineWidth: 1,



    },
    yAxis: {
        title: {
            text: "Time Complexity",
        },


        labels: {
            useHTML: true,
            formatter: function () {
                return $renderMathString(complexityEncodings[this.value])
            }
        }


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
                        <div style="color: ${this.series.color};"  class="font-bold">${this.point.name}</div>
                        <div class="font-bold">${this.point.year}</div>

                    </div><br>`;
                const time = `
                    <div class="">
                        <span style="color: gray; font-size: 11px">Span </span><br>
                        <span class="font-bold">${$renderMathString(
                    this.point.parallelAlgorithmSpanDepth,
                    { mode: "block" }
                )}</span>

                    </div><br>

                    `;
                const space = `
                    <div class="">
                        <span style="color: gray; font-size: 11px">Work</span><br>
                        <span class="font-bold">${$renderMathString(
                    this.point.parallelAlgorithmWork,
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
    series: []
});


const tabs = [
    { name: "Span", current: true },
    { name: "Work", current: false },
    { name: "Span x Work", current: false },
];
const selectedTab = ref("Span");

const chartOptions = computed(() => {
    if (selectedTab.value === "Span") {
        return {
            ...chartOptionsTemplate.value,
            yAxis: {
                ...chartOptionsTemplate.value.yAxis,
                title: {
                    text: "Span",
                },

            },
            series: [...Object.entries(spanData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key]),
                    type: "line",
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    step: true,
                    data: value.lowerBound
                };
            }),
            ...Object.entries(spanData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key], 70, 50, 0.5),
                    type: "scatter",
                    showInLegend: false,
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    step: true,
                    data: value.others
                };
            })
            ]
        }
    } else if (selectedTab.value === "Work") {
        return {
            ...chartOptionsTemplate.value,
            yAxis: {
                ...chartOptionsTemplate.value.yAxis,
                title: {
                    text: "Work",
                },

            },
            series: [...Object.entries(workData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key]),
                    type: "line",
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    step: true,
                    data: value.lowerBound
                };
            }),
            ...Object.entries(workData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key], 70, 50, 0.5),
                    type: "scatter",
                    showInLegend: false,
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    step: true,
                    data: value.others
                };
            })
            ]
        }
    } else if (selectedTab.value === "Span x Work") {
        return {
            ...chartOptionsTemplate.value,
            yAxis: {
                ...chartOptionsTemplate.value.yAxis,
                title: {
                    text: "Work",
                },

            },
            xAxis: {
                ...chartOptionsTemplate.value.xAxis,
                title: {
                    text: "Span",
                },
                labels: {
                    useHTML: true,
                    formatter: function () {
                        return $renderMathString(complexityEncodings[this.value])
                    }
                }
            },
            series: [...Object.entries(spanWorkData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key]),
                    type: "line",
                    marker: {
                        enabled: true,
                        symbol: "circle",
                        radius: 8
                    },
                    step: true,
                    data: value.lowerBound
                };
            }),
            ...Object.entries(spanWorkData.value).map(([key, value], i) => {
                return {
                    name: modelDict[key],
                    color: stringToColor(modelDict[key], 70, 50, 0.2),
                    type: "scatter",
                    showInLegend: false,
                    marker: {
                        enabled: true,
                        symbol: "circle"
                    },
                    step: true,
                    data: value.others
                };
            })
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
                <button @click="() => selectedTab = tab.name" v-for="tab in tabs" :key="tab.name"
                    :class="selectedTab == tab.name ? 'bg-[#4E9BB9] text-white' : 'bg-white text-gray-700'"
                    class="px-3 py-1 text-sm font-medium rounded-md cursor-pointer">
                    {{ tab.name }} </button>

                <button @click="toggleCollapse" :class="['transform transition-transform', { 'rotate-180': collapsed }]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="#898A8D" d="m16.9 13.4l-4.2-4.2c-.4-.4-1-.4-1.4 0l-4.2 4.2c-.4.4-.4 1 0 1.4s1 .4 1.4 0l3.5-3.5l3.5 3.5c.2.2.4.3.7.3c.3 0 .5-.1.7-.3c.4-.4.4-1 0-1.4" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="pt-4">
            <div v-if="chartOptions.series.length === 0" class="text-center text-gray-500 font-semibold">
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
