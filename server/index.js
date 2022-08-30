require("dotenv").config({ path: "./config.env" });
const express = require("express");
const errorHandler = require("./middlewares/error");
const mongoDB = require("./config/db");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoDB(process.env.MONGOURI);

app.use("/api/article", require("./routes/article.routes"));
app.use("/api/course", require("./routes/course.routes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
