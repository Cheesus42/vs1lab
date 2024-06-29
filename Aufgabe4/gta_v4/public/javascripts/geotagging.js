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
var map;
function updateLocation(map) {
    var latitude = document.getElementById('Tag-latitude').value;
    var longitude = document.getElementById('Tag-longitude').value;
    var discLatitude = document.getElementById('disc-long').value;
    var discLongitude = document.getElementById('disc-lat').value;

    if(latitude == "" || longitude == "" || discLatitude == "" || discLongitude == ""){
        LocationHelper.findLocation((helper, map) => {
            const mapElement = document.getElementById("map");
            const tagsJson = mapElement.getAttribute("data-tags");
            let ttags = [];
            if (tagsJson){
                ttags = JSON.parse(tagsJson);
            }

            var longitude = helper.longitude;
            var latitude = helper.latitude;
            document.getElementById('Tag-latitude').value = latitude;
            document.getElementById('Tag-longitude').value = longitude;
            document.getElementById('disc-long').value = longitude;
            document.getElementById('disc-lat').value = latitude;
            console.dir(ttags);
            map.initMap(latitude, longitude, 18);
            map.updateMarkers(latitude, longitude, ttags);
        }, map)
    }
    
    const mapPic = document.getElementById('mapView');
    const Result = document.getElementById('ResultMap');
    Result.remove();
    mapPic.remove();   
}
async function handleTagging(event){
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const name = formData.get('name');
    const hashtag = formData.get('hashtag');

    const geoTag = {
        latitude: latitude,
        longitude: longitude,
        name: name,
        hashtag: hashtag
    };

    try{
        const response = await fetch('api/geotags/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(geoTag)
        });

        if (!response.ok) {
            throw new Error('Failed to save GeoTag');
        }

        const result = await response.json();
        console.dir(result);
        map.addTagToMap(geoTag);
        const discoveryWrapper = document.getElementById('discoveryResults');
        const newLI = document.createElement('li');
        newLI.textContent = name + ' ( ' + latitude + ',' + longitude + ')' + hashtag;
        discoveryWrapper.appendChild(newLI);
    }catch(err){
        console.dir(err);
    }
}
async function handleDiscovery(event){
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');

    const searchForm = event.target;
    const formData2 = new FormData(searchForm);
    const searchTerm = formData2.get('SearchField')
    const encTerm = encodeURIComponent(searchTerm);
    try{
        const response = await fetch(`/api/geotags?search-term=${encTerm}&latitude=${latitude}&longitude=${longitude}&radius=${15}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok){
            throw new Error('Failed to get Geotag');
        }

        const result = await response.json();
        console.dir(result);
        const discoveryWrapper = document.getElementById('discoveryResults');
        discoveryWrapper.innerHTML = '';
        for(let i = 0; i < result.length; i++){
            const newLI = document.createElement('li');
            newLI.textContent = result[i].name + ' ( ' + result[i].latitude + ',' + result[i].longitude + ')' + result[i].hashtag;
            discoveryWrapper.appendChild(newLI);
        }
        map.updateMarkers(latitude, longitude, result);
    }catch(err){
        console.dir(err);
    }
}
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    map = new MapManager();
    updateLocation(map);
    const tagForm = document.getElementById('tag-form');
    const discForm = document.getElementById('discoveryFilterForm');

    if(tagForm){
        tagForm.addEventListener('submit', handleTagging);
    }
    if(discForm){
        discForm.addEventListener('submit', handleDiscovery);
    }
});