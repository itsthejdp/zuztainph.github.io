const body = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const menuBtn = document.querySelector(".menu-btn");
const cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = ()=>{
  navbar.classList.add("show");
  menuBtn.classList.add("hide");
  body.classList.add("disabled");
}
cancelBtn.onclick = ()=>{
  body.classList.remove("disabled");
  navbar.classList.remove("show");
  menuBtn.classList.remove("hide");
}
window.onscroll = ()=>{
  this.scrollY > 20 ? navbar.classList.add("sticky") : navbar.classList.remove("sticky");
}

//use of objects
let products = [
  {
    name: "Metal Straw",
    tag: "metalstraw",
    price: 4.95,
    inCart: 0
  },
  {
    name: "Rain Catchment System",
    tag: "rainwatercatcher",
    price: 449.95,
    inCart: 0
  },
  {
    name: "Copper Water Bottle",
    tag: "copper",
    price: 4.95,
    inCart: 0
  },
  {
    name: "Rattan Tote Bag",
    tag: "tote",
    price: 2.95,
    inCart: 0
  }
]

let carts = document.querySelectorAll(".add-cart");


for (let i=0; i < carts.length; i++) {
  carts[i].addEventListener("click", function() {
    cartNumbers(products[i]);
    totalCost(products[i]);
  })
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');

  if (productNumbers) {
    document.querySelector('.select-price').textContent = productNumbers;
  }
}

function cartNumbers(product, action) {

  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if( action == "decrease") {
    localStorage.setItem('cartNumbers', productNumbers - 1);
    document.querySelector('.select-price').textContent = productNumbers - 1;
  } else if( productNumbers ) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.select-price').textContent = productNumbers + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector(".select-price").textContent = 1;
  }

  setItems(product);
}

function setItems(product) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if(cartItems != null) {
    if(cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product
      }
    }
    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product
    }
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}


function totalCost(product, action) {
  let cartCost = localStorage.getItem('totalCost');
  console.log(cartCost)
  if(action == "decrease") {
    cartCost = parseInt(cartCost);

    localStorage.setItem('totalCost', cartCost - product.price);
  } else if(cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItem = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  let cartCost = localStorage.getItem('totalCost');

  if ( cartItems && productContainer ) {
    productContainer.innerHTML = '';
    Object.values(cartItem).map(item =>{
      productContainer.innerHTML += `
      <div class="product">
        <i class="fas fa-trash"></i>
        <img src="navimages/${item.tag}.png" />
        <span>${item.name}</span>
      </div>
      <div class="price">$${item.price}</div>
            <div class="quantity">
                <i class="fas fa-minus-circle decrease"></i>
                <span>${item.inCart}</span>
                <i class="fas fa-plus increase"></i>
            </div>
            <div class="total">
                $${item.inCart * item.price},
            </div>
            `;
          });

          productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost}
                </h4>
          `;
    }
  deleteButtons();
  manageQuantity();
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.fa-trash');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');



    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
          productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');

            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart );

            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        });
    }
}


const checkoutButton = document.getElementById("checkout-button")
checkoutButton.addEventListener('click', () => {
  alert("Thank you for shopping at Zuztain!")
});


function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.fa-minus-circle');
    let increaseButtons = document.querySelectorAll('.fa-plus');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);
    console.log(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers( cartItems[currentProduct], "decrease" );
                totalCost( cartItems[currentProduct], "decrease" );
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });
    }

    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            console.log("Increase button");
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);

            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);


                cartItems[currentProduct].inCart += 1;
                cartNumbers( cartItems[currentProduct]);
                totalCost( cartItems[currentProduct]);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();

        })
    }
}

onLoadCartNumbers();
displayCart();
