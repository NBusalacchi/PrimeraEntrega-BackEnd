import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/cart.js";
import __dirname from "./utils.js";
import {Server} from "socket.io";
import handlebars from "express-handlebars";
import fs from "fs";

const app = express();

const productsFilePath = "./data/products.json";

let products = [];

const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error al leer los productos:", err);
        return [];
    }
};

products = readProductsFromFile();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);

const server = app.listen(8080, () => {
    console.log("Server ON");
});

const io = new Server(server);

io.on("connection", (socket) => {
    products = readProductsFromFile();
    socket.emit("productsRealTime", {products});
});

export default io;
