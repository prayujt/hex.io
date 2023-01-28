import { useState, useEffect } from "react"
import {v4 as uuidv4} from 'uuid'
import { postUser } from "../../features/api"

export default function Login() {
    const [name, setName] = useState([])
    
    let uuid = uuidv4()

    //add input for this
    let newPlayer = {
        uuid: uuid,
        username: "Michael"
    }


    return (
        <>
            <h1>Enter User name</h1>
            <input type="text" />
            <button onClick={() => postUser(newPlayer)}>Ok</button>
            <div>{uuid}</div>
        </>
    )
}