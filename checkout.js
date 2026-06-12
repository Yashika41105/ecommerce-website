document.addEventListener('DOMContentLoaded', () => {
  const cartData = localStorage.getItem('checkoutCart');
  if (!cartData) {
    document.getElementById('checkout-container').innerHTML = 
      '<h2>Error: No cart data found.</h2><p>Please go back to your cart and try again.</p>';
    return;
  }

  const cart = JSON.parse(cartData);
  const itemsContainer = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const totalEl = document.getElementById('summary-total');

  let rawTotal = 0;

  // Format currency helper
  const formatCurrency = (num) => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Populate order summary
  cart.forEach(item => {
    rawTotal += item.price * item.quantity;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <h6 class="my-0">${item.name}</h6>
        <small class="text-muted">Qty: ${item.quantity}</small>
      </div>
      <span class="text-muted">₹${formatCurrency(item.price * item.quantity)}</span>
    `;
    itemsContainer.appendChild(li);
  });

  // Set totals
  subtotalEl.textContent = `₹${formatCurrency(rawTotal)}`;
  totalEl.textContent = `₹${formatCurrency(rawTotal)}`;

  // Handle "Place Order" button
  const placeOrderBtn = document.getElementById('place-order-btn');
  placeOrderBtn.addEventListener('click', async () => {
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      showToast('Please fill out all shipping details.', 'danger'); // Use toast
      return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Placing Order...';

    await fetch('/cart/clear', { method: 'POST' });
    localStorage.removeItem('checkoutCart');

    document.getElementById('checkout-container').style.display = 'none';
    document.getElementById('thank-you-message').style.display = 'block';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 5000);
  });
});
