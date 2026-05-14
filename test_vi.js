const https = require('https');

https.get('https://raw.githubusercontent.com/duyet/vietnamese-wordlist/master/Viet74K.txt', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        const words = data.toLowerCase().split(/[ \n\t]+/);
        const validSyllables = new Set(words.filter(w => w.length >= 3 && /^[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+$/i.test(w)));
        console.log('Total valid syllables:', validSyllables.size);
        console.log('Has "thủy":', validSyllables.has('thủy'));
        console.log('Has "hải":', validSyllables.has('hải'));
        console.log('Has "age":', validSyllables.has('age'));
        console.log('Has "poọ":', validSyllables.has('poọ'));
        console.log('Has "game":', validSyllables.has('game'));
    });
});
