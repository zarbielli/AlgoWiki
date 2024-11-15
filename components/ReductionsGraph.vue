<!-- TODO: make graph an isolated component to be reused -->
<script setup>
const { $renderMathString } = useNuxtApp();
import cytoscape from "cytoscape";
import cytoscapeCoseBilkent from "cytoscape-cose-bilkent";
import svg from "~/utils/cytoscapeSvg.ts";
import Layers from "cytoscape-layers";
import popper from 'cytoscape-popper';


cytoscape.use(popper);

cytoscape.use(cytoscapeCoseBilkent);

const props = defineProps({
  reductions: {
    type: Array,
    required: true,
  },
});
console.log(props.reductions.map(x => x.fromVariation));
function breakLine(text) {
  var words = text.split(" ");
  var lines = [];
  var line = "";
  words.forEach((word) => {
    if (line.length + word.length > 15) {
      lines.push(line);
      line = "";
    }
    line += word + " ";
  });
  lines.push(line);
  return $renderMathString(lines.join(""))
}

const NODES = [
  ...new Set([
    ...props.reductions.map((x) => x.fromVariation),
    ...props.reductions.map((x) => x.toVariation),
  ]),
].map((x) => {
  return { data: { id: x.trim(), label:  $renderMathString(x) }, classes: "center-center" };
});

const EDGES = props.reductions.map((x) => {
  return {
    data: {
      id: x.fromVariation + x.toVariation,
      lowerBound: x.impliedLowerBoundPower,
      source: x.fromVariation.trim(),
      target: x.toVariation.trim(),
    },
  };
});

const cyContainer = ref(null);
let cy = null;

// add parent to every node in a scc with more than one node
const groupSCCs = ref(false);
let layout = null;
onMounted(() => {
  cytoscape.use(Layers);

  cy = cytoscape({
    container: document.getElementById("cyContainer"), // container to render in

    elements: [
      // deepclone to avoid mutating the original data
      ...JSON.parse(JSON.stringify(NODES)),
      ...JSON.parse(JSON.stringify(EDGES)),
    ],

    style: [
      {
        selector: ".center-center",
        style: {
          "text-valign": "center",
          "text-halign": "center",
          color: "#000",
        },
      },
      {
        selector: "node",
        style: {
          shape: "round-rectangle",
          "text-wrap": "wrap",
          "background-color": "#F1F5F9",
        //   label: "data(label)",
          width: 160,
          height: 85,
          "border-width": 1,
          "border-color": "#333",
        },
      },

      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#aaa",
          "target-arrow-color": "#aaa",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
        },
      },
      {
        selector: ".nodes-groups",
        style: {
          "background-color": "data(color)",
        },
      },
      {
        selector: ".highlighted-ancestors",
        style: {
          "background-color": "#ED6571",
          "line-color": "#ED6571",
          "target-arrow-color": "#ED6571",
        },
      },
      {
        selector: ".highlighted-decentants",
        style: {
          "background-color": "#4E9BB9",
          "line-color": "#4E9BB9",
          "target-arrow-color": "#4E9BB9",
        },
      },
      {
        selector: ".highlighted-root-ancestors",
        style: {
          "background-color": "#F1F5F9",
          "line-color": "#ED6571",
          "target-arrow-color": "#ED6571",
          "border-width": 3,
          "border-color": "#ED6571",
        },
      },
      {
        selector: ".highlighted-root-decentants",
        style: {
          "background-color": "#F1F5F9",
          "line-color": "#4E9BB9",
          "target-arrow-color": "#4E9BB9",
          "border-width": 3,
          "border-color": "#4E9BB9",
        },
      },
    ],
  });

  cy.minZoom(0.1);
  cy.maxZoom(2.5);
  const layers = cy.layers();
  layers.renderPerNode(layers.append('html'), (elem, node) => {

  elem.innerHTML = node.data('label');
//   center
  elem.style.width = '160px';
  elem.style.height = '85px';
  elem.style.display = 'flex';
  elem.style.justifyContent = 'center';
  elem.style.alignItems = 'center';
  elem.style.textAlign = 'center';
  
  elem.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  elem.style.fontFamily = 'Arial, sans-serif';
  elem.style.fontSize = '14px';
  elem.style.color = '#333';
  elem.style.textAlign = 'center';
  elem.style.textTransform = 'capitalize';
  elem.style.textDecoration = 'none';
  elem.style.lineHeight = '1.5';
  elem.style.overflow = 'hidden';
  elem.style.textOverflow = 'ellipsis';
  elem.style.whiteSpace = 'nowrap';
  elem.style.wordWrap = 'break-word';
  elem.style.wordBreak = 'break-word';
  elem.style.hyphens = 'auto';
  elem.style.wordWrap = 'break-word';
  elem.style.wordBreak = 'break-word';
  elem.style.hyphens = 'auto';
  elem.style.textAlign = 'center';
  elem.style.textTransform = 'capitalize';
  elem.style.textDecoration = 'none';
  elem.style.lineHeight = '1.5';
  elem.style.overflow = 'hidden';
  elem.style.textOverflow = 'ellipsis';
  elem.style.whiteSpace = 'nowrap';
  elem.style.wordWrap = 'break-word';
  elem.style.wordBreak = 'break-word';
  elem.style.hyphens = 'auto';
  elem.style.wordWrap = 'break-word';
  elem.style.wordBreak = 'break-word';
  elem.style.hyphens = 'auto';
  elem.style.textAlign = 'center';
  elem.style.textTransform = 'capitalize';
  elem.style.textDecoration = 'none';
  elem.style.lineHeight = '1.5';
  elem.style.overflow = 'hidden';
  elem.style.textOverflow = 'ellipsis';
  elem.style.whiteSpace = 'wrap';
  elem.style.wordWrap = 'break-word';
  elem.style.wordBreak = 'break-word';
  elem.style.hyphens = 'auto';
  
});

  layout = cy.layout({
    name: "cose-bilkent",
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
    randomize: true,
    padding: 50,
    componentSpacing: 160,
    nodeRepulsion: 9500,
    nodeDimensionsIncludeLabels: true,
    idealEdgeLength: 250,
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
  });
  layout.run();

  // Listen for node click events
  cy.on("click", "node", function (event) {
    var node = event.target;
    if (node.hasClass("highlighted-root-ancestors")) {
      highlightDescendants(node);
    } else {
      highlightAncestors(node);
    }
  });

  // on click outside a node remove all highlights
  cy.on("click", function (event) {
    var target = event.target;
    if (target === cy) {
      cy.elements().removeClass("highlighted-ancestors");
      cy.elements().removeClass("highlighted-decentants");
      cy.elements().removeClass("highlighted-root-ancestors");
      cy.elements().removeClass("highlighted-root-decentants");
    }
  });
  let popper = null;

  cy.on("mouseover", "node", function (event) {

    let node = event.target;
    const edgesTo = node.incomers();
    const lowerBound = edgesTo[0]?.data().lowerBound;
    if (popper) {
      popper.destroy();
    }


    popper = node.popper({
      content: () => {
        let div = document.createElement('div');
        if (lowerBound)
          div.innerHTML = `
          <div class="reductions-popper-element bg-white shadow-md rounded-md p-2">
            <p class="text-xs text-gray-500">Implied Lower Bound</p>
            <p class="text-base font-medium text-gray-500">n<sup>${lowerBound}<sup></p>
          </div>
        `;
        else
          div.innerHTML = `
          <div class="reductions-popper-element bg-white shadow-md rounded-md p-2">
            <p class="text-xs text-gray-500">Implied Lower Bound</p>
            <p class="text-base font-medium text-gray-500">not available</p>
          </div>
        `;
        document.body.appendChild(div);

        return div;
      }
    });
  })

  cy.on("mouseout", "node", function (event) {
    if (popper) {
      const popperElements = document.getElementsByClassName('reductions-popper-element');
      for (let i = 0; i < popperElements.length; i++) {
        popperElements[i].remove();
      }
      popper.destroy();
    }
  })




});

