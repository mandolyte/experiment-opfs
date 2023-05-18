async function saveToOpfs(fileURL) {
  // console.log("URL:", fileURL)
  const parts = fileURL.split('/')
  const fname = parts[parts.length-1]
  const root = await navigator.storage.getDirectory();
  console.log("Creating OPFS file:", fname)
  const handle = await root.getFileHandle(fname, { create: true });
  // Get sync access handle
  const accessHandle = await handle.createSyncAccessHandle();
  const startFetch = Date.now()
  const response = await fetch(fileURL, /*{ mode: 'no-cors'}*/);
  const durationFetch = Date.now() - startFetch
  console.log(`Time to fetch file was ${durationFetch}ms`)
  const startOpfsWrite = Date.now()
  const content = await response.blob();
  const bindata = await content.arrayBuffer();
  const dataview = new DataView(bindata);
  const writeBuffer = accessHandle.write(dataview);
  accessHandle.flush();

  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  const durationOpfsWrite = Date.now() - startOpfsWrite
  console.log(`Time to write to OPFS was ${durationOpfsWrite}ms`)
  return fname;
}


onmessage = (e) => {
  console.log('zipworker/onmessage(): Message received from main script:',e);
  // fetch and save the file
  const URL = e.data
  
  saveToOpfs(URL).then( (data) => {
    postMessage(`file-saved ${data}`)
  })
}
