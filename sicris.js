/* jshint esversion: 9 */
const fs = require('fs');
const apiUrl = 'https://cris.cobiss.net/ecris/si/sl/service/getjwt';
const username = process.env.SICRIS_USERNAME;
const password = process.env.SICRIS_PASSWORD;
const postData = {
    username,
    password
};

const headers = {
  'Content-Type': 'application/json'
};

async function main() {

    async function makePostRequest() {
        try {
            const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData),
            });
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('POST request successful!');
            console.log('Response:', data.jwt);
            return data.jwt;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function makeAuthenticatedGetRequest(url) {
        const api_url = "https://cris.cobiss.net/ecris/si/sl/service" + url;
        try {
            const response = await fetch(api_url, {
                method: 'GET',
                headers: {"Content-Type": "application/json", "Authorization": jwt},
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            // console.log('GET request successful!');
            // console.log('Response:', data.length);
            return data;
        } catch (error) {
            // console.error('Error:', error);
            return null;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // Call the async function
    const jwt = await makePostRequest();
    console.log("jwt: " + jwt);

    url = "/researcher/search?query=&limit=ALL";
    const researchers = await makeAuthenticatedGetRequest(url);
    const write_stream = fs.createWriteStream('researchers.ldjson', { encoding: 'utf8' });
    for (const researcher of researchers) {
        write_stream.write(JSON.stringify(researcher) + '\n');
    }
    write_stream.end();
    write_stream.on('finish', () => {
        console.log('Data has been written to researchers.ldjson');
    });
    write_stream.on('error', (err) => {
        console.error('Error writing to file:', err);
    });

    const write_stream_rb = fs.createWriteStream('researcher_bibliography.csv', { encoding: 'utf8' });
    let counter = 0;
    for (const researcher of researchers) {
        const mstid = researcher.mstid;
        const url_bib = "/biblio/researcher/" + mstid;
        console.log(url_bib);
        const bibliography = await makeAuthenticatedGetRequest(url_bib);
        if (bibliography === null) {
            continue;
        }
        let line = mstid;
        for (const bib of bibliography) {
            line += "," + bib;
        }
        write_stream_rb.write(line + '\n');
        counter += 1;
        console.log(counter + "/" + researchers.length);
        await sleep(100);
    }
    write_stream_rb.end();
    write_stream_rb.on('finish', () => {
        console.log('Data has been written to researcher_bibliography.ldjson');
    });
    write_stream_rb.on('error', (err) => {
        console.error('Error writing to file:', err);
    });

    /*
    const url_bib1 = "/biblio/researcher/44775";
    console.log(url_bib1);
    const bibliography1 = await makeAuthenticatedGetRequest(url_bib1);
    console.log(bibliography1);

    const url_bib2 = "/biblio/researcher/38807";
    console.log(url_bib2);
    const bibliography2 = await makeAuthenticatedGetRequest(url_bib2);
    console.log(bibliography2);
    */
}
main();
