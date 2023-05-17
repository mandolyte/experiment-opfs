import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = React.createContext({});


export default function AppContextProvider({
  children,
}) {
  // const [lines, setLines] = useState("")
  const [zipWorker,setZipWorker] = useState(null)
  // const [query, setQuery] = useState<any>("")
  let needsSetup = true

  useEffect( () => {
    if ( !zipWorker && needsSetup ) {
      needsSetup = false
      const _zipWorker = new Worker(new URL("src/workers/zipworker.js", import.meta.url));
      _zipWorker.onmessage = (e) => {
        console.log('AppContext()/useEffect() _zipWorker.onmessage() Message received from worker:', e);
        if ( e.data === 'file-saved') {
          setZipWorker(_zipWorker);
          console.log('AppContext()/useEffect() file is save to opfs');
        }
      }
    }
  }, []);


  // create the value for the context provider
  const context = {
    state: {
      zipWorker,
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
