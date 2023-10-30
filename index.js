const express = require("express");
const cors = require("cors");
const app = express();
const client = require("./mongodb");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Get APi
app.get("/todo", async (req, res) => {
  await client.connect();
  const todos = await client
    .db("todos-data")
    .collection("todos")
    .find({})
    .toArray();
  res.send({
    success: true,
    todos,
  });
});

// Post Api
app.post("/todo/:id", async (req, res) => {
  await client.connect();

  const todoCount = await client
    .db("todos-data")
    .collection("todos")
    .countDocuments({});

  const todo = req.body;
  todo.id = todoCount + 1;

  const db = await client
    .db("todos-data")
    .collection("todos")
    .insertOne(todo);

  const result = db.ops[0];
  res.send({
    success: !!db,
    result,
  });
});

// Update Api
app.put("/todo/:id", async (req, res) => {
  await client.connect();

  const todo = req.body;
  const id = parseInt(req.params.id);

  const updated = await client
    .db("todos-data")
    .collection("todos")
    .updateOne({ id }, { $set: todo });

  if (updated.modifiedCount === 0) {
    res.send({
      success: false,
      message: "Could not update todo",
    });
  } else {
    res.send({
      success: true,
      todo,
    });
  }
});

// Delete Api
app.delete("/todo/:id", async (req, res) => {
  await client.connect();
  const id = parseInt(req.params.id);
  const deleted = await client
    .db("todos-data")
    .collection("todos")
    .deleteOne({ id });
  if (deleted.deletedCount === 0) {
    res.send({
      success: false,
      message: "Could not delete todo",
    });
  } else {
    res.send({
      success: true,
    });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
