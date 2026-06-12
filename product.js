document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  
  if (productId) {
    loadProduct(productId);
  } else {
    document.getElementById('product-detail-content').innerHTML = 
      '<p class="text-danger">Error: No product ID specified.</p>';
  }
});

async function loadProduct(id) {
  const res = await fetch(`/products/${id}`);
  if (!res.ok) {
    document.getElementById('product-detail-content').innerHTML = 
      '<p class="text-danger">Error: Product not found.</p>';
    return;
  }
  
  const p = await res.json();
  const contentDiv = document.getElementById('product-detail-content');
  
  contentDiv.innerHTML = `
    <div class="col-md-6">
      <img src="${p.image}" class="img-fluid rounded product-detail-img" alt="${p.name}">
    </div>
    <div class="col-md-6 product-detail-info">
      <h2>${p.name}</h2>
      
      <div class="mb-2">
        <span class="star-rating">${renderStars(p.rating)}</span>
        <span class="reviews">(${p.reviews} reviews)</span>
      </div>
      
      <p class="card-description">${p.description}</p>
      
      <h3 class="product-price">₹${p.price.toLocaleString('en-IN')}</h3>
      
      <button class="btn btn-primary btn-lg mt-3" onclick="addToCart()">
        <i class="fas fa-shopping-cart me-2"></i> Add to Cart
      </button>
    </div>
  `;

  // Make the "Add to Cart" button on this page work
  window.addToCart = async () => {
    await fetch('/cart', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(p)
    });
    
    // Use toast notification
    showToast(`${p.name} added to cart!`);
  };
}

// Helper function to render stars
function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star empty"></i>';
  }
  return stars;
}
