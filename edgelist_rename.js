const readline = require('readline');
const fs = require('fs');

// Specify the path to your file
const filePath = './data/g_rsr_bybib_year_sort.csv';

let line_counter = 0;
let index = 0;
const name_map = new Map();
rl.on('line', (line) => {
    const arr = line.split(" ");
    const n1 = arr[0].trim();
    const n2 = arr[1].trim();
    const year = arr[2].trim();
    let n1index = -1;
    let n2index = -1;
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

    console.log(n1index, n2index, year);

});

// Event listener for when the file is fully read
rl.on('close', () => {

});
