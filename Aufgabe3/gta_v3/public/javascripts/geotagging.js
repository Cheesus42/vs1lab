// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    var latitude = document.getElementById('Tag-latitude').value;
    var longitude = document.getElementById('Tag-longitude').value;
    var discLatitude = document.getElementById('disc-long').value;
    var discLongitude = document.getElementById('disc-lat').value;

    if(latitude == "" || longitude == "" || discLatitude == "" || discLongitude == ""){
        LocationHelper.findLocation((helper) => {
            var longitude = helper.longitude;
            var latitude = helper.latitude;
            document.getElementById('Tag-latitude').value = latitude;
            document.getElementById('Tag-longitude').value = longitude;
            document.getElementById('disc-long').value = longitude;
            document.getElementById('disc-lat').value = latitude;
    
            var map = new MapManager();
            map.initMap(latitude, longitude, 18);
            map.updateMarkers(latitude, longitude);
        })
    }
    

    
    const mapPic = document.getElementById('mapView');
    const Result = document.getElementById('ResultMap');
    const liElements = document.getElementById('discoveryResults');
    //liElements.remove();
    Result.remove();
    mapPic.remove();   
}
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    //alert("Please change the script 'geotagging.js'");
    updateLocation();
});