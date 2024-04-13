fetch('https://raw.githubusercontent.com/Ashirvaad1/Shop/197ea0e82f0941f736fe8afc9c0d271c995d9a2e/products.js')
  .then(response => response.text())
  .then(script => {
    eval(script);
	  let imageRotationIntervals = {};
function displayProducts() {
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        let imagesHtml = '';
        product.images.forEach((image, index) => {
            imagesHtml += `<img src="${image}" alt="${product.name}" title="${product.name}" class="product-image" id="product-image-${product.id}-${index}" style="display: ${index === 0 ? 'block' : 'none'};">`;
        });
        productCard.innerHTML = `
            <div class="product-item">
                <div class="product-images">${imagesHtml}</div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">Price: ₹${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})" title="Add to Cart" class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        productsSection.appendChild(productCard);
        startImageRotation(product.id, product.images.length);
    });
}
function addToCart(productId) {
    const selectedProduct = products.find(product => product.id === productId);
    if (selectedProduct) {
        const quantity = prompt(`Enter the quantity for ${selectedProduct.name}:`);
        if (quantity !== null && !isNaN(quantity) && quantity > 0) {
            selectedProduct.addedToCart = true;
            selectedProduct.quantity = parseInt(quantity);
            const addToCartBtn = document.querySelector(`[onclick="addToCart(${productId})"]`);
            addToCartBtn.classList.add('added-to-cart');
            alert(`${selectedProduct.name} added to cart with quantity ${quantity}!`);
        } else {
            alert('Invalid quantity. Please enter a valid number.');
        }
    }
}
setTimeout(getLocation, 750);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}
function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        var city = data.city;
	if(city!="Basti")
	alert('Sorry, we do not deliver products to ' + city + '.');
    });
}
function accessibility()
{
var elements = document.querySelectorAll('*');
elements.forEach(function(element) {
    element.style.fontWeight = 'bold';
});
}
function purchaseProducts() {
    let selectedProducts = products.filter(product => product.addedToCart);
    let totalCost = 0;
    let dialogContent = `<h2>Selected Products</h2>`;
    selectedProducts.forEach(product => {
        const cost = product.price * product.quantity;
        dialogContent += `
            <p>${product.name} (Qty: ${product.quantity}) - ₹${product.price.toFixed(2)} x ${product.quantity} = ₹${cost.toFixed(2)}</p>`;
        totalCost += cost;
    });
    dialogContent += `<p><strong>Total Cost: ₹${totalCost.toFixed(2)}</strong></p>`;
    const dialog = document.createElement('dialog');
    dialog.innerHTML = dialogContent;
    const orderButton = document.createElement('button');
    orderButton.textContent = 'Order';
    orderButton.addEventListener('click', () => {
        dialog.close();
        openOrderDialog();
    });
    dialog.appendChild(orderButton);
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => dialog.close());
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);
    dialog.showModal();
}
function startImageRotation(productId, imageCount) {
    if (!imageRotationIntervals[productId]) {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            const currentImageId = `product-image-${productId}-${currentIndex}`;
            const currentImageElement = document.getElementById(currentImageId);
            currentImageElement.style.display = 'none';
            currentIndex = (currentIndex + 1) % imageCount;
            const nextImageId = `product-image-${productId}-${currentIndex}`;
            const nextImageElement = document.getElementById(nextImageId);
            nextImageElement.style.display = 'block';
        }, 2000);
        imageRotationIntervals[productId] = intervalId;
    }
}
window.onload = () => {
    const purchaseButton = document.getElementById('buy');
    purchaseButton.addEventListener('click', purchaseProducts);
    displayProducts();
	filterProducts();
};
function sortProducts() {
    const sortOption = document.getElementById('sort-options').value;
    switch(sortOption) {
        case 'alphabetical_asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'alphabetical_desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price_low_to_high':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price_high_to_low':
            products.sort((a, b) => b.price - a.price);
            break;
        default:
            products.sort((a, b) => a.id - b.id);
            break;
    }
    displayProducts();
}
function displayFilteredProducts(filteredProducts) {
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = '';
    if (filteredProducts.length === 0) {
        productsSection.innerHTML = "<p>No products found.</p>";
        return;
    }
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        let imagesHtml = '';
        product.images.forEach((image, index) => {
            imagesHtml += `<img src="${image}" alt="${product.name}" title="${product.name}" class="product-image" id="product-image-${product.id}-${index}" style="display: ${index === 0 ? 'block' : 'none'};">`;
        });
        productCard.innerHTML = `
            <div class="product-item">
                <div class="product-images">${imagesHtml}</div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">Price: ₹${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})" title="Add to Cart" class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        productsSection.appendChild(productCard);
        startImageRotation(product.id, product.images.length);
    });
}
function filterProducts() {
    const costFilter = document.getElementById('cost-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const filteredProducts = products.filter(product => {
        const costInRange = (costFilter === 'all' || (product.price >= parseInt(costFilter.split('-')[0]) && product.price <= parseInt(costFilter.split('-')[1])));
        const categoryMatch = (categoryFilter === 'all' || product.categories.includes(categoryFilter));
        return costInRange && categoryMatch;
    });
    displayFilteredProducts(filteredProducts);
}
function openOrderDialog() {
    const orderDialog = document.createElement('dialog');
    orderDialog.innerHTML = `
        <h2>Enter Your Details</h2>
        <label for="name">Name:</label>
        <input type="text" id="name" required><br>
        <label for="email">Email:</label>
        <input type="email" id="email" required><br>
        <label for="address">Address:</label>
        <textarea id="address" required></textarea><br>
        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" required><br>
        <button id="payButton">Pay</button>
    `;
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => orderDialog.close());
    orderDialog.appendChild(closeButton);
    const payButton = orderDialog.querySelector('#payButton');
    payButton.addEventListener('click', () => {
        alert('Payment processed successfully!');
        orderDialog.close();
    });
    document.body.appendChild(orderDialog);
    orderDialog.showModal();
}
    displayProducts();
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
