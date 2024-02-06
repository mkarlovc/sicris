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
                // graph.push([node_names[j], node_names[i]]);
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
    const file_path_bib = "./data/bibliography.ldjson"
    const rl1 = readline.createInterface({
        input: fs.createReadStream(file_path_bib),
        crlfDelay: Infinity // To handle Windows line endings
    });
    const bib_map_year = new Map();
    let br = 0;
    rl1.on("line", (line) => {
        const delimit_index = line.indexOf(" ");
        const bib_id = line.substring(0, delimit_index).trim();
        const bib_json = JSON.parse(line.substring(delimit_index + 1));
        bib_map_year.set(bib_id, bib_json.year);
        br += 1;
    });

    rl1.on("close", () => {
        for (const key of bibmap.keys()) {
            const nodes = bibmap.get(key);
            const graph = createCompleteUndirectedGraph(nodes);
            if (graph === null) {
                continue;
            }
            for (const g of graph) {
                const get_year = bib_map_year.get(key);
                const year = get_year !== undefined && !isNaN(get_year) ? parseInt(get_year) : -1;
                if (year != -1 && year < 1000) {
                    year += 2000;
                }
                console.log(g[0], g[1], year);
            }
        }
    });
});
