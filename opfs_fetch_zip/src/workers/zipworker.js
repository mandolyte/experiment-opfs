import JSZip from 'jszip';

async function readZipTOC(zipFile) {
  // Create a new ZipArchive object.
  const toc = await JSZip.loadAsync(zipFile)
    .then( function(zip) {
    // Get the list of files in the zip archive.
    const files = Object.keys(zip.files);
    console.log("files:", files);
    return files
    }
  );
  return toc;
}

async function saveToOpfs(fileURL) {
  console.log("URL:", fileURL)
  const parts = fileURL.split('/')
  const fname = parts[parts.length-1]
  const root = await navigator.storage.getDirectory();
  console.log("Creating OPFS file:", fname)
  const handle = await root.getFileHandle(fname, { create: true });
  // Get sync access handle
  const accessHandle = await handle.createSyncAccessHandle();
  const response = await fetch(fileURL, /*{ mode: 'no-cors'}*/);
  console.log("fetch response:", response)
  const content = await response.blob();
  const bindata = await content.arrayBuffer();
  const dataview = new DataView(bindata);
  const writeBuffer = accessHandle.write(dataview);
  accessHandle.flush();

  const zlist = await readZipTOC(bindata);
  console.log("zip list:", zlist);
  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  return true
}

let start = Date.now();
// fetch and save the file
// const URL = "https://raw.githubusercontent.com/mandolyte/sqlitenext/master/opfs_fetch_db/an-opfs-sqlite.db"
// const URL = "https://github.com/mandolyte/experiment-opfs/archive/refs/heads/main.zip"
const URL = "https://qa.door43.org/Es-419_gl/es-419_tn/archive/master.zip"
// const URL = "https://qa.door43.org/Es-419_gl/es-419_tn/raw/branch/master/LICENSE.md"

saveToOpfs(URL).then( (data) => {
  
  const timeToFetchDump = Date.now() - start;
  console.log(`Time to save file ${timeToFetchDump}ms`)
  
  postMessage("file-saved")
    
  return data
})

onmessage = (e) => {
  // console.log('onmessage(): Message received from main script:',e);
}