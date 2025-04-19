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


const result = document.getElementById("result")

const button = document.getElementById("submitBtn").addEventListener("click", () => {
    result.textContent = "Hello World!";
}); 

