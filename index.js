
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

exports.embedFilesAsBinary = async function embedFilesAsBinary(workFunction) { 
  // inject the binary into the work function
  let workFunctionString = workFunction.toString().split('WINJ_EMBED_FILE_AS_BIN(');
  for (let i = 1; i < workFunctionString.length; i++) {
    if (i === workFunctionString.length - 1) debugger;
    let filename = workFunctionString[i].split(')')[0];
    filename = filename.substring(1, filename.length - 1);
    const arrStr = await readBinaryIntoString(filename);
    workFunctionString[i] = `Buffer.from(${arrStr})` + workFunctionString[i].substring(workFunctionString[i].split(')')[0].length + 1);
  }

  const workFun = workFunctionString.join("");
  
  return workFun;
}

