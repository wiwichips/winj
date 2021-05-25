#!/usr/bin/env node

const winj = require('./index.js');
const SCHEDULER_URL = new URL('https://scheduler.distributed.computer');

async function main2() {
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');

  // work function
  function myWorkFun(input) {
    async function inner() {
      const mod =  await WebAssembly.instantiate(WINJ_EMBED_FILE_AS_BIN('./fib.wasm'));
      const { fib } = mod.instance.exports;
      return fib(input);
    }
    
    progress(0);
    inner(input).then((input) => { 
      progress(1);
      return input;
    });
  }

  // replace all instances of "WINJ_EMBED_FILE_AS_BIN('./fib.wasm')" with a string containing the bytes
  const workFun = await winj.embedFilesAsBinary(myWorkFun);

  // printing for debug reasons
  console.log(workFun);

  const job = compute.for([10, 5, 20], workFun);
  //  eval(`(${workFun}) (10)`);

  const ks = await wallet.get();
  job.setPaymentAccountKeystore(ks);

  // get results
  debugger
  const result = await job.localExec();
  console.log('results=', Array.from(results));
}

//main().then();
async function main() {
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');

  const job = compute.for(
    ['red', 'green', 'yellow', 'blue', 'brown', 'orange', 'pink'],
    (colour) => {
      progress(1);
      return colour.toUpperCase();
    },
  );

  const ks = await wallet.get();
  job.setPaymentAccountKeystore(ks);
  const results = await job.exec(compute.marketValue);
  console.log('results=', Array.from(results));
}

/* Initialize DCP Client and run main() */
require('dcp-client')
  .init(SCHEDULER_URL)
  .then(main)
  .catch(console.error)
  .finally(process.exit);

