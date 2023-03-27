//another strategy: using keybert
const { PythonShell } = require('python-shell');
const path = require('path');
require('dotenv').config();
const pythonPath = process.env.PYTHON_PATH;

async function extractKeywords(content) {
  try{
      const options = {
      scriptPath: __dirname,
      args: [content],
      pythonPath: path.join(pythonPath),
      pythonOptions: ['-u'],
      mode: 'text',
      timeout: 5000
      };

      const result = await PythonShell.run('extract-keywords.py', options);
      console.log("the result is: " + result)
      console.log("keywords are: " + JSON.parse(result[0]));
      return JSON.parse(result[0]);
  }catch(err){
      console.log("keybert error: " + err)
      return null;
  };
}

 module.exports = { extractKeywords };