const productsContainer = document.getElementById('products-container');
const searchBar = document.getElementById('search-bar');
let allProducts = []; // To store all products for filtering

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

// Renders the product list with category sections
function renderProducts(productsToRender) {
  // Clear previous content
  productsContainer.innerHTML = '';

  if (productsToRender.length === 0) {
    productsContainer.innerHTML = `<p class="col-12 text-center text-muted">No products found matching your search.</p>`;
    return;
  }

  // Group products by category
  const productsByCategory = productsToRender.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Generate HTML for each category
  for (const category in productsByCategory) {
    // Add the category heading
    productsContainer.innerHTML += `<h2 class="category-heading">${category}</h2>`;
    
    // Create the row for this category's products
    const productRow = document.createElement('div');
    productRow.className = 'row';
    
    productRow.innerHTML = productsByCategory[category].map(p => `
      <div class="col-md-3 mb-4">
        <a href="product.html?id=${p.id}" class="product-link">
          <div class="card h-100 shadow-sm">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column">
              <div>
                <h5 class="card-title">${p.name}</h5>
                <div classs="mb-2">
                  <span class="star-rating">${renderStars(p.rating)}</span>
                  <span class="reviews">(${p.reviews})</span>
                </div>
                <p class="card-description">${p.description}</p>
              </div>
              <div class="mt-auto">
                <p class="card-text">₹${p.price.toLocaleString('en-IN')}</p>
                <button class="btn btn-primary w-100" onclick="addToCart(event, ${p.id})">Add to Cart</button>
              </div>
            </div>
          </div>
        </a>
      </div>
    `).join('');
    
    // Add the row to the container
    productsContainer.appendChild(productRow);
  }
}

// Loads products and adds search listener
async function loadProducts() {
  const res = await fetch('/products');
  allProducts = await res.json();
  renderProducts(allProducts); // Render all products initially
}

// Search bar event listener
searchBar.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm)
  );
  
  renderProducts(filteredProducts);
});


// Add to cart function
async function addToCart(event, id) {
  event.preventDefault();
  event.stopPropagation();
  
  const product = allProducts.find(p => p.id === id);

  await fetch('/cart', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(product)
  });
  
  // Use toast notification instead of alert
  showToast(`${product.name} added to cart!`);
}

loadProducts();

// Prevent search form from submitting
document.getElementById('search-form').addEventListener('submit', e => e.preventDefault());
