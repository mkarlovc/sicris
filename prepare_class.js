/* jshint esversion: 11 */
const readline = require('readline');
const fs = require('fs');

const file_path = './data/researchers.ldjson';
const rl = readline.createInterface({
  input: fs.createReadStream(file_path),
  crlfDelay: Infinity // To handle Windows line endings
});

console.log("process graph to zero index");
const feature_map = new Map();
rl.on('line', (line) => {
    const rsr = JSON.parse(line.trim());
    const mstid = rsr.mstid.trim();
    const features =
        parseInt(rsr.science, 10) + "," + parseInt(rsr.field, 10) + "," + parseInt(rsr.subfield, 10);
    feature_map.set(mstid, features);
});

// Event listener for when the file is fully read
rl.on('close', () => {
    const file_path1 = './data/nodeid_mapping.csv';
    const rl1 = readline.createInterface({
        input: fs.createReadStream(file_path1),
        crlfDelay: Infinity // To handle Windows line endings
    });
    console.log("reading mappings");
    const id_map = new Map();
    rl1.on('line', (line) => {
        const [mstid, index] = line.split(",");
        console.log(mstid + " " + index);
        id_map.set(mstid.trim(), index.trim());
    });

    rl1.on('close', () => {
        const write_stream_class = fs.createWriteStream(
            "index_class.csv", { encoding: 'utf8' }
        );
        for (const mstid of feature_map.keys()) {
            const index = id_map.get(mstid);
            const features = feature_map.get(mstid);
            write_stream_class.write(mstid + "," + index + "," + features + "\n");
        }
        write_stream_class.end();
    });

});
