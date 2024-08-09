import express from "express";
import pkg from "jsonwebtoken";
import mongoose from "mongoose";
const { sign, verify } = pkg;

mongoose.connect(
  " "
);

const allusers = mongoose.model("users", {
    name: String,
    email: String,
    password: String,
  });

const app = express();
const jwtPassword = "123456";
app.use(express.json());

async function userExists(username, password) {

  const result = await allusers.findOne({
    email: username,password : password
  });

  if (result) {
    return true;
  }
  return false;
}

app.post('/signup', function (req, res){
    
    const username = req.body.username;
    const password = req.body.password;
    
    const userDetails = new allusers({
        email : username,
        password : password
    });
    userDetails.save()
    res.json({
        msg: "signed up!!",
      });
    })


app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!(await userExists(username, password))) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = verify(token, jwtPassword);
    const username = decoded.username;


    const userDetails = await allusers.find({})

    const user = userDetails.filter((item) => {
        if (item.email === username) {
            return false
        }else{
            return true
        }
    })
    res.json({
       msg : user 
    });
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000);
