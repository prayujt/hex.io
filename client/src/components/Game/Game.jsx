import { useEffect, useState } from "react";
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import "./Game.css"
const io = require('socket.io-client')

const Game = () => {
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [gameData, setGameData] = useState([]);

    const nums = [-5 , -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    let maxValue = 0;
    nums.forEach((num) => {
      if (maxValue < num) maxValue = num;
    })
    let combinations = [];

    let mappings = [];
    for (let i = 0; i < nums.length; i++) {
      let temp = [];
      for (let j = 0; j < nums.length; j++) {
        temp.push(0);
      }
      mappings.push(temp);
    }
    let counter = 1;
    for (let i = 0; i < nums.length; i++) {
      let offsetStart = 0;
      let offsetEnd = 0;
      if (nums[i] < 0) offsetStart += Math.abs(nums[i]);
      if (nums[i] > 0) offsetEnd += nums[i];
      for (let j = offsetStart; j < nums.length - offsetEnd; j++) {
        combinations.push({
          x: nums[j],
          y: nums[i]
        })
        console.log(maxValue)
        mappings[nums[j] + maxValue][nums[i] + maxValue] = counter;
        counter += 1;
      }
    }

    console.log(mappings)
    let makeHexagons = combinations.map((combo) => {
      let index = mappings[combo.x + maxValue][combo.y + maxValue] - 1;

      return (
        <Hexagon q={combo.x} r={combo.y} s={0}>
          <Text>{gameData[index] == undefined ? "" : gameData[index]['Count']}</Text>
        </Hexagon>
      )

    });
    // establish socket connection
    useEffect(() => {
      setSocket(io('http://' + process.env.REACT_APP_API_URL));
    }, []);
   
    // subscribe to the socket event
    useEffect(() => {
      if (!socket) return;
   
      socket.on('connect', () => {
        setSocketConnected(socket.connected);
        console.log("Connected")
      });
      socket.on('disconnect', () => {
        setSocketConnected(socket.connected);
      });
      socket.on('gameUpdate', (data) => {
        setGameData(data);
        console.log(data);
      });
   
    }, [socket]);

    return (
      <div className="Game">
       <HexGrid width={1260} height={780} viewBox="-60 -45 100 100">
            {/* Grid with manually inserted hexagons */}
            <Layout size={{ x: 5, y: 5 }} flat={false} spacing={1.1} origin={{ x: 2, y: 2 }}>
              {makeHexagons}
              {/* <Path start={new Hex(0, 0, 0)} end={new Hex(-2, 0, 1)} /> */}
            </Layout>
          </HexGrid>
      </div>
    );
}

export default Game;