function toogleGroupSCCs() {
  groupSCCs.value = !groupSCCs.value;
  const sccs = cy
    .elements()
    .tarjanStronglyConnectedComponents()
    .components.filter((x) => x.length > 1)
    .map((x) => x.filter((y) => y.isNode()));
  if (groupSCCs.value) {
    const groups = sccs.map((scc, idx) => {
      cy.add({
        data: {
          id: `SCC_${idx}`,
          color: "#F1F5F9",
          label: "",
        },
        classes: "nodes-groups",
      });
      scc.forEach((n) => {
        // add parent
        const t = n.move({ parent: `SCC_${idx}` });
        // edges to node to parent
        const cedges = n.connectedEdges();
        cedges.forEach((e) => {
          if (scc.includes(e.source()) && scc.includes(e.target())) return;
          if (e.source().id() === n.id()) e.move({ source: `SCC_${idx}` });
          if (e.target().id() === n.id()) e.move({ target: `SCC_${idx}` });
        });
        // remove duplicated edges
      });
      const edges = cy.elements("edge");
      const edgesMap = {};
      edges.forEach((e) => {
        const key = `${e.source().id()}-${e.target().id()}`;
        if (edgesMap[key]) {
          e.remove();
        } else {
          edgesMap[key] = true;
        }
      });
    });
  } else {
    // cy.remove(cy.elements());
    cy.json({
      elements: [
        ...JSON.parse(JSON.stringify(NODES)),
        ...JSON.parse(JSON.stringify(EDGES)),
      ],
    });
  }
  const layout = cy.layout({
    name: "cose-bilkent",
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
    randomize: true,
    padding: 50,
    componentSpacing: 160,
    nodeRepulsion: 9500,
    nodeDimensionsIncludeLabels: true,
    idealEdgeLength: 250,
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
  });
  layout.run();
}

