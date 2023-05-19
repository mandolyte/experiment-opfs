import JSZip, { file, files } from 'jszip';

async function readZipTOC(zipFile) {
  // Create a new ZipArchive object.
  const toc = await JSZip.loadAsync(zipFile)
    .then( function(zip) {
    // Get the list of files in the zip archive.
    const files = Object.keys(zip.files);
    return files
    }
  );
  return toc;
}

async function getIndex(fname) {
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle(fname);
  // Get sync access handle
  const accessHandle = await handle.createSyncAccessHandle();

  // Get size of the file.
  const fileSize = accessHandle.getSize();
  // console.log("fileSize:", fileSize)
  // Read file content to a buffer.
  const dataBuffer = new DataView(new ArrayBuffer(fileSize));
  // readBuffer is number of bytes written to buffer (same as fileSize)
  const readBuffer = await accessHandle.read(dataBuffer, { at: 0 });
  const zlist = await readZipTOC(dataBuffer.buffer);
  // console.log("zip list:", zlist);
  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  return zlist
}


onmessage = (e) => {
  console.log('zipindex/onmessage(): Message received from main script:',e);
  let start = Date.now();
  const fname = e.data
  
  getIndex(fname).then( (data) => {
    postMessage(data)
  })
}
