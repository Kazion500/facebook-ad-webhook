const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();

app.post("/",(req,res)=>{
    console.log(req.body);
    res.send(req.body);
})

app.use(express.json());
app.listen(() => console.log("Backend Running on port" + PORT));
