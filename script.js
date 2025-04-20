function fetchTideData(stationID) {
    // const url = 'http://127.0.0.1:5000/api';
    const url = 'https://hackdavis25.onrendor.com/api';

    const endpoints = [
        { type: 'water-level', name: 'Water Level' },
        { type: 'tide-prediction', name: 'Tide Prediction' },
        { type: 'water-temperature', name: 'Water Temperature' }
    ];

    const fetchPromises = endpoints.map(endpoint =>
        fetch(`${url}/${endpoint.type}/${stationID}`)
            .then(response => response.json())
            .then(data => ({ type: endpoint.name, data: data }))
            .catch(error => ({ type: endpoint.name, error: error.message }))
    );

    Promise.all(fetchPromises)
        .then(responses => {
            let htmlOutput = `<h2>Station ${stationID} Data</h2>`;

            responses.forEach(result => {
                htmlOutput += `<div class="data-section">
                    <h3>${result.type}</h3>`;

                const errorMessage = result.error || result.data?.error;
                if (errorMessage) {
                    htmlOutput += `<p class="error">Error: ${errorMessage}</p>`;
                } else if (result.data?.data?.length > 0){
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
