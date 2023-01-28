import { useState, useEffect } from "react"

export default function Login({ uuid, handleSubmit, handleOnChange }) {
    //onSubmit stuff
    return (
        <div>
            <label> Username:
                <input type="text" onChange = {handleOnChange} />
            </label>
            <button onClick={handleSubmit}>Ok</button>
            <div>{uuid}</div>
         </div>
    )
}