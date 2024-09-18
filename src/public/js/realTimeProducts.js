const socket = io();

socket.on("productsRealTime", (data) => {
    let productsTag = document.getElementById("productsList");
    let productslist = [];

    data.products.forEach((prod) => {
        productslist += `   <li>
               <strong>Nombre:</strong>
                ${prod.title}<br />
                <strong>Descripción:</strong>
               ${prod.description}<br />
                <strong>Precio:</strong>
                ${prod.price}<br />
                            </li>
            <br />`;
    });

    productsTag.innerHTML = productslist;
});
