import mongoose from "mongoose"; import express from "express";

const app = express();
app.use(express.json())

mongoose.connect(
  " "
);

const allusers = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
});

app.post("/demo", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  const userExsists = await allusers.findOne({
    email: username,
  });

  if (userExsists) {
    return res.status(400).json({
      msg: "user already exists",
    });
  }

  const users = new allusers({
    name: name,
    email: username,
    password: password,
  });
  users.save();
  res.json({
    msg: "user created!!",
  });
});

app.listen(3000);
