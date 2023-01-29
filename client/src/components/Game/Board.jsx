import { useEffect, useState } from "react";
import {
    HexGrid,
    Layout,
    Hexagon,
    Text,
    // Path,
    // Hex,
    // Pattern,
} from "react-hexgrid";
import { postMove } from "../../features/api";

const Board = ({ socket, username, initialData }) => {
    const [gameData, setGameData] = useState(initialData);
    const [clicked, setClicked] = useState(null);
    // const [path, setPath] = useState(null);

    const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    let maxValue = 0;
    nums.forEach((num) => {
        if (maxValue < num) maxValue = num;
    });
    let combinations = [];

    let mappings = [];
    for (let i = 0; i < nums.length; i++) {
        let temp = [];
        for (let j = 0; j < nums.length; j++) {
            temp.push(0);
        }
        mappings.push(temp);
    }
    let counter = 0;
    for (let i = 0; i < nums.length; i++) {
        let offsetStart = 0;
        let offsetEnd = 0;
        if (nums[i] < 0) offsetStart += Math.abs(nums[i]);
        if (nums[i] > 0) offsetEnd += nums[i];
        for (let j = offsetStart; j < nums.length - offsetEnd; j++) {
            combinations.push({
                x: nums[j],
                y: nums[i],
            });
            mappings[nums[j] + maxValue][nums[i] + maxValue] = counter;
            counter += 1;
        }
    }

    const hexClick = (event, source) => {
        if (clicked !== null) {
            if (
                clicked.q === source.state.hex.q &&
                clicked.r === source.state.hex.r
            ) {
                setClicked(null);
            } else {
                let from = mappings[clicked.q + maxValue][clicked.r + maxValue];
                let to =
                    mappings[source.state.hex.q + maxValue][
                        source.state.hex.r + maxValue
                    ];

                let time =
                    Math.abs(clicked.q - source.state.hex.q) * 2 +
                    Math.abs(clicked.r - source.state.hex.r) * 2;

                // setPath(
                //     <Path
                //         start={new Hex(clicked.q, clicked.r, 0)}
                //         end={new Hex(source.state.hex.q, source.state.hex.r, 0)}
                //     />
                // );
                // let timeout = setTimeout(() => {
                //     setPath(null);
                // }, 1000);

                postMove({
                    username: username,
                    from: from,
                    to: to,
                    time: time,
                });
                setClicked(null);
            }
        } else {
            setClicked(source.state.hex);
        }
    };

    let makeHexagons = combinations.map((combo) => {
        let index = mappings[combo.x + maxValue][combo.y + maxValue];
        return (
            <Hexagon
                onClick={(e, h) => hexClick(e, h)}
                className={
                    gameData[index] === undefined
                        ? "#7be3f6"
                        : gameData[index]["Color"]
                }
                q={combo.x}
                r={combo.y}
                s={0}
            >
                <Text>
                    {gameData[index] === undefined
                        ? 0
                        : Math.floor(gameData[index]["Count"]) + "\n"}
                    {gameData[index] !== undefined &&
                    gameData[index]["AttackCount"] > 0
                        ? Math.floor(gameData[index]["AttackCount"])
                        : ""}
                </Text>
            </Hexagon>
        );
    });

    useEffect(() => {
        socket.on("gameUpdate", (data) => {
            setGameData(data);
            console.log(data);
        });
    });

    return (
        <div style={{ backgroundColor: "#4C566A" }}>
            <HexGrid
                width={window.innerWidth}
                height={window.innerHeight}
                viewBox="-50 -48 100 100"
            >
                <Layout
                    size={{ x: 5, y: 5 }}
                    flat={false}
                    spacing={1.1}
                    origin={{ x: 2, y: 2 }}
                >
                    {makeHexagons}
                    {/* {path != null ? path : null} */}
                </Layout>
            </HexGrid>
        </div>
    );
};

export default Board;
