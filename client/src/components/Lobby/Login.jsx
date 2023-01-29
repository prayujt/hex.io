import { Button, TextField } from "@mui/material";

export default function Login({ uuid, handleSubmit, handleOnChange }) {
    return (
        <center>
            <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                onChange={handleOnChange}
            />
            <Button onClick={handleSubmit} variant="outlined" size="large">
                Join Game
            </Button>
        </center>
    );
}
