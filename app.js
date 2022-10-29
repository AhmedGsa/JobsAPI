require('dotenv').config();
require('express-async-errors');
const express = require('express');
const auth = require("./routes/auth")
const jobs = require("./routes/jobs")
const helmet = require('helmet')
const cors = require('cors')
const xssClean = require('xss-clean')
const rateLimit = require("express-rate-limit")

const authenticateUser = require("./middleware/authentication")
const connectDB = require("./db/connect")
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.set('trust proxy', 1)
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(helmet())
app.use(cors())
app.use(xssClean())
// extra packages

// routes
app.get("/", (req,res) => {
  res.send("jobs api")
})
app.use("/api/v1/auth",auth)
app.use("/api/v1/jobs",authenticateUser,jobs)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)

const port = process.env.PORT;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
