document.getElementById("customer-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    // Retrieve email and phone input
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
  
    if (!email || !phone) {
      alert("Please fill in all fields!");
      return;
    }
  
    // Fetch fish details from backend
    const fishDetailsContainer = document.getElementById("fish-details-container");
    fishDetailsContainer.innerHTML = "Loading fish details...";
  
    try {
      const response = await fetch("http://localhost:3000/admin/list");
      if (!response.ok) throw new Error("Failed to fetch fish details");
  
      const fishDetails = await response.json();
      fishDetailsContainer.innerHTML = ""; // Clear the container
  
      // Display each fish detail as a card
      fishDetails.forEach((fish) => {
        const fishCard = document.createElement("div");
        fishCard.classList.add("fish-card");
        fishCard.innerHTML = `
          <img src="${fish.qrCode}" alt="QR Code">
          <h3>${fish.name}</h3>
          <p><strong>Place of Catch:</strong> ${fish.place}</p>
          <p><strong>Date of Catch:</strong> ${fish.date}</p>
        `;
        fishDetailsContainer.appendChild(fishCard);
      });
    } catch (error) {
      fishDetailsContainer.innerHTML = `<p>Error loading fish details: ${error.message}</p>`;
    }
  });
  
