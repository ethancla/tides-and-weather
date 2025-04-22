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

            responses.forEach(result => {
                htmlOutput += `<div class="data-section">
                    <h3 style="font-size: 1.25em;">${result.type}</h3>`;
                
                if (result.error) {
                    htmlOutput += `<p>No data available</p>`;
                } else if (result.type === 'Tide Prediction' && result.data?.predictions?.length > 0){
                    htmlOutput += `<table style="margin: 0 auto; font-size: 0.9em;">
                        <tr><th>Time</th><th>Height (m)</th></tr>`;
                    result.data.predictions.slice(0, 5).forEach(pred => {
                        htmlOutput += `<tr><td>${pred.t}</td><td>${pred.v}</td></tr>`;
                     });
                     htmlOutput += `</table>`;
                } else if (result.data?.data?.length > 0) {
                    const dataPoint = result.data.data[0];
                    htmlOutput += `
                        <p>Value: ${dataPoint.v} ${result.data.metadata?.units || ''}</p>
                        <p>Time: ${dataPoint.t}</p>`;
                } else {
                    htmlOutput += `<p>No data available</p>`;
                }

                htmlOutput += `</div>`;
            });

            document.getElementById("result").innerHTML = htmlOutput;
        })
        .catch(error => {
            const result = document.getElementById("result");
            result.textContent = "Error fetching data.";
            result.style.color = "red";
            console.error("Fetch error:", error);
        });
}
