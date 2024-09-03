import express from "express";
import fs from "fs";

const router = express.Router();
const productsFilePath = "./data/products.json";

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

// Función para escribir los productos al archivo JSON

const writeProductsToFile = (products) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error("Error al escribir los productos:", err);
    }
};

router.get("/", (req, res) => {
    const products = readProductsFromFile();

    if (products.length === 0) {
        return res.status(200).json({estado: "Aun no hay productos disponibles"});
    }

    res.send(products);
});

router.get("/:id", (req, res) => {
    const products = readProductsFromFile();
    const id = +req.params.id;
    const product = products.find((p) => p.id === id);

    if (product) {
        res.send(product);
    } else {
        res.status(404).json({error: "Producto no encontrado"});
    }
});

router.post("/add", (req, res) => {
    const products = readProductsFromFile();
    const {title, description, code, price, status, stock, category} = req.body;

    if (!title || !description || !code || !price || typeof status === "undefined" || !stock || !category) {
        return res.status(400).json({error: "Todos los campos son obligatorios"});
    }

    const newProduct = {
        id: products.length + 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
    };

    products.push(newProduct);
    writeProductsToFile(products);

    res.status(200).json({Operacion: "Realizada", ProductoAgregado: newProduct});
});

router.put("/change/:id", (req, res) => {
    const products = readProductsFromFile();
    const id = +req.params.id;
    const {title, description, code, price, status, stock, category} = req.body;

    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
        return res.status(400).json({error: "El producto no existe"});
    }

    if (
        !title ||
        !description ||
        !code ||
        typeof price === "undefined" ||
        typeof status === "undefined" ||
        typeof stock === "undefined" ||
        !category
    ) {
        return res.status(400).json({error: "Todos los campos son obligatorios"});
    }

    const updatedProduct = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
    };

    products[productIndex] = updatedProduct;
    writeProductsToFile(products);

    res.status(200).json({Operacion: "Realizada", ProductoActualizadoA: updatedProduct});
});

router.delete("/delete/:id", (req, res) => {
    const products = readProductsFromFile();
    const id = +req.params.id;
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
        return res.status(404).json({error: "El producto no existe"});
    }

    const deletedProd = products.splice(productIndex, 1);
    writeProductsToFile(products);

    res.status(200).json({Operacion: "Realizada", ProductoEliminado: deletedProd[0]});
});

export default router;
