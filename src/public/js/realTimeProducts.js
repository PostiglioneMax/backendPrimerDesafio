const socket = io();
socket.on("updateProducts", (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(li);
    });
});
function addProduct() {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    socket.emit("productAdded", { title, price });
}
