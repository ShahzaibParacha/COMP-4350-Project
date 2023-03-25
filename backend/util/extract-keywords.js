//another strategy: using keybert
const { PythonShell } = require('python-shell');
const path = require('path');

async function extractKeywords(content) {
    const options = {
      scriptPath: 'C:/work/COMP-4350-Project/backend/util/',
      args: [content],
      pythonPath: path.join('C://Users//52252//anaconda3//python'),
      pythonOptions: ['-u'],
      mode: 'text',
      timeout: 5000
    };

    const result = await PythonShell.run('extract-keywords.py', options);
    //console.log(result[0]);
    return result[0]
}

 module.exports = { extractKeywords };