# opfs_fetch_zip

This demo shows:

- fetching of a zip file at startup
- writing the zip file to OPFS
- getting a list of files in the zip
- displaying the list

The web worker scripts are in the folder `src/workers`.

- zipworker.js: fetches and writes the file to OPFS
- zipindex.js: reads the zip for the table of contents

The main web page is `pages/index.jsx` 
and it will show the list of files in the zip file

The other page is `pages/secondary.jsx` 
and it will show the content of the license markdown file.

The state is managed in `src/context/AppContext.js`.
