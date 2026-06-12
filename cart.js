const cartDiv = document.getElementById('cart');

// Helper to format currency
const formatCurrency = (num) => {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

async function loadCart() {
  const res = await fetch('/cart');
  const cart = await res.json();
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p class='lead text-center text-muted'>Your cart is empty!</p>";
    return;
  }

  // Calculate total
  const rawTotal = cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);

  cartDiv.innerHTML = `
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>₹${c.price.toLocaleString('en-IN')}</td>
            <td>
              <input 
                type="number" 
                class="form-control form-control-sm cart-quantity-input" 
                value="${c.quantity}" 
                onchange="updateQuantity(${c.id}, this.value)"
                min="0"
              >
            </td>
            <td>₹${formatCurrency(c.price * c.quantity)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${c.id})">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="row mt-4 justify-content-end">
      <div class="col-md-6 text-end">
        <h3>Total: ₹${formatCurrency(rawTotal)}</h3>
        <button class="btn btn-success btn-lg mt-3" onclick="checkout()">
          Proceed to Checkout <i class="fas fa-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  `;
}

async function removeFromCart(id) {
  await fetch('/cart/' + id, { method: 'DELETE' });
  loadCart();
  showToast("Item removed from cart", "danger");
}

async function updateQuantity(id, quantity) {
  const newQuantity = parseInt(quantity, 10);

  await fetch('/cart/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQuantity })
  });
  
  loadCart();
  showToast("Cart updated!");
}

async function checkout() {
  const res = await fetch('/cart');
  const cart = await res.json();
  
  if(cart.length === 0) {
    showToast("Your cart is empty!", "danger");
    return;
  }
  
  localStorage.setItem('checkoutCart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

loadCart();
