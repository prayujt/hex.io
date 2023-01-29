import { List, ListItem, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchColors } from "../../features/api";

const Names = () => {
    const [colors, setColors] = useState([]);

    // let playerColors = await fetchColors();
    // playerColors = await playerColors.json();
    // setColors(playerColors);

    const getColors = async () => {
        let playerColors = await fetchColors();
        console.log(playerColors);
        colors === null ? setColors(null) : setColors(playerColors);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            getColors();
        }, 250);
        return () => clearTimeout(timer);
    });

    let temp = [];
    colors.map((color) => {
        temp.push(
            <ListItem disablePadding>
                <ListItemText
                    primary={color["Username"]}
                    secondary={color["Color"]}
                />
            </ListItem>
        );
    });

    return <List>{temp}</List>;
};

export default Names;
