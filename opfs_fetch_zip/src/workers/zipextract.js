import JSZip from 'jszip';

async function extractFile(zipFile,fname) {
  // Create a new ZipArchive object.
  const fileContent = await JSZip.loadAsync(zipFile)
    .then( function(zip) {
      return zip.file(fname).async("string");
    }
  );
  return fileContent;
}

async function getFile(zname,fname) {
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle(zname);
  // Get sync access handle
  const accessHandle = await handle.createSyncAccessHandle();

  // Get size of the file.
  const fileSize = accessHandle.getSize();
  // console.log("fileSize:", fileSize)
  // Read file content to a buffer.
  const dataBuffer = new DataView(new ArrayBuffer(fileSize));
  // readBuffer is number of bytes written to buffer (same as fileSize)
  const readBuffer = await accessHandle.read(dataBuffer, { at: 0 });
  const fileContent = await extractFile(dataBuffer.buffer,fname);
  // console.log("zip list:", zlist);
  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  return fileContent;
}


onmessage = (e) => {
  console.log('zipextract/onmessage(): Message received from main script:',e);
  let start = Date.now();
  const zname = e.data[0]
  const fname = e.data[1]
  
  getFile(zname,fname).then( (data) => {
    postMessage(data)
  })
}
