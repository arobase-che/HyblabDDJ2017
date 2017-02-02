'use strict';

const CIRCLES_FILL_COLOR = '#666666';
const CIRCLES_MOUSE_OVER_FILL_COLOR = '#222222';
const CIRCLES_STROKE_OPACITY = 0;
const CIRCLES_FILL_OPACITY = 0.5;


function drawCircles(json) {

    // Récupération de la carte et des cercles
    var mapSVG = document.getElementById("map").getSVGDocument().children[0];
    var circles = [];
    
    json.forEach(function(reg) {
        var newCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

        Object.keys(reg).forEach(function(attr) {
            newCircle.setAttribute(attr, reg[attr]);
        });
        newCircle.setAttribute("fill", CIRCLES_FILL_COLOR);
        newCircle.setAttribute("stroke-opacity", CIRCLES_STROKE_OPACITY);
        newCircle.setAttribute("fill-opacity", CIRCLES_FILL_OPACITY);
        
        mapSVG.appendChild(newCircle);
        circles.push(newCircle);
    });
	
    // Gestion des évènements
	circles.forEach(function(circle) {
		circle.style.cursor = 'pointer';
        
        circle.addEventListener('mouseover', function(evt) {
            evt.target.setAttribute('fill', CIRCLES_MOUSE_OVER_FILL_COLOR);
        });
        
        circle.addEventListener('mouseout', function(evt) {
            evt.target.setAttribute('fill', CIRCLES_FILL_COLOR);
        });
        
		circle.addEventListener('click', function(evt) {
			document.getElementById(evt.target.id).scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
}


// Fonction principale
window.onload = function() {

    // Récupération des données depuis le fichier JSON
    fetch('data/regions.json')
        .then(function(response) {
            if(response.ok) {
                return response.json();
            } else {
                return {data: "JSON file not found"};
            }
        })
        .catch(function(error) {
            return {data: "Invalid JSON"};
        })
        .then(drawCircles);
}
