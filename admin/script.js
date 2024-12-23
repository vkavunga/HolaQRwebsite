const form = document.getElementById("upload-form");
const tableBody = document.querySelector("#fish-details-table tbody");

// Upload Fish Details
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const response = await fetch("http://localhost:3000/admin/upload", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("Fish details uploaded successfully!");
    loadFishDetails();
  } else {
    alert("Failed to upload fish details.");
  }
});

// Fetch Fish Details
async function loadFishDetails() {
  const response = await fetch("http://localhost:3000/admin/list");
  const fishDetails = await response.json();

  tableBody.innerHTML = "";
  fishDetails.forEach((fish) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${fish.name}</td>
      <td>${fish.place}</td>
      <td>${fish.date}</td>
      <td><img src="${fish.qrCode}" alt="QR Code" width="100"></td>
      <td><button onclick="deleteFish(${fish.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Delete Fish Entry
async function deleteFish(id) {
  const response = await fetch(`http://localhost:3000/admin/delete/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Fish details deleted successfully!");
    loadFishDetails();
  } else {
    alert("Failed to delete fish details.");
  }
}

// Load details on page load
loadFishDetails();
