import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router'
import { AppContext } from "../src/context/AppContext"

export default function Home() {
  const router = useRouter()
  // app context
  const {
    state: {
      dbWorker,
    }, 
    actions: {

    }
  } = useContext(AppContext)


  const [lines, setLines] = useState("")
  const [query, setQuery] = useState("")

  async function onSecondayPageClick () {
    router.push('/secondary')
  }

  useEffect( () => {

    if (dbWorker && query && query !== "") {
      // console.log("Posting a message")
      dbWorker.postMessage(query)
    }
  
  }, [dbWorker, query])

  useEffect( () => {
    if (dbWorker) {
      dbWorker.onmessage = (e) => {
        let msg = "";
        if ( typeof e.data === 'object' ) {
          msg = e.data.message; // + "\n" + e.data.stack;
        } else {
          msg = e.data
        }
        setLines(msg);
        // console.log('dbWorker.onmessage() Message received from worker:', e);
      }
    }
  }, [dbWorker])

  return (<div>
      <h1>Fetch DB and Write to OPFS</h1>
      
      <p>See console log for timings.</p>
      
      <p>Try these two queries:</p>
      <pre>
      select * from sqlite_schema;<br/>
      select count(*) from twl;<br/>
      select * from twl limit 4;<br/>
      select * from pragma_table_info('twl');
      </pre>
      <br/>
      <textarea rows="5" cols="40" onInput={
        (e) => {
          // console.log((e.target).value)
          setQuery((e.target).value)
        }
      }/>
      <pre>{lines}</pre>
      <button onClick={onSecondayPageClick}>Go to other page!</button>
    </div>
  );
}
