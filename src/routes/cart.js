import express from "express";
import fs from "fs";

const router = express.Router();
const cartsFilePath = "./data/cart.json";
const productsFilePath = "./data/products.json";

// Función para leer los carritos desde el archivo JSON
const readCartsFromFile = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error al leer los carritos:", err);
        return [];
    }
};

// Función para leer los productos desde el archivo JSON
const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error al leer los productos:", err);
        return [];
    }
};

// Función para escribir los carritos al archivo JSON
const writeCartsToFile = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (err) {
        console.error("Error al escribir los carritos:", err);
    }
};

// Ruta para crear un nuevo carrito
router.post("/", (req, res) => {
    const carts = readCartsFromFile();
    const {products} = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({status: "error", message: "El campo debe ser un array"});
    }

    const newCart = {
        id: carts.length + 1,
        products: products,
    };

    carts.push(newCart);
    writeCartsToFile(carts);

    res.status(200).json({status: "Carrito creado con éxito", Cart: newCart});
});

// Ruta para obtener un carrito por ID
router.get("/:cid", (req, res) => {
    const carts = readCartsFromFile();
    const cartId = +req.params.cid;

    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
        return res.status(400).json({Error: "No se encontró el carrito con ese ID"});
    }

    res.status(200).json({Operacion: "Se encontró el carrito", Carrito: carts[cartIndex]});
});

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
    const carts = readCartsFromFile();
    const products = readProductsFromFile();

    const cartId = +req.params.cid;
    const prodId = +req.params.pid;

    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    const prodIndex = products.findIndex((prod) => prod.id === prodId);

    if (cartIndex === -1) {
        return res.status(404).json({error: "Carrito no encontrado"});
    }

    if (prodIndex === -1) {
        return res.status(404).json({error: "Producto no encontrado"});
    }

    const cart = carts[cartIndex];
    const productInCart = cart.products.find((p) => p.product === prodId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({
            product: prodId,
            quantity: 1,
        });
    }

    // Guardar los cambios en el archivo
    writeCartsToFile(carts);

    res.status(200).json({message: "Producto agregado al carrito", cart});
});

export default router;
