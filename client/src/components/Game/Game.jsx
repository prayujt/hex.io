import { useEffect, useState } from "react";
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { postMove } from '../../features/api';
import "./Game.css"
const io = require('socket.io-client')

const Game = () => {
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [gameData, setGameData] = useState([]);
    const [clicked, setClicked] = useState(null);

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
    let counter = 0;
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
        mappings[nums[j] + maxValue][nums[i] + maxValue] = counter;
        counter += 1;
      }
    }

    const hexClick = (event, source) => {
      if (clicked !== null) {
        if (clicked.q === source.state.hex.q && clicked.r === source.state.hex.r) {
          setClicked(null);
        }
        else {
          let from = mappings[clicked.q + maxValue][clicked.r + maxValue];
          let to = mappings[source.state.hex.q + maxValue][source.state.hex.r + maxValue];

          let time = (Math.abs(clicked.q - source.state.hex.q) * 2) + (Math.abs(clicked.r - source.state.hex.r) * 2)
          postMove({
            from: from,
            to: to,
            time: time
          });
          setClicked(null);
        }
      }
      else {
        setClicked(source.state.hex)
      }
    };

    console.log(mappings);
    let makeHexagons = combinations.map((combo) => {
      let index = mappings[combo.x + maxValue][combo.y + maxValue];
      // if (gameData[index] !== undefined) console.log(gameData[index]['Color'])
      return (
        <Hexagon onClick={(e, h) => hexClick(e, h)} className={gameData[index] === undefined ? "#FFFFFF" : gameData[index]['Color']} q={combo.x} r={combo.y} s={0}>
          <Text>{gameData[index] === undefined ? 0 : Math.floor(gameData[index]['Count'])}</Text>
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
      <div style={{backgroundColor: "#4C566A"}}>
        <HexGrid width={window.innerWidth} height={window.innerHeight} viewBox="-50 -48 100 100">
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
