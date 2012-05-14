# Live Tweets

This template demonstrates layering live data from an API feed (in this case Twitter) on a custom map from MapBox. It's designed to make it easy to get started and should be hacked up at will for your project.

## About Map Site Templates

[Map Site templates](http://mapbox.com/map-sites) from MapBox are a way to jumpstart building a map-based web feature. The map-site templates bundles common html and css formatting with reusable javascript components. 

To build a project based on this template, fork this repository, edit the html content and css, and alter the configuration script.

To make your custom base map, [sign up for MapBox](http://mapbox.com/plans/) and [create a map](http://mapbox.com/hosting/creating/).


## Using this template

Edit the content by adjusting, removing, or adding to `index.html`. This is the main markup document with the content and layout for the map-site.

Adjust the design by editing the `style.css` file and adding any additional supporting structure to `index.html`.

Set the map features by writing a configuration script at the bottom of `index.html`. 


## HTML layout

The html markup for the template is in `index.html`. It's a simple html page layout. Generally, you'll want to change the content elements like `title`, `h1`, `img#logo` and `div#about`.


## CSS styles

Most of the hard work on a map site build is template design implemented through CSS. This template by default is simple and clean so you can modify or replace it. This design and be completely overridden by applying new CSS styles or changing the exisiting rules in `style.css`.

CSS rules are set in two files:

- `style.css` contains all the layout and typographic styles as well as some overridden styles for map controls, and a [reset stylesheet](http://meyerweb.com/eric/tools/css/reset/). Implement your design by editing this file.
- `map.css` holds the default map styles from tiles.mapbox.com embeds.


## Javascript interaction

All of the external javascript libraries to make the map interactive and connect it to MapBox are stored in the `ext` directory. For this template, we're using [Modest Maps](http://modestmaps.com/) and [Wax](http://mapbox.com/wax) to make the map interactive, [Easey](https://github.com/mapbox/easey) for smooth aninmated panning and zooming, and [MMG](http://mapbox.com/mmg/) for adding markers to the map based on [geojson](http://www.geojson.org/)-formatted data.

An internal javascript library, `script.js`, abstracts common map settings, and `tweetRace.js` is the library we put together to take two terms and compare their results in Twitter searches.


### Map configuration

The map is added to the `<div>` container in `index.html` with `id="map"`. Styles to lay out the map container come from `class="map"`.

```html
<div id="map" class="map"></div>
```

At the bottom of the `index.html` document, we set up the map. The `id` of the container is the first argument (`'map'`), and an object of options is the second argument. The third arugement is the name of an optional callback function, which we use to start the `tweetRace.js` main function, once the map is loaded. 

The only required option is `api`, and it should contain the API URL from MapBox. After you create a new map through your MapBox account, click `embed` on the `info` tab and copy the API URL.

```js
var main = Map('map', { 
    api: 'http://a.tiles.mapbox.com/v3/mapbox.map-hv50mbs9.jsonp' 
});
```

The map options object can take several options:

- `api` The MapBox API URL from the `embed` button on your map:
  ![](http://mapbox.com/images/hosting/embedding-4.png)
- `center` An object of `{ lat: ##, lon: ##, zoom: ## }` that defines the map's initial view. If not is provided, the default center set from MapBox will be used
- `zoomRange` An array of `[##, ##]` where the first element is the minimum zoom level and the second is the max
- `features` An array of additional features for the map

The features object may contain any of the following:

- `zoomwheel` Use the scroll wheel on the mouse to zoom the map
- `tooltips` or `movetips` For layers with interactive overlays, display fixed `tooltips` or `movetips`, which are overlays the follow the cursor
- `zoombox` Allow uses to zoom to a bounding box by holding the shift key and dragging over the map
- `zoompan` Show zoom controls on the map
- `legend` Show a legend on the map. Legends from multiple layers will stack on top of each other
- `share` Show a share button on the map with Twitter, Facebook links and an embed code for the map. The embedded view of the map will add a `class="embed"` to the `<body>` element of the page for easy theming. For instance, by default the embed layout is a full screen map with the layer switcher over it on the left. The header and content are hidden.
- `bwdetect` Automatically detect low bandwidth contections and decrease the quality of the map images to accomodate

A map with all the options and a callback function would look like this:

```js
var main =  Map('map', {
    api: 'http://a.tiles.mapbox.com/v3/mapbox.map-hv50mbs9.jsonp',
    center: {
        lat: 38.8850033656251,
        lon: -77.01439615889109,
        zoom: 14
    },
    zoomRange: [0, 15],
    features: [
        'zoomwheel',
        'tooltips', // or 'movetips'
        'zoombox',
        'zoompan',
        'legend',
        'share',
        'bwdetect'
    ]
}, tweetRace.start);
```

### tweetRace.js

Live tweets are pulled in through a recursive function in `tweetRace.js` that fetches the tweets from Twitter's API and processes them to be mapped. Initialize the tweet race with the following:

```js
var tweets = [
    'work',             // First term
    'play',             // Second term
    '39,-98,1500mi'     // search location and radius
];
```

`tweetRace.js` supports searching for two terms and mapping the results. The sidebar lists the names of the terms and has a class for each term applied to it to make it easy to style custom background images, like we've done for work and play. Add classes for your search terms to your CSS to style this section.

The internals of `tweetRace.js` mostly deal with parsing the Twitter API to filter for tweets with longitude and latitude coordinates. See the [inline documentation] for more information.


## Further Reading

* [MapBox API](http://mapbox.com/hosting/api/)
* [MapBox Wax](http://mapbox.com/wax/)
* [MapBox MMG](http://mapbox.com/mmg/)
* [MapBox Easey](http://mapbox.com/easey/)
* [Modest Maps](http://modestmaps.com/)
* [jQuery](http://jquery.com/)