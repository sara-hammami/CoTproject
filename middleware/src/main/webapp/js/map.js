window.randomScalingFactor = function () {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
};

$(document).ready(function () {
    var lyr_osm = new ol.layer.Tile({ title: 'OSM', type: 'base', visible: true, source: new ol.source.OSM() });
    var mapView = new ol.View({
        projection: "EPSG:4326",
        center: [10.1874518, 36.8917497],
        zoom: 9,
    });
    var layersList = [lyr_osm];
    var style = new ol.style.Style({
        fill: new ol.style.Fill({ color: "rgba(255, 100, 50, 0.3)" }),
        stroke: new ol.style.Stroke({ width: 2, color: "rgba(255, 100, 50, 0.8)" }),
        image: new ol.style.Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/6395/6395271.png',
            scale: 0.1
        }),
    });
    var map = new ol.Map({ target: 'map', layers: layersList, view: mapView });

    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: style
    });
    map.addLayer(vectorLayer);

    var accessToken = localStorage.getItem("accessToken");

    function getRequest() {
        return $.ajax({
            url: 'https://smarwastemanagement.ltn:8443/api/sensor',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Authorizationheader
            }
        });
    }

    getRequest().done(function (data) {
        console.log(data);

        for (let i = 0; i < data.length; i++) {
            var coordinates = [data[i].longitude, data[i].latitude];
            console.log(coordinates);

            // Add marker
            var point = new ol.geom.Point(ol.proj.fromLonLat(coordinates));
            var pointFeature = new ol.Feature(point);
            vectorSource.addFeature(pointFeature);

            // Call drawLine function to draw a line between user and bin
            drawLine(mapView.getCenter(), ol.proj.fromLonLat(coordinates), map);
        }
    });

    document.getElementById("button_zoom").addEventListener('click', function () {
        map.getView().fit(map.getView().calculateExtent());
        map.getView().setZoom(0);
    });

    document.getElementById("button_pos").addEventListener('click', function () {
        // User's location
        var geolocation = new ol.Geolocation({
            projection: map.getView().getProjection(),
            tracking: true,
        });

        var marker = new ol.Overlay({
            element: document.getElementById("location"),
            positioning: "center-center",
        });
        map.addOverlay(marker);

        geolocation.on("change:position", function () {
            var userLocation = geolocation.getPosition();
            map.getView().setCenter(userLocation);
            map.getView().setZoom(15);
            marker.setPosition(userLocation);

            // Call drawLine function to draw a line between user and each bin
            getRequest().done(function (data) {
                for (let i = 0; i < data.length; i++) {
                    var binLocation = ol.proj.fromLonLat([data[i].longitude, data[i].latitude]);
                    drawLine(userLocation, binLocation, map);
                }
            });
        });
    });
});

var accessToken = localStorage.getItem("accesstoken");
var mail = localStorage.getItem("mail");
var Authorizationheader = "Bearer " + accessToken;
console.log(accessToken);

// Function to draw line
function drawLine(start, end, map) {
    var routeCoordinates = [start, end];

    // Add route (line) to the map
    var routeLine = new ol.geom.LineString(routeCoordinates);
    var routeFeature = new ol.Feature(routeLine);

    var routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [routeFeature],
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 2,
                color: "rgba(0, 0, 255, 0.8)", // blue color for the line
            }),
        }),
    });

    map.addLayer(routeLayer);
}
