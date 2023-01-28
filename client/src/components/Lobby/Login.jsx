import { useState, useEffect } from "react"
import { postUser } from "../../features/api"

export default function Login({ uuid }) {
    const [username, setUsername] = useState([])

    const handleSubmit = () =>
    {
        let newPlayer = {
            uuid: uuid,
            username: username
        };
        console.log(newPlayer);
        postUser(newPlayer);
    };


    //onSubmit stuff
    return (
        <div>
            <label> Username:
                <input type="text" onChange = {(e)=>setUsername(e.target.value)} name = "name" />
            </label>
            <button onClick={handleSubmit}>Ok</button>
         </div>
    )
}