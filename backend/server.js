import express from "express"

const app = express()

// app.get("/",(req,res)=>{
//         res.send("server is ready");
// })

app.get("/api/somedata",(req,res)=>{
    console.log("GET /api/somedata called"); 
    const somedata=[{
		color: "red",
		value: "#f00"
	},
	{
		color: "green",
		value: "#0f0"
	},
	{
		color: "blue",
		value: "#00f"
	},
	{
		color: "cyan",
		value: "#0ff"
	},
	{
		color: "magenta",
		value: "#f0f"
	},
	{
		color: "yellow",
		value: "#ff0"
	},
	{
		color: "black",
		value: "#000"
	}]
    res.send(somedata)
})

const port  = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server at  http://localhost:${port}`)
})