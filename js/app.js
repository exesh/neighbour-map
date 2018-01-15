//Resopnsive menu toggle script for mobile devices
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#drawer');
menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    menu.style.display = "none";
    e.stopPropagation();
});
main.addEventListener('click', function() {
    menu.style.display = "block";
    drawer.classList.remove('open');
});

//Creating the map
var map,
//Create a new blank array for all the listing markers.
markers = [],
articleInfowindow = [];

function initMap() {
    //Create a styles array to use with the map.
    var styles = [{
        "stylers": [
            {
              "saturation": -100
            },
            {
                "gamma": 1
            }
        ]
    }];

    //Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 53.9045398, lng: 27.5615244 },
        zoom: 12,
        styles: styles,
        mapTypeControl: false
    });

    //My locations list
    var locations = [
        { title: 'Minsk National Library', wikisearch: 'Minsk+Library', location: { lat: 53.93133676, lng: 27.64605784 } },
        { title: 'Minsk-Arena', wikisearch: 'Minsk Arena', location: { lat: 53.93618766, lng: 27.4820354 } },
        { title: 'Minsk Gorky Park', wikisearch: 'Minsk Park', location: { lat: 53.9030228, lng: 27.5696354 } },
        { title: 'Minsk Trinity Hill', wikisearch: 'Minsk seightseeng', location: { lat: 53.90797125, lng: 27.55565667 } },
        { title: 'Minsk Holy Spirit Cathedral', wikisearch: 'Minsk spirit', location: { lat: 53.90352477, lng: 27.55612338 } },
        { title: 'Minsk National Opera and Ballet', wikisearch: 'Minsk opera', location: { lat: 53.91061301, lng: 27.56167555 } }
    ];

    var infowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('D91E29');
    var highlightedIcon = makeMarkerIcon('FEEC01');

    //WikiPedia API data
    var wikiTimeOut = setTimeout(function() { console.log('Wikipedia no response'); }, 3000);
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + "Minsk" + "&prop=revisions&rvprop=content&format=json",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "jsonp",
        success: function(data, textStatus, jqXHR) {
            var articleList = data[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var wikiUrl = 'https://en.wikipedia.org/wiki/' + articleStr;
                articleInfowindow.push('<li><a href="' + wikiUrl + '" target="_blank">' + articleStr + '</a></li>');
            }
            clearTimeout(wikiTimeOut);
        },
        error: function(errorMessage) {}
    });

    //Creating markers
    locations.forEach(function(loc){
        // Get the position from the location array.
        var position = loc.location;
        var title = loc.title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });

        //Push the marker to our array of markers.
        markers.push(marker);

        //Create an onclick event to open the infowindow at each marker and bounce function.
        marker.addListener('click', function() {
            var self = this;
            populateInfoWindow(this, infowindow);
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.setAnimation(null);
            }, 2100);
        });
        //Two event listeners - one for mouseover, one for mouseout,
        //to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    });

    ko.applyBindings(new ListViewModel());
}

//This function populates the infowindow
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        var content = '<div>' + marker.title + '</div>' + '<br>' + 'More about Minsk on Wiki:';
        // infowindow.setContent('<div>' + marker.title + '</div>');
        for (var i = 0; i < articleInfowindow.length && i < 5; i++) {
            content = content + articleInfowindow[i];
        }
        infowindow.setContent(content);
        infowindow.open(map, marker);
    }
}

//This function takes in a COLOR, and then creates a new marker
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

//Constructor for ViewModel
var Mapdata = function(data) {
    this.currentMap = ko.observable(data);
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    data.setMap(map);
};

//ViewModel
function ListViewModel() {
    var self = this;
    this.mapList = ko.observableArray([]);
    for (var i = 0; i < markers.length; i++) {
        self.mapList.push(new Mapdata(markers[i]));
    }
    this.mapChoice = function(obj) {
        obj.currentMap().setMap(map);
        map.panTo(obj.position());
        obj.currentMap().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            obj.currentMap().setAnimation(null);
        }, 1400);
    };

    //This function takes the object from selected drop-down list by user
    //and makes visible only selected marker
    this.mapSelected = function(obj) {
        for (var i = 0; i < self.mapList().length; i++) {
            markers[i].setMap(null);
        }
        obj.currentMap().setMap(map);
        map.panTo(obj.position());
    };
}