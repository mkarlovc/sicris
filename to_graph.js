const readline = require('readline');
const fs = require('fs');

// Specify the path to your file
const filePath = './data/researcher_bibliography.csv';

// Create a readline interface
const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity // To handle Windows line endings
});

function createCompleteUndirectedGraph(node_names) {
    const graph = [];
    // Validate input
    if (!Array.isArray(node_names) || node_names.length < 2) {
        return null;
    }
    // Create edges between all pairs of nodes
    for (let i = 0; i < node_names.length; i++) {
        for (let j = i + 1; j < node_names.length; j++) {
            // Avoid self-edges
            if (i !== j) {
                graph.push([node_names[i], node_names[j]]);
                graph.push([node_names[j], node_names[i]]);
            }
        }
    }
    return graph;
}

let line_counter = 0;
const bibmap = new Map();
rl.on('line', (line) => {
    // Process each line here
    const arr = line.split(",");
    const rsr = arr[0];
    let counter = 0;
    for (const a of arr) {
        if (counter == 0) {
            counter += 1;
            continue;
        }
        const bib = bibmap.get(a);
        if (bib === undefined) {
            bibmap.set(a, [rsr]);
        } else {
            bib.push(rsr);
            bibmap.set(a, bib)
        }
        counter += 1;
    }
    line_counter += 1;
});

// Event listener for when the file is fully read
rl.on('close', () => {
    for (const key of bibmap.keys()) {
        const nodes = bibmap.get(key);
        const graph = createCompleteUndirectedGraph(nodes);
        if (graph === null) {
            continue;
        }
        for (const g of graph) {
            console.log(g[0], g[1]);
        }
    }
});
