// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();
var assert = require('assert');
router.use(express.json());

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const GeoTagExamples = require('../models/geotag-examples');
const examples = new GeoTagExamples;
/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */




// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var store = new GeoTagStore();
examples.readGeoTags(store);
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { 
    taglist: store.getAllTags(),
    latitude: null,
    longitude: null
  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...


router.post('/tagging', (req, res) => {
  var id = store.makeID();
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var name = req.body.name;
  var hashtag = req.body.hashtag;
  var newTag = new GeoTag(id, name, latitude, longitude, hashtag);

  console.log(store.getAllTags())

  store.addGeoTag(newTag);
  res.render('index', {
    taglist: store.getNearbyGeoTags(latitude,longitude, 100),
    latitude: latitude,
    longitude: longitude
  });
});
/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  const id = store.makeID();
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const Search = req.body.SearchField;
  const list = store.searchNearbyGeoTags(id, latitude, longitude, Search, 100);
    console.log(list);
    res.render('index', {
      taglist: list,
      latitude: latitude,
      longitude: longitude
    });
});
// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */


router.get('/api/geotags', (req,res) => {
  try{
    const searchTerm = req.query['search-term'];
    const latitude = req.query['latitude'];
    const longitude = req.query['longitude'];
    const radius = req.query['radius']
    console.log(latitude);
    console.log(longitude);
    var tags;
    if(latitude && longitude && radius){
      if(searchTerm){
        tags = store.searchNearbyGeoTags(latitude, longitude, searchTerm, radius);
      }else{
        tags = store.getNearbyGeoTags(latitude, longitude, radius);
      }
    }else if(searchTerm){
      tags = store.searchTags(searchTerm);
    }else{
      tags = store.getAllTags();
    }
    
    console.log(tags);
    res.status(200).json(tags);
  }catch(err){
    console.error('Error getting GeoTags:', err);
    res.status(500).json({ error: 'Failed to get GeoTags' });
  }
  
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  try {
    assert(req.body.latitude);
    assert(req.body.longitude);
    assert(req.body.name);
    assert(req.body.hashtag);
    var id = store.makeID();
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var name = req.body.name;
    var hashtag = req.body.hashtag;

    var newTag = new GeoTag(id, name, latitude, longitude, hashtag);
    
    console.log(newTag);
    store.addGeoTag(newTag);

    res.status(201).json(newTag);
  } catch (err) {
    console.error('Error saving GeoTag:', err);
    res.status(500).json({ error: 'Failed to save GeoTag' });
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
  try{
    const id = parseInt(req.params.id);
    const element = store.getByID(id);
    res.status(200).json(element);
  }catch(err){
    console.error('Error getting GeoTag:', err);
    res.status(404).json({ error: 'Failed to find GeoTag' });
  }
});



/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  try{
    const id = parseInt(req.params.id);
    assert(req.body.latitude);
    assert(req.body.longitude);
    assert(req.body.name);
    assert(req.body.hashtag);
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var name = req.body.name;
    var hashtag = req.body.hashtag;

    var newTag = new GeoTag(id, name, latitude, longitude, hashtag);
    store.replace(id, newTag);
    res.status(200).json(newTag);
  }catch(err){
    console.error('Bad Request', err);
    res.status(400).json({error: 'Bad Request'});
  }
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
  try{
    const id = parseInt(req.params.id);
    store.removeGeoTag(id);
    res.status(200).json();
  }catch(err){
    console.error('Bad Request', err);
    res.status(400).json({error: 'Bad Request'});
  }
});
module.exports = router;
