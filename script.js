const url = 'https://hackdavis25.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById("stationSelect");

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

    dropdown.addEventListener("change", e => {
        document.getElementById("textBox").value = e.target.value;
    });

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
                return { name: endpoint.name, type: endpoint.type, data: data };
            })
            .catch(error => ({ name: endpoint.name, error: error.message }))
    );

    Promise.all(fetchPromises)
        .then(responses => {
            let htmlOutput = `<h2 style="font-size: 1.5em;">Station ${stationID} Data</h2>`;

            let temp = null, tideAvailable = false, level = null;

            responses.forEach(result => {
                htmlOutput += `<div class="data-section">
                    <h3 style="font-size: 1.25em;">${result.name}</h3>`;

                if (result.error) {
                    htmlOutput += `<p>No data available</p>`;
                } else if (result.name === 'Tide Prediction') {
                    const tides = result.data?.predictions || [];
                    if (tides.length > 0) {
                        tideAvailable = true;
                        htmlOutput += `<table style="margin: 0 auto; font-size: 0.9em;">
                            <tr><th>Time</th><th>Height (m)</th></tr>`;
                        tides.slice(0, 5).forEach(pred => {
                            htmlOutput += `<tr><td>${pred.t}</td><td>${pred.v}</td></tr>`;
                        });
                        htmlOutput += `</table>`;
                    } else {
                        htmlOutput += `<p>No data available</p>`;
                    }
                } else if (result.data?.data?.length > 0) {
                    const dataPoint = result.data.data[0];
                    if (result.name === 'Water Temperature') temp = parseFloat(dataPoint.v);
                    if (result.name === 'Water Level') level = parseFloat(dataPoint.v);
                    htmlOutput += `
                        <p>Value: ${dataPoint.v} ${result.name === "Water Temperature" ? "°C" : result.data.metadata?.units || ''}</p>
                        <p>Time: ${dataPoint.t}</p>`;
                } else {
                    htmlOutput += `<p>No data available</p>`;
                }

                htmlOutput += `</div>`;
            });

            let summary = "";

            if (temp === null && !tideAvailable && level === null) {
                summary = "No data available. Swimming not recommended. The station number may be invalid or lacks recent updates.";
            } else if (temp !== null && temp >= 20 && temp <= 26 && tideAvailable && level !== null) {
                summary = "Conditions are ideal based on all available data. It is a good day to swim.";
            } else if (temp !== null && temp >= 18 && tideAvailable && level === null) {
                summary = "Water temperature and tide look okay. No water level data. Use some caution.";
            } else if (temp !== null && level !== null && !tideAvailable) {
                summary = "Tide data is missing, but based on water temperature and level, swimming appears to be safe.";
            } else if (tideAvailable && level !== null && temp === null) {
                summary = "Water temperature is unavailable, but tide and level look safe. Use caution but swimming may be fine.";
            } else if (temp !== null && temp < 18) {
                summary = "Water temperature is cold. Swimming may be uncomfortable or unsafe for extended periods.";
            } else {
                summary = "Some data is missing. Please be cautious and consider checking a different station for more complete data.";
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