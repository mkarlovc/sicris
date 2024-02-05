/* jshint esversion: 11 */
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');

const filePath = './data/researcher_bibliography.csv';
const fileStream = fs.createReadStream(filePath);
const outputFilePath = './data/bib1.ldjson';
fs.writeFileSync(outputFilePath, '');

async function getHtmlContent(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching HTML content:', error.message);
      throw error;
    }
}

function appendLDJSONFile(filePath, jsonObject) {
    const outputStream = fs.createWriteStream(filePath, { flags: 'a' });
    outputStream.write(jsonObject.id + " " + JSON.stringify(jsonObject) + '\n');
    outputStream.end();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayedForLoop(bibs) {
    let counter = 0;
    for (const cobissid of bibs) {
        await sleep(100);
        counter += 1;
        if (counter%100 == 0) {
            console.log(counter + "/" + bibs.size);
        }

        const url = 'https://plus.cobiss.net/cobiss/si/sl/bib/' + cobissid;
        getHtmlContent(url)
        .then(htmlContent => {
            const $ = cheerio.load(htmlContent);
            const title = $("div.recordTitle").html();
            const regex1 = new RegExp("ve?~M", 'g');
            const regex2 = new RegExp("...".replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            const summary = $("div.summary")
                .text().replace(regex1, '').replace(regex2, '')
                .trim().replace(/\s+/g, ' ');
            const divs = $("div.recordPrompt");
            let year = "";
            divs.each((index, element) => {
                const innerHtml = $(element).html();
                if (innerHtml.includes("Leto") || innerHtml.includes("in izdelava")) {
                    year = parseInt(innerHtml.trim().slice(-4), 10).toString() ?? "";
                }
            });
            const obj = {id: cobissid, title, year, summary};
            appendLDJSONFile(outputFilePath, obj);
        })
        .catch(error => {
            console.log(error);
        });
    }
}
// Create a readline interface
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // To recognize both UNIX and Windows line endings
});

// Event listener for each line read from the file
const bibs = new Set();
rl.on('line', (line) => {
    line = line.split(",");
    for (let i = 1; i < line.length; i++) {
        bibs.add(line[i].trim());
    }

});

rl.on('close', () => {
    console.log('File reading complete.');
    delayedForLoop(bibs);
});
