#! /usr/bin/env node

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

winj.instantiate = async function injectWasmModule(workFunction) { 
  // inject the wasm module into the work function
  //   -- this can work with multiple modules and usert can specify how it works
  //   -- this is cool!
  // 1. find the winjFile call -- throw error if not exist
  
  
  // 2. extract the string location of the wasm module


  // 3. load the wasm module into a buffer -- throw error if enoent


  // 4. reaplce the winj function call with that module


  // old code --- delete later
  const arrStr = await readBinaryIntoString('./fib.wasm');

  const workFunction1 = `
    const doWasm = () => { 
      async function thing() {
        const buffer = Buffer.from(${arrStr});
        let res = await WebAssembly.instantiate(buffer);
        const { fib } = res.instance.exports;
        console.log(fib(10));
      }
      thing().then()
    }; 
    doWasm();
  `;

  eval(workFunction1);

  const newBuffer = Buffer.from(arrStr);
}

// ------------------------------------------------------------------

async function main() {
  function myWorkFun(input) {
    winjInstantiate('./fib.wasm');
  }

  console.log(myWorkFun.toString());

  await winj.instantiate(myWorkFun);

  console.log(myWorkFun.toString());

  //eval(testStr + ' test(' + input + ')');
}

main().then();
