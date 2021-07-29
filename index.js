const express = require('express')
const app = express();
app.use(express.static("./public"));

// app.set("view engine", "ejs");
// app.set("views", "./view")
const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(8000);


const chat = ["cơ", "rô", "tép", "bích"];
const bo = [];
for(let c of chat) {
	for(let i=1; i<=13; i++){
    	let bai;
		switch(i) {
        	case 1:
            	bai = "A";
                break;
            case 11:
            	bai = "J";
                break;
            case 12:
            	bai = "Q";
                break;
            case 13: 
            	bai = "K";
                break;
            default:
            	bai = i;
                break;
        };
        bo.push(`${bai} ${c}`);
	}
}
const listIndexItem = [];
for(let i=0;i<52;i++){
	listIndexItem.push(i);
}

let numberPlayer = 0;
let readyPlayer = 0;
const listPlayer = [];

io.on("connection", (e) => {
    numberPlayer++;
    listPlayer.push(e.id);
    console.log(`hi ${e.id}`);

    e.on("disconnect", () => {
        numberPlayer--;
        const indexTemp = listPlayer.findIndex(i => i == e.id);
        listPlayer.splice(indexTemp, 1);
        console.log(`bye ${e.id}, ${indexTemp}`);
    })

    e.on("playGame", () => {
        readyPlayer++;
        if(readyPlayer == numberPlayer) {
            console.log(numberPlayer);
            console.log(listPlayer);
            readyPlayer = 0;
            listIndexItem.sort(function(){return 0.5 - Math.random()});
            const list = [...listIndexItem];
            list.splice(3*numberPlayer);
            for(let i in listPlayer) {
                io.to(listPlayer[i]).emit("chiabai", [bo[list[3*i]], bo[list[3*i + 1]], bo[list[3*i + 2]]]);
            }
        }
    })
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
})

// io.sockets.emit: send all
// socket.broadcast.emit: send all trừ người gửi
// socket.emit: send người gửi
// io.to("socketId").emit: send socketId