import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({});


export default function AppContextProvider({
  children,
}) {
  // const [lines, setLines] = useState("")
  const [zipWorker,setZipWorker] = useState(null)
  const [fname,setFname] = useState(null)
  const [zipIndex, setZipIndex] = useState([])
  const [quotas, setQuotas] = useState([])
  // const [query, setQuery] = useState<any>("")
  let needsSetup = true

  // fetch and save the zip file
  // const url = "https://qa.door43.org/unfoldingWord/en_tn/archive/master.zip"
  const url = "https://qa.door43.org/Es-419_gl/es-419_tn/archive/master.zip"
  useEffect( () => {
    if ( !zipWorker && needsSetup ) {
      needsSetup = false
      const _zipWorker = new Worker(new URL("src/workers/zipworker.js", import.meta.url));
      _zipWorker.postMessage(url)
      _zipWorker.onmessage = (e) => {
        console.log('AppContext()/useEffect() _zipWorker.onmessage() Message received from worker:', e);
        if ( e.data.startsWith('file-saved') ) {
          setZipWorker(_zipWorker);
          const _fname = e.data.split(' ')[1]
          setFname(_fname) 
        }
      }
    }
  }, []);

  // get the table of contents from zip file
  useEffect( () => {
    if ( zipWorker ) {
      const _zipIndex = new Worker(new URL("src/workers/zipindex.js", import.meta.url));
      _zipIndex.postMessage(fname)
      _zipIndex.onmessage = (e) => {
        console.log('AppContext()/useEffect() _zipIndex.onmessage() Message received from worker:', e);
        if ( Array.isArray( e.data ) ) {
          setZipIndex(e.data);
        }
      }
    }
  }, [zipWorker]);

  // get quotas
  useEffect( () => {
    async function getStorage() {
      const {usage, quota} = await navigator.storage.estimate();
      setQuotas([usage, quota])
    }
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      getStorage()
    }
  }, []);


  // create the value for the context provider
  const context = {
    state: {
      zipWorker,
      zipIndex,
      quotas,
    },
    actions: {
    }
  };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
