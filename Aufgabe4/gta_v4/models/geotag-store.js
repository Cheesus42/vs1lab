// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    #TagArray = [];

    // TODO: ... your code here ...
    getAllTags(){
        return this.#TagArray;
    }
    addGeoTag(geotag) {
        this.#TagArray.push(geotag);
    }

    removeGeoTag(tag){
        var index = this.#TagArray.indexOf(tag);
        if (index > -1) {
            this.#TagArray.splice(index, 1);
        }
    }
    getNearbyGeoTags(lat,long, radius){
        const countTag = this.#TagArray.length;
        var TagInRadius = [];
        
        var data = {"keyword": 123};

        for (let i = 0; i < countTag; i++) {
            const thisLon = this.#TagArray[i].longitude;
            const thisLat= this.#TagArray[i].latitude;
            if(this.#calcDistance(lat, long, thisLat, thisLon) < radius){
                //TagInRadius[TagInRadius.length] = this.#TagArray[i];
                TagInRadius.push(this.#TagArray[i]);
            }
        }
        //console.log(TagInRadius);
        return TagInRadius;
    }
    searchNearbyGeoTags(lat, long, key, radius){
        //substream
        const countTag = this.#TagArray.length;
        var TagInRadius = [];
        if (key != undefined){

            for (let i = 0; i < countTag; i++) {
                const thisLon = this.#TagArray[i].longitude;
                const thisLat = this.#TagArray[i].latitude;
                
                const isKey = (this.#TagArray[i].name.toLowerCase().includes(key.toLowerCase())) || (this.#TagArray[i].hashtag.toLowerCase().includes(key.toLowerCase()));
                console.log(isKey);
                console.log(this.#TagArray[i].name);
                console.log(this.#TagArray[i].hashtag);
                console.log(key);
                if((this.#calcDistance(lat, long, thisLat, thisLon) < radius) && isKey){
                    TagInRadius.push(this.#TagArray[i]);
                }
            }
        }
        return TagInRadius;
    }
    #calcDistance(lat1, lon1, lat2, lon2){
        //Haversine
        const R = 6371;

        const deltaLat = (lat1-lat2) * (Math.PI / 180);
        const deltaLon = (lon1-lon2) * (Math.PI / 180);

        const a = Math.pow(Math.sin(deltaLat / 2), 2) + 
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.pow(Math.sin(deltaLon / 2), 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const distance = R * c;
        return distance;
    }
}

module.exports = InMemoryGeoTagStore
