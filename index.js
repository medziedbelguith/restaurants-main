const express=require("express")
const app=express()
const bodyParser=require('body-parser')
const mongoose=require("mongoose")

const { routerUser } = require("./Routes/userRoute")
const { routerPlat} = require("./Routes/platRoute")
const { routerRestaurant } = require("./Routes/restaurantRoute")
const { routerReservation } = require("./Routes/reservationRoute")

const cors=require('cors')

mongoose.connect("mongodb://localhost:27017/restaurant",{useUnifiedTopology: true,useNewUrlParser: true})
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))

/*mongoose.connect("mongodb+srv://cluster0.jfk75.mongodb.net/bongest",{ useUnifiedTopology: true,useNewUrlParser: true , username: "JR-Test", password: "test" })
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))
*/

app.use(express.json())

app.use(cors())

app.use('/user',routerUser)
app.use('/plats',routerPlat)
app.use('/restaurants',routerRestaurant)
app.use('/reservations',routerReservation)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('uploads'));

app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.all('*', function(req, res) { 
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 5000,()=>{
    console.log("server conected to port 5000")
})
