const backendUrl = "https://holaqrwebsite.onrender.com";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fishName").value;
    const place = document.getElementById("place").value;
    const date = document.getElementById("date").value;
    const qrCode = document.getElementById("qrCode").value;
    const photo = document.getElementById("photo").value;

    const response = await fetch(`${backendUrl}/admin/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, place, date, qrCode, photo }),
    });

    const result = await response.json();
    alert(result.message);
    loadFishDetails();
});

async function loadFishDetails() {
    const response = await fetch(`${backendUrl}/admin/list`);
    const fishList = await response.json();

    const fishTable = document.getElementById("fishTable");
    fishTable.innerHTML = "";

    fishList.forEach((fish) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${fish.name}</td>
            <td>${fish.place}</td>
            <td>${fish.date}</td>
            <td><img src="${fish.qrCode}" alt="QR Code" width="50"></td>
            <td><img src="${fish.photo}" alt="Photo" width="50"></td>
            <td><button onclick="deleteFish(${fish.id})">Delete</button></td>
        `;
        fishTable.appendChild(row);
    });
}

async function deleteFish(id) {
    const response = await fetch(`${backendUrl}/admin/delete/${id}`, { method: "DELETE" });
    const result = await response.json();
    alert(result.message);
    loadFishDetails();
}

loadFishDetails();
