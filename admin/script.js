const apiUrl = "https://holaqrwebsite.onrender.com/fish";

async function fetchFishDetails() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayFishDetails(data);
    } catch (error) {
        console.error("Error fetching fish details:", error);
        document.getElementById("fishList").innerHTML = "<p>Unable to load fish details.</p>";
    }
}

function displayFishDetails(fishData) {
    const fishList = document.getElementById("fishList");
    fishList.innerHTML = ""; // Clear existing data

    if (fishData.length === 0) {
        fishList.innerHTML = "<p>No fish details available.</p>";
        return;
    }

    fishData.forEach((fish) => {
        const fishItem = document.createElement("div");
        fishItem.classList.add("fish-item");

        fishItem.innerHTML = `
            <h3>${fish.name}</h3>
            <p><strong>Place of Catch:</strong> ${fish.place}</p>
            <p><strong>Date of Catch:</strong> ${fish.date}</p>
            <img src="${fish.photo}" alt="Fish Photo" class="fish-photo" />
            <img src="${fish.qrCode}" alt="QR Code" class="fish-qr" />
        `;

        fishList.appendChild(fishItem);
    });
}

// Fetch data on page load
fetchFishDetails();
