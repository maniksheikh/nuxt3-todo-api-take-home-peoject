const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://devmaniksheikh:6ilVUzaNbscaaIEU@cluster0.hvvemn4.mongodb.net/?retryWrites=true&w=majority";
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(url, mongoOptions);

module.exports = client;