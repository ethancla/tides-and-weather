// function convert() {
//     const result = document.getElementById("result"); 
//     const url = document.getElementById("url").value.trim();

//     if (!url) {
//         result.textContent = "Error: Please enter a website.";
//         result.style.color = "red";
//         return;
//     }

//     // Send request to Flask backend
//     fetch(`http://127.0.0.1:5000/check?url=${encodeURIComponent(url)}`)
//         .then(response => response.json())
//         .then(data => {
// @@ -17,16 +18,21 @@
//                 result.textContent = "Error: " + data.error;
//                 result.style.color = "red";
//             } else if (data.statistics && data.statistics.co2) {
//                 // ✅ Check if `data.statistics.co2` exists before using it # LMAO
//                 result.textContent = `Carbon Emissions: ${data.statistics.co2}g CO2 per visit`;
//                 result.style.color = "green";
//                 // ✅ Display carbon emissions result
//                 result.innerHTML = `
//                     <strong>Website:</strong> ${data.url} <br>
//                     <strong>Carbon Emissions:</strong> ${data.statistics.co2.grid.grams}g CO2 per visit <br>
//                     <strong>Rating:</strong> ${data.rating} <br>
//                     <strong>Greener Than:</strong> ${Math.round(data.cleanerThan * 100)}% of tested sites
//                 `;
//                 result.style.color = "white"; // Keep it readable
//             } else {
//                 result.textContent = "No carbon footprint data available.";
//                 result.style.color = "orange";
//             }
//         })
//         .catch(error => {
//             result.textContent = "Error fetching data.";
//             result.style.color = "red";
//             console.error("Fetch error:", error);
//         });
particlesJS("particles-js", {
    particles: {
        number: { value: 100, density: {enable: true, value_area: 800}},
        color: { value: "#00ffcc"}, 
        size: { value: 3}, 
        move: {enable: true, speed: 2}
    }, 
    interactivity: {
        events: { onhover: { enable: true, mode: "repulse"}},
        modes: { repulse: {distance: 100}}
    }, 
    retina_detect: true
}); 

