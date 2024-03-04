const readline = require('readline');
const fs = require('fs');

const file_path = './data/g_rsr_bybib_year_sort.csv';
const rl = readline.createInterface({
  input: fs.createReadStream(file_path),
  crlfDelay: Infinity // To handle Windows line endings
});

// Specify the path to your file

let line_counter = 0;
let index = 0;
const name_map = new Map();

const write_stream_renamed = fs.createWriteStream(
"graph_zero_index.csv", { encoding: 'utf8' }
);

console.log("process graph to zero index");
rl.on('line', (line) => {
    const arr = line.split(" ");
    const n1 = arr[0].trim();
    const n2 = arr[1].trim();
    const year = arr[2].trim();
    let n1index = -2;
    let n2index = -2;
    if (!name_map.has(n1)) {
        name_map.set(n1, index);
        n1index = index;
        index += 1;
    } else {
        n1index = name_map.get(n1);
    }

    if (!name_map.has(n2)) {
        name_map.set(n2, index);
        n2index = index;
        index += 1;
    } else {
        n2index = name_map.get(n2);
    }

    write_stream_renamed.write(n1index + "," + n2index + "," + year + "\n");
    line_counter += 1;
    if (line_counter % 1000000 == 0) {
        console.log(line_counter);
    }
});

// Event listener for when the file is fully read
rl.on('close', () => {
    console.log("writing mappings");
    const write_stream_mapping = fs.createWriteStream(
        "nodeid_mapping.csv", { encoding: 'utf8' }
    );
    let counter = 0;
    for (const mstid of name_map.keys()) {
        const index = name_map.get(mstid);
        write_stream_mapping.write(mstid + "," + index + "\n");
    }
    write_stream_mapping.end();
});
