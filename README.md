# winj
Will Inject
* this is used for embedding file binaries into functions specifically for dcp apps
* injects a file into a workfunction as a string of bytes
* very hacky solution I use for personal projects

Example:
```javascript
const winj = require('winj);

function workFunction () {
  // ...
  const bin = WINJ_EMBED_FILE_AS_BIN('./yourFileOnYourMachine');
  // ...
}

const workFunctionAsAString = await winj.embedFileAsBinary(workFunction);

// ... 
const job = compute.for(data, workFuntionAsAString);
const results = job.exec();
```

TODO
* make this into a more proper node module
* store the binary somewhere in case multiple calls are made to it
