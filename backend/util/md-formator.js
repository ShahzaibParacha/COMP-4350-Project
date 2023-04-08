const fs = require('fs');
const marked = require('marked');

const data = fs.readFileSync("./util/sampledata.txt", 'utf8');
const writeStream = fs.createWriteStream('./util/sampledata.md');

const s = data.toString().split('"');
let i = 0;
while (i < s.length) {
    if (s[i].length < 5) {
        s.splice(i, 1);
    }
    console.log(s[i] + "; the line index: " + i);
    if ( s[i] !== undefined) {
       writeStream.write(marked(s[i])); 
    }
    i++;
}
//console.log(markdown); // Outputs: "<p>This is plain text.</p>\n"
//writeStream.write(marked(data));
writeStream.end();