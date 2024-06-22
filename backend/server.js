import express from "express";
import cors from "cors";
import data from "./data.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import productRouter from "./routers/productRouter.js";
mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log(error.reason);
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRouter);
app.get("/api/paypal/clientId", (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});
app.use("/api/uploads", uploadRouter);

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.use("/api/orders", orderRouter);

app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found!" });
  }
});

app.use('/api/products', productRouter);


app.use((err, req, res, next) => {
  const status = err.name && err.name === "ValidationError" ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.listen(5000, () => {
  console.log("server Started");
});
