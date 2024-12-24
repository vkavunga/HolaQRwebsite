const backendUrl = "https://holaqrwebsite.onrender.com"; // Update with your backend URL

// Load Fish Details
async function loadFishDetails() {
    const response = await fetch(`${backendUrl}/admin/list`);
    const fishList = await response.json();

    const fishContainer = document.getElementById("fishContainer");
    fishContainer.innerHTML = ""; // Clear container

    fishList.forEach((fish) => {
        const fishCard = document.createElement("div");
        fishCard.className = "fish-card";
        fishCard.innerHTML = `
            <h3>${fish.name}</h3>
            <p><strong>Place of Catch:</strong> ${fish.place}</p>
            <p><strong>Date of Catch:</strong> ${fish.date}</p>
            <p><strong>QR Code:</strong></p>
            <img src="${fish.qrCode}" alt="QR Code" width="100">
        `;
        fishContainer.appendChild(fishCard);
    });
}

// Load fish details on page load
loadFishDetails();
