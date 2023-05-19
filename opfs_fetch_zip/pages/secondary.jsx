import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router'
import { AppContext } from "../src/context/AppContext"

export default function Home() {
  const router = useRouter()
  // app context
  const {
    state: {
      fileExtract,
    },
    actions: {
    }
  } = useContext(AppContext)

  async function onSecondayPageClick () {
    router.push('/secondary')
  }

  return fileExtract ? <div>
    <h1>License File from Zip</h1>
      <pre>
      {fileExtract}
      </pre>
      <br/>
      <button onClick={onSecondayPageClick}>Go to other page!</button>
    </div>
    :
      <p>Waiting...</p>;
}