function highlightDescendants(node) {
  // Clear existing highlights
  cy.elements().removeClass("highlighted-ancestors");
  cy.elements().removeClass("highlighted-decentants");
  cy.elements().removeClass("highlighted-root-ancestors");
  cy.elements().removeClass("highlighted-root-decentants");

  // Traverse through all descendants of the clicked node
  node.addClass("highlighted-root-decentants");

  if (groupSCCs.value) {
    // if the node is in a group highlith the descendants of the group
    const parent = node.parent();
    if (parent) {
      parent.successors(function (descendant) {
        // if the descendant is a group, highlight the nodes in the group
        if (descendant.hasClass("nodes-groups")) {
          descendant.children().forEach((n) => {
            n.addClass("highlighted-decentants");
            const edges = n.connectedEdges();
            edges.forEach((e) => {
              e.addClass("highlighted-decentants");
            });
          });

        } else {
          // Add a class to highlight the descendant nodes
          descendant.addClass("highlighted-decentants");
        }
      });
    }
  }

  node.successors(function (descendant) {
    // if the descendant is a group, highlight the nodes in the group
    if (descendant.hasClass("nodes-groups")) {
      descendant.children().forEach((n) => {
        n.addClass("highlighted-decentants");
        const edges = n.connectedEdges();
        edges.forEach((e) => {
          e.addClass("highlighted-decentants");
        });
      });
    } else {
      // Add a class to highlight the descendant nodes
      descendant.addClass("highlighted-decentants");
    }
  });
}

function highlightAncestors(node) {
  // Clear existing highlights
  cy.elements().removeClass("highlighted-ancestors");
  cy.elements().removeClass("highlighted-decentants");
  cy.elements().removeClass("highlighted-root-ancestors");
  cy.elements().removeClass("highlighted-root-decentants");
  // Traverse through all ancestors of the clicked node
  node.addClass("highlighted-root-ancestors");

  if (groupSCCs.value) {
    // if the node is in a group highlith the ancestors of the group
    const parent = node.parent();
    if (parent) {
      parent.predecessors(function (ancestor) {
        // if the ancestor is a group, highlight the nodes in the group
        if (ancestor.hasClass("nodes-groups")) {
          ancestor.children().forEach((n) => {
            n.addClass("highlighted-ancestors");
            const edges = n.connectedEdges();
            edges.forEach((e) => {
              e.addClass("highlighted-ancestors");
            });
          });


        } else {
          // Add a class to highlight the ancestor nodes
          ancestor.addClass("highlighted-ancestors");
        }
      });
    }
  }

  node.predecessors(function (ancestor) {
    if (ancestor.hasClass("nodes-groups")) {
      ancestor.children().forEach((n) => {
        n.addClass("highlighted-ancestors");
        const edges = n.connectedEdges();
        edges.forEach((e) => {
          e.addClass("highlighted-ancestors");
        });
      });
    } else {
      // Add a class to highlight the ancestor nodes
      ancestor.addClass("highlighted-ancestors");
    }
  });
}

function exportPng() {
  var png64 = cy.png({ scale: 2, full: true });
  var a = document.createElement("a");
  a.href = png64;
  a.download = "graph.png";
  a.click();
}

function exportSvg() {

  var svgContent = svg({ scale: 1, full: true }, cy);
  var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  var blobUrl = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.href = blobUrl;
  a.download = "demo.svg";
  a.click();
}

const searchString = ref("");

const filteredReductions = computed(() => {
  const searchWords = searchString.value.split(' ');
  return props.reductions.value.filter(entry => {


    // Check for the presence of each search word in the entry's relevant fields
    return searchWords.every(word =>
    (entry.fromFamily.toLowerCase().includes(word.toLowerCase()) ||
      entry.fromVariation.toLowerCase().includes(word.toLowerCase()) ||
      entry.toFamily.toLowerCase().includes(word.toLowerCase()) ||
      entry.toVariation.toLowerCase().includes(word.toLowerCase()))
    );
  });
});
</script>

<template>

    <section class="max-w-7xl mx-auto py-8 px-2">
      <div class="flex items-center gap-8 mt-8">
        <p><span class="w-4 h-4 inline-block bg-[#ED6571]"></span> Ancestors</p>
        <p>
          <span class="w-4 h-4 inline-block bg-[#4E9BB9]"></span> Descendants
        </p>
        <div class="flex flex-wrap gap-4 text-sm">
          <button class="bg-slate-100 px-4 py-2 rounded-lg shadow-sm"
            :class="{ 'ring-2 ring-[#4E9BB9] shadow-lg': groupSCCs }" @click="toogleGroupSCCs">
            Group SCCs
          </button>
          <button class="bg-slate-100 px-4 py-2 rounded-lg shadow-sm" @click="exportPng">
            Export PNG
          </button>
          <button class="bg-slate-100 px-4 py-2 rounded-lg shadow-sm" @click="exportSvg">
            Export SVG
          </button>
        </div>
      </div>
      <div class="w-full h-[48rem] border mt-8">
        <div ref="cyContainer" id="cyContainer"></div>
      </div>
    </section>
</template>

<style>
#cyContainer {
  width: 100%;
  height: 100%;
}
</style>
