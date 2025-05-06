const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkout = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = []

//cart modal open
cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex"
})

//close modal cart
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
})

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// add to cart
function addToCart(name, price) {
    const existItem = cart.find(item => item.name === name)

    if (existItem) {
        existItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//update cart modal
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qty.: ${item.quantity}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)} MTn</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-MZ", {
        style: "currency",
        currency: "MZN"
    })

    cartCounter.innerHTML = cart.length;
}

// remove item
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return;
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
        addressInput.classList.add("border-green-500")
        return
    }

})

checkout.addEventListener("click", () => {

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: "Restaurante fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }


    // enviar pedido atraves da api do whatsapp

    const cartItem = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: ${item.price} MTn |`
        )
    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "847283376"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`)

    caart = []
    updateCartModal()
})

// verificar a hora e manipular o card horario
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 8 && hora < 18
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}