const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname+"/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();
const path = require("path"); // Import the path module



const app = express();
const publicDirectoryPath = path.join(__dirname, "public");


// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicDirectoryPath)); // Use the absolute path

mongoose.connect(
  // process.env.MONGODB_URI
  "mongodb+srv://jai0651:shankarj952@cluster0.hxqd999.mongodb.net/azure_app"
);

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);

// Route for adding a new product
app.post("/products", async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product({ name, description, price });
  await product.save();
  res.status(201).json(product);
});

// Route for listing all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.delete('/products/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (deletedProduct) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.get("/", (req, res) => {
    res.status(200).send("OK");
});


const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});
