import 'dotenv/config'
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan";


const app = express();
const port = 3000 || process.env.PORT;

//adding morgan for logging HTTP requests
const morganFormat = ":method :url :status :response-time ms";

//adding middleware to log HTTP requests using morgan ans wiston
//Morgan is used to log HTTP requests and Winston is used to log the messages in a file
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


//adding a middleware to parse incoming JSON requests.Not including this will give an error 
app.use(express.json());


//starting building a basic CRUD application:
let teaData = [];
let nextId = 1;

//add a new tea
app.post('/teas' , (req,res) => {
    const {name , price} = req.body;
    const newTea = {id : nextId++ , name:name , price : price};
    teaData.push(newTea);
    res.status(201).send(newTea);
})

//get all teas
app.get('/teas' , (req,res) => {
    res.status(200).send(teaData);
})

//get a tea with particular id
app.get('/teas/:id' , (req,res) => {
    const tea = teaData.find(t => t.id == parseInt(req.params.id) );
    if(!tea){
        return res.status(404).send("Tea not foud");
    }
    res.status(200).send(tea)
})

//update tea
app.put('/teas/:id' , (req,res) => {
    const tea = teaData.find(t => t.id == parseInt(req.params.id) );
    if(!tea){
        return res.status(404).send("Tea not foud");
    }

    const {name , price} = req.body
    tea.name = name;
    tea.price = price;
    res.status(200).send(tea);
})

//delete tea
app.delete('/teas/:id' , (req,res) => {
    const teaIndex = teaData.findIndex(t => t.id === parseInt(req.params.id));
    if(teaIndex === -1){
        return res.status(404).send('tea not found');
    }
    teaData.splice(teaIndex , 1);
    return res.status(204);
})


app.listen(port , () => {
    console.log(`server is listening on the port ${port}`);
})  
