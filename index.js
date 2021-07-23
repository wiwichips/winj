
async function readBinaryIntoString(file) {
  const buf = (require('fs')).readFileSync(file);
  const arr = [...buf];

  let arrStr = "[";
  for (let i = 0; i < arr.length; i++) {
    arrStr = arrStr.concat(`${arr[i]},`);
  }
  arrStr = arrStr.slice(0, -1) + ']';

  return arrStr;
}

exports.embedFilesAsBinary = async function embedFilesAsBinary(code) { 
  // inject the binary into the work function
  let codeString = code.toString().split('WINJ_EMBED_FILE_AS_BIN(');

  for (let i = 1; i < codeString.length; i++) {
    let filename = codeString[i].split(')')[0];
    filename = filename.substring(1, filename.length - 1);
    const arrStr = await readBinaryIntoString(filename);
    codeString[i] = `Buffer.from(${arrStr})` + codeString[i].substring(codeString[i].split(')')[0].length + 1);
  }

  const codeComplete = codeString.join("");
  
  return codeComplete;
}

