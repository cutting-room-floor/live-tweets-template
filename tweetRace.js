var tweetRace = {};


// Array for tweets queue
tweetRace.tweets = [];

// Start the race with settings from tweets[]
tweetRace.start = _.throttle(function(){
    $('th.first').text(tweets[0] + ' tweets');
    $('th.second').text(tweets[1] + ' tweets');
    tweetRace.getTweets(tweets[0] + ' OR ' + tweets[1], tweets[2]);
}, 2000);
    
tweetRace.params = {
    rpp: 100,
    callback: 'callback',
    result_type: 'recent'
};

// Fetch tweets from Twitter
tweetRace.getTweets = function(query, geo) {
    tweetRace.params.q = query;
    tweetRace.params.geocode = geo;    

    params = '?' + _.map(tweetRace.params, function(num, key) {
        return key + "=" + num;
    }).join('&');
        
    reqwest({
        url: 'http://search.twitter.com/search.json' + params,
        type: 'jsonp',
        jsonCallback: 'callback',
        success: function(d) {
            tweetRace.processTweet(d);
        }
    });
};


// Extract relevant data from tweets
tweetRace.processTweet = function(d) {
    _.each(d.results, function(element, index) {
        if (element.geo && element.geo.type === 'Point') {
            var lat = element.geo.coordinates[0], // Twitter seems to reverse the
                lon = element.geo.coordinates[1]; // order of geojson coordinates
                
        } else if (element.location && element.location.indexOf(': ') > 0) {
            var coords = element.location.split(': ')[1],
                $lat = coords.split(',')[0] || 0,
                $lon = coords.split(',')[1] || 0;

            if (!isNaN(parseFloat($lat)) && !isNaN(parseFloat($lon))) {
                var lon = parseFloat($lon),
                    lat = parseFloat($lat);
            }
        }
        
        if (lat && lon) {
            tweetRace.tweets.push({
                lon: lon,
                lat: lat,
                time: formatDate(new Date(element.created_at)),
                text: element.text,
                user: '@' + element.from_user,
                category: (element.text.toLowerCase().indexOf(tweets[0].toLowerCase()) >= 0) ? 'first' : 'second'
            });
        }
    });
    
    tweetRace.params.since_id = d.max_id_str;
    tweetRace.map();
    
    function formatDate(d) {
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var suffix = "AM";
        
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours == 0) hours = 12;
        if (minutes < 10) minutes = "0" + minutes;
        
        return hours + ":" + minutes + " " + suffix;
    }
};

// Update counters
tweetRace.counters = function() {
    var first = $('.mmg-first').length,
        second = $('.mmg-second').length;
    
    if (first > 0) {
        $('td.first').text(first);
    } else {
        $('td.first').text('--');
    }
    if (second > 0) {
        $('td.second').text(second);
    } else {
        $('td.second').text('--');
    }
};


// Map the tweets
tweetRace.map = function() {
    var points = { 'type': 'FeatureCollection',
        'features': []
    };

    _.each(_.rest(tweetRace.tweets, tweetRace.last || 0), function(tweet) {
        points.features.push({
            type: 'Feature',
            geometry: { 
                type: 'Point',
                coordinates: [tweet.lon, tweet.lat] 
            },
            properties: {
                time: tweet.time,
                text: tweet.text,
                user: tweet.user,
                category: tweet.category
            }
        });
    });
    
    tweetRace.last = tweetRace.tweets.length;
    
    if (MM_map.tweetLayer) {
        MM_map.tweetLayer.geojson(points);
    } else {
        MM_map.tweetLayer = mmg().factory(function(x) {
            var d = document.createElement('div'),
                overlay = document.createElement('div'),
                arrow = document.createElement('div'),
                user = document.createElement('div'),
                time = document.createElement('div');
                
            d.className = 'mmg mmg-' + x.properties.category;
            overlay.innerHTML = x.properties.text;
            overlay.className = 'overlay';
            user.innerHTML = x.properties.user;
            user.className = 'user';
            time.innerHTML = x.properties.time;
            time.className = 'time';
            arrow.className = 'arrow-down';
            overlay.appendChild(user);
            overlay.appendChild(time);
            d.appendChild(overlay);
            d.appendChild(arrow);
            
            return d;
        }).geojson(points);
        MM_map.addLayer(MM_map.tweetLayer);
    }
    MM_map.setCenter({
        lat: MM_map.getCenter().lat, 
        lon: MM_map.getCenter().lon
    });

    tweetRace.counters();
    if (!tweetRace.stop) tweetRace.start();
};


// Pause / play button
$('#stop').click(function(e){
    e.preventDefault();
    $(this).toggleClass('start');
    if (tweetRace.stop) {
        $(this).text('Pause');
        tweetRace.stop = false;
        tweetRace.start();
    } else { 
        $(this).text('Start');
        tweetRace.stop = true;
    }
});
