
/* Data produk */
const products = [
    {
        id: 1,
        name: "Risol Mayo Original",
        price: 3000,
        description: "Risol gurih dengan isian mayones, telur, dan smoked beef.",
        src: "./img/original.jpeg"
    },
    {
        id: 2,
        name: "Risol Mayo Keju",
        price: 3500,
        description: "Perpaduan mayones creamy dengan keju yang lezat.",
        image: "img/keju.JPEG"
    },
    {
        id: 3,
        name: "Risol Mayo Spesial",
        price: 4000,
        description: "Isian melimpah dengan smoked beef, telur, mayones, dan keju.",
        image: "img/spesial.JPEG"
    }
];

/* Keranjang belanja */
let cart = [];

/* Format harga rupiah */
function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

/* Menampilkan daftar produk */
function renderProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = products.map(product => `
        <article class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <span class="price">
                        ${formatRupiah(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        + Tambah
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

/* Menambahkan produk ke keranjang */
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

/* Mengubah jumlah produk */
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    renderCart();
}

/* Menghapus produk dari keranjang */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

/* Menghitung total harga */
function calculateTotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

/* Menampilkan isi keranjang */
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatRupiah(calculateTotal());

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Keranjang masih kosong.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>
                    ${formatRupiah(item.price)} × ${item.quantity}
                    = ${formatRupiah(item.price * item.quantity)}
                </p>
            </div>

            <div class="quantity-controls">
                <button
                    onclick="changeQuantity(${item.id}, -1)"
                    aria-label="Kurangi jumlah"
                >−</button>

                <span>${item.quantity}</span>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                    aria-label="Tambah jumlah"
                >+</button>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})"
                    aria-label="Hapus produk"
                >Hapus</button>
            </div>
        </div>
    `).join("");
}

/* Memproses pesanan melalui WhatsApp */
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
        return;
    }

    const customerName = document
        .getElementById("customer-name")
        .value.trim();

    const customerAddress = document
        .getElementById("customer-address")
        .value.trim();

    if (!customerName || !customerAddress) {
        alert("Silakan isi nama dan alamat pengiriman terlebih dahulu.");
        return;
    }

    const orderDetails = cart.map(item =>
        `- ${item.name} (${item.quantity} pcs) = ${
            formatRupiah(item.price * item.quantity)
        }`
    ).join("\n");

    const message = [
        "Halo Risolicious, saya ingin memesan:",
        "",
        orderDetails,
        "",
        `Total: ${formatRupiah(calculateTotal())}`,
        "",
        `Nama: ${customerName}`,
        `Alamat: ${customerAddress}`,
        "",
        "Mohon konfirmasi pesanan saya. Terima kasih!"
    ].join("\n");

    // GANTI dengan nomor WhatsApp penjual.
    // Gunakan kode negara 62 tanpa tanda + atau angka 0 di depan.
    const phoneNumber = "+6283866730296";

    const whatsappURL =
        `https://wa.me/${+6283866730296}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

/* Menjalankan fungsi saat halaman dibuka */
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderCart();

    document
        .getElementById("checkout-btn")
        .addEventListener("click", checkout);
});
