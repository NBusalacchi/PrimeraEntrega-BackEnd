import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/cart.js";

const app = express();

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);

const server = app.listen(8080, () => {
    console.log("Server ON");
});
