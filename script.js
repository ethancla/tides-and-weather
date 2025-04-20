// const { type } = require("express/lib/response");

// function fetchTideData(stationID) {
//     const url = 'http://127.0.0.1:5000/api'

//     const endpoints = [
//         { type: 'water-level', name: 'Water Level' },
//         { type: 'tide-prediction', name: 'Tide Prediction' },
//         { type: 'water-temperature', name: 'Water Temperature'}
//     ]

//     const fetchPromises = endpoints.map(endpoint => 
//         fetch(`${url}/${endpoints.type}/${stationID}`)
//             .then(response => response.json())
//             .then(data => ({type: endpoint.name, data: data}))
//             .catch(error => ({ type: endpoint.name, error: error.message }))
//     )

//     // Send request to Flask backend
//     Promise.all(fetchPromises)
//         .then(responses => {
//             let htmlOutput = `<h2>Station ${stationID} Data</h2>`;

//             responses.forEach(result => {
//                 htmlOutput += `<div class="data-section">
//                     <h3>${result.type}</h3>`;
                
//                 if (result.error || (result.data && result.data.error)) {
//                     htmlOutput += `<p class="error">Error: ${result.error || result.data.error}</p>`;
//                 } else {
//                     // Format based on data type
//                     if (result.data && result.data.data && result.data.data.length > 0) {
//                         const dataPoint = result.data.data[0];
//                         htmlOutput += `
//                             <p>Value: ${dataPoint.v} ${result.data.metadata?.units || ''}</p>
//                             <p>Time: ${dataPoint.t}</p>`;
//                     } else {
//                         htmlOutput += `<p>No data available</p>`;
//                     }
//                 }
                
//                 htmlOutput += `</div>`;
//             });
            
//             resultElement.innerHTML = htmlOutput;
//         })
//         .catch(error => {
//             result.textContent = "Error fetching data.";
//             result.style.color = "red";
//             console.error("Fetch error:", error);
//         }
//     );
// }


function fetchTideData(stationID) {
    const url = 'http://127.0.0.1:5000/api';

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

                if (result.error || (result.data && result.data.error)) {
                    htmlOutput += `<p class="error">Error: ${result.error || result.data.error}</p>`;
                } else {
                    if (result.data && result.data.data && result.data.data.length > 0) {
                        const dataPoint = result.data.data[0];
                        htmlOutput += `
                            <p>Value: ${dataPoint.v} ${result.data.metadata?.units || ''}</p>
                            <p>Time: ${dataPoint.t}</p>`;
                    } else {
                        htmlOutput += `<p>No data available</p>`;
                    }
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
