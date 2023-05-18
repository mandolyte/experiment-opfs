async function saveToOpfs(fileURL) {
  // console.log("URL:", fileURL)
  const parts = fileURL.split('/')
  const fname = parts[parts.length-1]
  const root = await navigator.storage.getDirectory();
  console.log("Creating OPFS file:", fname)
  const handle = await root.getFileHandle(fname, { create: true });
  // Get sync access handle
  const accessHandle = await handle.createSyncAccessHandle();
  const response = await fetch(fileURL, /*{ mode: 'no-cors'}*/);
  const content = await response.blob();
  const bindata = await content.arrayBuffer();
  const dataview = new DataView(bindata);
  const writeBuffer = accessHandle.write(dataview);
  accessHandle.flush();

  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  return fname;
}


onmessage = (e) => {
  console.log('zipworker/onmessage(): Message received from main script:',e);
  let start = Date.now();
  // fetch and save the file
  const URL = e.data
  
  saveToOpfs(URL).then( (data) => {
    const timeToFetch = Date.now() - start;
    console.log(`Time to save file ${data} was ${timeToFetch}ms`)
    postMessage(`file-saved ${data}`)
  })
}
