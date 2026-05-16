const fs = require('fs');
const https = require('https');

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    try {
        if (!fs.existsSync('./dictionaries')) {
            fs.mkdirSync('./dictionaries');
        }

        console.log("Downloading English Full...");
        const enDataFull = await download('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
        const enObj = JSON.parse(enDataFull);
        const enWordsFull = Object.keys(enObj).filter(w => w.length >= 3 && /^[a-z]+$/i.test(w));

        console.log("Downloading English Common...");
        const enDataCommon = await download('https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt');
        const enWordsCommon = enDataCommon.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length >= 3 && /^[a-z]+$/i.test(w));

        fs.writeFileSync('./dictionaries/en.js', 'window.dictEnFull = ' + JSON.stringify(enWordsFull) + ';\nwindow.dictEnCommon = ' + JSON.stringify(enWordsCommon) + ';');
        console.log(`Saved English: ${enWordsFull.length} full, ${enWordsCommon.length} common`);

        console.log("Downloading Vietnamese...");
        const viData1 = await download('https://gist.githubusercontent.com/hieuthi/1f5d80fca871f3642f61f7e3de883f3a/raw/');
        const viData2 = await download('https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet74K.txt');
        
        const viSet1 = new Set(viData1.toLowerCase().split(/[ \n\t]+/).filter(w => w.length >= 3 && /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+$/i.test(w)));
        const viSet2 = new Set(viData2.toLowerCase().split(/[ \n\t]+/).filter(w => w.length >= 3 && /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+$/i.test(w)));
        
        const viWords = [...viSet1].filter(w => viSet2.has(w));
        
        fs.writeFileSync('./dictionaries/vi.js', 'window.dictViFull = ' + JSON.stringify(viWords) + ';\nwindow.dictViCommon = ' + JSON.stringify(viWords) + ';');
        console.log(`Saved Vietnamese: ${viWords.length} words`);
        
        console.log("Done!");
    } catch (err) {
        console.error(err);
    }
}

main();
