const backendUrl = "https://holaqrwebsite.onrender.com"; // Update with your backend URL

// Upload Fish Details
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fishName").value;
    const place = document.getElementById("place").value;
    const date = document.getElementById("date").value;
    const qrCode = document.getElementById("qrCode").value;

    const response = await fetch(`${backendUrl}/admin/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, place, date, qrCode }),
    });

    const result = await response.json();
    alert(result.message);
    loadFishDetails(); // Refresh the list
});

// Load Fish Details
async function loadFishDetails() {
    const response = await fetch(`${backendUrl}/admin/list`);
    const fishList = await response.json();

    const fishTable = document.getElementById("fishTable");
    fishTable.innerHTML = ""; // Clear table

    fishList.forEach((fish) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${fish.name}</td>
            <td>${fish.place}</td>
            <td>${fish.date}</td>
            <td><img src="${fish.qrCode}" alt="QR Code" width="50"></td>
            <td><button onclick="deleteFish(${fish.id})">Delete</button></td>
        `;
        fishTable.appendChild(row);
    });
}

// Delete Fish
async function deleteFish(id) {
    const response = await fetch(`${backendUrl}/admin/delete/${id}`, { method: "DELETE" });
    const result = await response.json();
    alert(result.message);
    loadFishDetails(); // Refresh the list
}

// Load fish details on page load
loadFishDetails();
