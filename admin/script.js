const apiBase = "https://holaqrwebsite.onrender.com";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch(`${apiBase}/admin/upload`, { method: "POST", body: formData });
        const result = await response.json();
        alert(result.message);
        fetchFishList();
    } catch (error) {
        console.error("Error:", error);
    }
});

async function fetchFishList() {
    try {
        const response = await fetch(`${apiBase}/admin/list`);
        const data = await response.json();
        const list = document.getElementById("list");
        list.innerHTML = data
            .map(
                (fish) => `
                <div>
                    <h3>${fish.name}</h3>
                    <p>${fish.place} - ${fish.date}</p>
                    <img src="${apiBase}${fish.qrCode}" alt="QR Code" width="100">
                    <img src="${apiBase}${fish.photo}" alt="Fish Photo" width="100">
                    <button onclick="deleteFish(${fish.id})">Delete</button>
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteFish(id) {
    try {
        await fetch(`${apiBase}/admin/delete/${id}`, { method: "DELETE" });
        alert("Fish deleted successfully!");
        fetchFishList();
    } catch (error) {
        console.error("Error:", error);
    }
}

fetchFishList();
