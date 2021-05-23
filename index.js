#!/usr/bin/env node

let winj = {};

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

winj.embedFilesAsBinary = async function embedFilesAsBinary(workFunction) { 
  // inject the wasm module into the work function
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

// ------------------------------------------------------------------

async function main() {
  function myWorkFun(input) {
    async function inner() {
      const mod =  await WebAssembly.instantiate(WINJ_EMBED_FILE_AS_BIN('./fib.wasm'));
      const { fib } = mod.instance.exports;
      return fib(input);
    }
    inner(input).then((input) => console.log(input));
  }

  const workFun = await winj.embedFilesAsBinary(myWorkFun);
  console.log(workFun);
  eval(`(${workFun}) (10)`);
}

main().then();
