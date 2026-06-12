const express = require('express');
const bodyParser = require('body-parser');
const fs =require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to read/write JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Get products
app.get('/products', (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
});

// Get cart
app.get('/cart', (req, res) => {
  const cart = readJSON('cart.json');
  res.json(cart);
});

// Add to cart
app.post('/cart', (req, res) => {
  const cart = readJSON('cart.json');
  const newItem = req.body;
  
  let existingItem = cart.find(item => item.id === newItem.id);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    newItem.quantity = 1;
    cart.push(newItem);
  }

  writeJSON('cart.json', cart);
  res.sendStatus(200);
});

// Remove from cart
app.delete('/cart/:id', (req, res) => {
  let cart = readJSON('cart.json');
  cart = cart.filter(item => item.id != req.params.id);
  writeJSON('cart.json', cart);
  res.sendStatus(200);
});

// Update cart quantity
app.put('/cart/:id', (req, res) => {
  let cart = readJSON('cart.json');
  const { quantity } = req.body;
  const newQuantity = parseInt(quantity, 10);

  const itemIndex = cart.findIndex(item => item.id == req.params.id);

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
    writeJSON('cart.json', cart);
    res.sendStatus(200);
  } else {
    res.status(404).send('Item not found in cart');
  }
});

// Clear cart after checkout
app.post('/cart/clear', (req, res) => {
  writeJSON('cart.json', []); // Write an empty array to the cart
  res.sendStatus(200);
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
