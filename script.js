function product(productName, productImage, productDescription, productPrice) {
  const modalId = `modal-${productName.replace(/\s+/g, '-')}`;
  
  // Check if modal already exists
  if (!document.getElementById(modalId)) {
    const modalHTML = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${productName}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Product Image -->
              <div class="img text-center mb-3">
                <img src="${productImage}" class="img-fluid" alt="${productName}">
              </div>
              
              <!-- Product Description -->
              <p class="descri">${productDescription}</p>
              <p class="price"><strong>Price:</strong> $<span id="price-${modalId}">${productPrice.toFixed(2)}</span></p>
              
            
            <div class="modal-footer">
              <button type="button" class="btn btn-success" onclick="addToCart('${productName}', '${productImage}', '${productDescription}', ${productPrice})">Add to Cart</button>

            </div>
          </div>
        </div>
      </div>`;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const quantityInput = document.getElementById(`quantity-${modalId}`);
    
  }

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}


let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load existing cart or initialize

// Function to Add Product to Cart
function addToCart(productName, productImage, productDescription, productPrice) {
  const existingProduct = cart.find((item) => item.name === productName);

  if (existingProduct) {
    existingProduct.quantity += 1; // Increment quantity if product exists
  } else {
    cart.push({
      name: productName,
      image: productImage,
      description: productDescription,
      price: productPrice,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
  alert(`${productName} added to cart!`);
}

// Function to Display Cart on Cart Page
function displayCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = ""; // Clear the container

  let totalAmount = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    cartContainer.innerHTML += `
      <div class="cart-item d-flex align-items-center justify-content-between border-bottom">
        <div class="d-flex align-items-center">
        <div class="row">
        <div class="col">
        <div>
            <h5>${item.name}</h5>
            </div>
          <img src="${item.image}" alt="${item.name}" style="width: 150px; height: 150px;" class="mt-3"></div>
          
            <div>
            <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
            </div>
          
        </div>
        <div class="col">
          <button class="btn btn-sm btn-danger mx-5" onclick="deleteProduct(${index})">Delete</button>
        </div>
        <div class="d-flex align-items-center col">
          <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
          <input type="text" value="${item.quantity}" readonly class="form-control text-center mx-2" style="width: 50px;">
          <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <p><strong>Total:</strong> $${itemTotal.toFixed(2)}</p>
      </div>
    `;
  });

  // Display Total Amount
  document.getElementById("total-amount").innerHTML = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// Function to Change Quantity
function changeQuantity(index, change) {
  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart(); // Refresh cart display
  }
}

// Function to Delete a Product
function deleteProduct(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart(); // Refresh cart display
}

// Function to Buy Products
function buyProducts() {
  if (cart.length > 0) {
    alert("Thank you for your purchase!");
    cart = []; // Clear cart
    localStorage.removeItem("cart");
    displayCart(); // Refresh cart
  } else {
    alert("Your cart is empty!");
  }
}


// Function to Show Final Confirmation Modal
function showFinalConfirmation() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Show the modal
  const finalModal = new bootstrap.Modal(document.getElementById("finalConfirmationModal"));
  finalModal.show();
}

// Function to Confirm Order
function confirmOrder() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const contactNumber = document.getElementById("contactNumber").value.trim();

  if (!name || !address || !contactNumber) {
    alert("Please fill in all required fields.");
    return;
  }

  // Save order details (optional, for further use)
  const orderDetails = {
    name: name,
    address: address,
    contactNumber: contactNumber,
    cartItems: cart,
    totalAmount: calculateTotalAmount()
  };

  console.log("Order Details:", orderDetails);

  // Clear Cart and Redirect
  alert("Order confirmed! Thank you for your purchase.");
  cart = []; // Clear cart
  localStorage.removeItem("cart");
  window.location.href = "./index.html"; // Redirect to homepage or thank-you page
}

// Helper Function to Calculate Total Amount
function calculateTotalAmount() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}



 
function registerUser() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("name").value;
  const password = document.getElementById("pass").value;

  if (email && username && password) {
 
    localStorage.setItem("userEmail", email);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
  } else {
    alert("Please fill in all fields.");
  }
}



function loginUser() {
  const username = document.getElementById("name").value;
  const password = document.getElementById("pass").value;

  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  if (username === storedUsername && password === storedPassword) {
   
    sessionStorage.setItem("loggedIn", true);
    sessionStorage.setItem("currentUser", username);
  
    window.location.href = "./index.html";
  } else {
    alert("Invalid username or password.");
  }
}


function resetPassword() {
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("pass").value;
  const confirmPassword = document.getElementById("confirmPass").value;

  const storedEmail = localStorage.getItem("userEmail");

  if (email === storedEmail) {
    if (newPassword === confirmPassword) {
     
      localStorage.setItem("password", newPassword);
      alert("Password reset successful! Please log in.");
     
      window.location.href = "./login.html";
    } else {
      alert("Passwords do not match.");
    }
  } else {
    alert("Email not found.");
  }
}



function checkSession() {
  const isLoggedIn = sessionStorage.getItem("loggedIn");
  if (!isLoggedIn) {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "./login.html";
  }
}



function logout() {
  sessionStorage.clear();
  alert("You have been logged out!");
  window.location.href = "login.html";
}

  