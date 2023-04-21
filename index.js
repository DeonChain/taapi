require('dotenv').config()
const express = require('express');
const Axios = require('axios');
const { send } = require('express/lib/response');
const app = express();
const apiKey=process.env.API_KEY;
// console.log(apiKey)
const tokens=['BTC','ETH','XRP','LTC','XMR'];
var value;
var timeArray = []
var surfer =0;
const d = new Date();
let timeNow = d.getTime();

setInterval(()=>{
    apiCalls(tokens[surfer],surfer)
    surfer= (surfer+1)%5 ;
},16000)
var t;

const apiCalls=(token,surfer)=>{
    Axios.get(`https://api.taapi.io/rsi?secret=${apiKey}&exchange=binance&symbol=${token}/USDT&interval=4h`)
    .then((res)=>{analyse(res.data.value,token)})
    .catch((err)=>{
        t={
            token: token,
            rsi: "Not found",
            zone: "Error",
            time:timeNow
        }
        timeArray.push(t)
        surfer = surfer -1;        
    })
}


const analyse=(rsi,token)=>{

    if (rsi <30)
    {
        t={
            rsi : rsi,
            token: token,
            zone:"buy",
            time: timeNow, 
        }
    }

    if (rsi>=30 && rsi <=60)
    {
        t={
            rsi : rsi,
            token: token,
            zone:"Sit Idle",
            time: timeNow, 
        }
    }

    if (rsi>60)
    {
        t={
            rsi : rsi,
            token: token,
            zone:"Short it",
            time: timeNow, 
        }
    }

    timeArray.push(t)
    console.log(timeArray);
}

app.get('/',(req,res)=>{
    nTime = timeNow 
    res.send("Getting Indicator data")
    // const sendData =timeArray.filter((item,index)=>{
    //     return (item.timeNow+100000 > nTime)
    // })
    const send = timeArray.map((item,index)=>{
        return `Token is ${item.token} and zone is${item.zome}`});
    res.send({
        body:send
    }
)
});

app.listen(8000,()=>{"app working on port 8000"})

