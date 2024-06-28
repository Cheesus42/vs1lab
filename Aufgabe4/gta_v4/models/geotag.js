// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
const store = require('./geotag-store')
class GeoTag {
    id;
    latitude = 0;
    longitude = 0;
    name;
    hashtag;
    constructor(id, name, latitude, longitude, hashtag){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag;
    }


}
module.exports = GeoTag;
