const e = require("express");

// const url = 'http://127.0.0.1:5000/api';
const url = 'https://hackdavis25.onrender.com/api';
 
 document.addEventListener('DOMContentLoaded', () => {
     const dropdown = document.getElementById("stationSelect");
 
     // Load and populate station dropdown
     fetch(`${url}/stations`)
         .then(res => res.json())
         .then(data => {
             dropdown.innerHTML = "";
             data.stations
                 .filter(s => s.state === 'CA' && s.tidal === true)
                 .forEach(station => {
                     const opt = document.createElement("option");
                     opt.value = station.id;
                     opt.text = `${station.name} [${station.id}]`;
                     dropdown.appendChild(opt);
                 });
         });
 
     // Autofill textbox when station is selected
     dropdown.addEventListener("change", e => {
         document.getElementById("textBox").value = e.target.value;
     });
 
     // Button click handler
     document.getElementById("submitBtn").addEventListener("click", () => {
         const stationID = document.getElementById("textBox").value;
         fetchTideData(stationID);
     });
 });
 

function fetchTideData(stationID) {
    const endpoints = [
        { type: 'water-level', name: 'Water Level' },
        { type: 'tide-prediction', name: 'Tide Prediction' },
        { type: 'water-temperature', name: 'Water Temperature' }
    ];

    const fetchPromises = endpoints.map(endpoint =>
        fetch(`${url}/${endpoint.type}/${stationID}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                return { type: endpoint.name, data: data };
            })
            .catch(error => ({ type: endpoint.name, error: error.message }))
    );

    Promise.all(fetchPromises)
        .then(responses => {
            let htmlOutput = `<h2 style="font-size: 1.5em;">Station ${stationID} Data</h2>`;

            let temp = null, tide = null, level = null;

            responses.forEach(result => {
                htmlOutput += `<div class="data-section">
                    <h3 style="font-size: 1.25em;">${result.type}</h3>`;
                
                if (result.error) {
                    htmlOutput += `<p>No data available</p>`;
                } else if (result.type === 'Tide Prediction' && result.data?.predictions?.length > 0){
                    tide = true;
                    htmlOutput += `<table style="margin: 0 auto; font-size: 0.9em;">
                        <tr><th>Time</th><th>Height (m)</th></tr>`;
                    result.data.predictions.slice(0, 5).forEach(pred => {
                        htmlOutput += `<tr><td>${pred.t}</td><td>${pred.v}</td></tr>`;
                     });
                     htmlOutput += `</table>`;
                } else if (result.data?.data?.length > 0) {
                    const dataPoint = result.data.data[0];
                    if (result.type === 'Water Temperature') tem = parseFloat(dataPoint.v);
                    if (result.type === 'Water Level') level = parseFloat(dataPoint.v);
                    htmlOutput += `
                        <p>Value: ${dataPoint.v} ${result.type === "Water Temperature" ? "°C" : result.data.metadata?.units || ''}</p>
                        <p>Time: ${dataPoint.t}</p>`;
                } else {
                    htmlOutput += `<p>No data available</p>`;
                }

                htmlOutput += `</div>`;
            });

            let summary = "";
            if (temp === null && tide === null && level === null) {
                summary = "No data available. Please use caution if entering the water.";
            } else if (temp !== null && temp >= 20 && temp <= 26 && tide && level !== null) {
                summary = "It's a great day to swim. Conditions look ideal.";
            } else if (temp !== null && temp >= 18 && tide) {
                summary = "Water is a bit cool, but tide looks safe. Good for a swim.";
            } else if (temp !== null && level !== null) {
                summary = "Tide data is missing, but based on temperature and water level, today seems okay.";
            } else if (tide && level !== null) {
                summary = "Temperature data is missing. Tide and water level look safe.";
            } else {
                summary = "Partial data available. Please swim with caution or check another station.";
            }
 
            htmlOutput += `<div style="margin-top: 20px; background-color: hsl(0, 0%, 11%); color: hsl(199, 92%, 61%); padding: 15px; border-radius: 10px; box-shadow: 2px 2px 8px hsla(0, 0%, 0%, 0.3); font-size: 1em; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                <strong>Swimming Recommendation:</strong><br>${summary}
            </div>`;

            document.getElementById("result").innerHTML = htmlOutput;
        })
        .catch(error => {
            const result = document.getElementById("result");
            result.textContent = "Error fetching data.";
            result.style.color = "red";
            console.error("Fetch error:", error);
        });
}
