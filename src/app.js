const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const roleRouter = require("./routes/roleRouter");
const userRouter = require("./routes/userRouter");
const policeRouter = require("./routes/policeRouter");
const missingRouter = require("./routes/missingRoter");
const reportingRouter = require("./routes/reportingRouter")

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/role",roleRouter);
app.use("/api/user",userRouter);
app.use("/api/police",policeRouter);
app.use("/api/missing",missingRouter);
app.use("/api/report",reportingRouter);



module.exports = app;