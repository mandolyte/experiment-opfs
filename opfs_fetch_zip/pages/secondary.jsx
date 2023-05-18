import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router'
import { AppContext } from "../src/context/AppContext"

export default function Home() {
  const router = useRouter()
  // app context
  const {
    state: {
      zipWorker,
      zipIndex,
    },
    actions: {
    }
  } = useContext(AppContext)

  async function onSecondayPageClick () {
    router.push('/secondary')
  }

  return zipIndex.length > 0 ? <div>
      <p>See console log for timings.</p>
      <ul>
      {
        zipIndex.map( (filename, idx) => {
          return <li key={idx}>{filename}</li>
        })
      }
      </ul>
      <br/>
      <button onClick={onSecondayPageClick}>Go to other page!</button>
    </div>
    :
      <p>Waiting...</p>;
}
