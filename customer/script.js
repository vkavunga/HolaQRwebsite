const apiBase = "https://holaqrwebsite.onrender.com";

document.getElementById("customerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    try {
        await fetch(`${apiBase}/customer/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone }),
        });
        alert("Details saved. Viewing fish details...");
        fetchFishList();
    } catch (error) {
        console.error("Error:", error);
    }
});

async function fetchFishList() {
    try {
        const response = await fetch(`${apiBase}/customer/list`);
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
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error:", error);
    }
}
