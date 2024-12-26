const backendUrl = "https://holaqrwebsite.onrender.com";

document.getElementById("customerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    await fetch(`${backendUrl}/customer/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
    });

    loadFishDetails();
});

async function loadFishDetails() {
    const response = await fetch(`${backendUrl}/customer/list`);
    const fishList = await response.json();

    const fishContainer = document.getElementById("fishContainer");
    fishContainer.innerHTML = "";

    fishList.forEach((fish) => {
        const fishCard = document.createElement("div");
        fishCard.className = "fish-card";
        fishCard.innerHTML = `
            <h3>${fish.name}</h3>
            <p><strong>Place:</strong> ${fish.place}</p>
            <p><strong>Date:</strong> ${fish.date}</p>
            <p><strong>QR Code:</strong></p>
            <img src="${fish.qrCode}" alt="QR Code" width="100">
            <p><strong>Photo:</strong></p>
            <img src="${fish.photo}" alt="Photo" width="100">
        `;
        fishContainer.appendChild(fishCard);
    });
}
