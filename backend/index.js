const mongoose = require("mongoose");
const createServer = require("./app");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wpei7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    const app = createServer();
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server has started!", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.log(err);
  });
