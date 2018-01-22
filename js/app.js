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
articleInfowindow = [],
articleListReady = [];

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
        { num : 0, title: 'Minsk National Library', wikisearch: 'Minsk Library', location: { lat: 53.93133676, lng: 27.64605784 } },
        { num : 1, title: 'Minsk-Arena', wikisearch: 'Minsk Arena', location: { lat: 53.93618766, lng: 27.4820354 } },
        { num : 2, title: 'Minsk Gorky Park', wikisearch: 'Minsk Park', location: { lat: 53.9030228, lng: 27.5696354 } },
        { num : 3, title: 'Minsk Trinity Hill', wikisearch: 'Minsk seightseeng', location: { lat: 53.90797125, lng: 27.55565667 } },
        { num : 4, title: 'Minsk Holy Spirit Cathedral', wikisearch: 'Minsk spirit', location: { lat: 53.90352477, lng: 27.55612338 } },
        { num : 5, title: 'Minsk National Opera and Ballet', wikisearch: 'Minsk opera', location: { lat: 53.91061301, lng: 27.56167555 } }
    ];

    var infowindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon('D91E29');
    var highlightedIcon = makeMarkerIcon('FEEC01');
    var wikiTimeOut = setTimeout(function() { console.log('Wikipedia no response'); }, 3000);

    //Creating markers
    locations.forEach(function(loc){
        // Get the position from the location array.
        var position = loc.location;
        var title = loc.title;
        var num = loc.num;

        //WikiPedia API data
        $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+loc.wikisearch+"&format=json",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "jsonp",
        success: function(data, textStatus, jqXHR) {
            articleListReady = [];
            var articleList = data.query.search;
            for (var j = 0; j < articleList.length && j<5; j++) {
                articleStr = articleList[j].title;
                var wikiUrl = 'https://en.wikipedia.org/wiki/' + articleStr;
                articleListReady.push('<li><a href="' + wikiUrl + '" target="_blank">' + articleStr + '</a></li>');
            };
            articleInfowindow.push({articleListReady});
            clearTimeout(wikiTimeOut);
        },
        error: function(errorMessage) {
            alert ("WikiPedia error:"+errorMessage);
        }
    });


        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            num: num,
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
        var content = '<div>' + marker.title + '</div>' + '<br>' + 'More on WikiPedia:';
        for (var i = 0; i < articleInfowindow[marker.num].articleListReady.length && i < 5; i++) {
            content = content + articleInfowindow[marker.num].articleListReady[i];
        }
        infowindow.setContent(content);
        infowindow.open(map, marker);
    }
}

//This function takes in a color and then creates a new icon
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
    this.num = ko.observable(data.num);
    data.setMap(map);
};

//ViewModel
function ListViewModel() {
    var self = this;
    self.filter = ko.observable('');
    //Creating initianl list of markers
    self.mapList = ko.observableArray([]);
    for (var i = 0; i < markers.length; i++) {
        self.mapList.push(new Mapdata(markers[i]));
    }
    //Creating filter which takes mapList (list of markers) and filters it every time
    //user types in input field. Function returns new array to the UI
    self.mapListFiltered = ko.computed(function() {
        var filter = self.filter();
        //This returns all markers in case the filter filed is empty
        if (!filter) {
            return self.mapList();
        }
        return self.mapList().filter(function(element) {
            return element.title().toLowerCase().indexOf(filter.toLowerCase()) > -1;
        });
    });
    //This function handles with clicks on the observableArray mapList (list of markers)
    this.mapChoice = function(obj) {
        obj.currentMap().setMap(map);
        map.panTo(obj.position());
        obj.currentMap().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            obj.currentMap().setAnimation(null);
        }, 1400);
        var content = '<div>' + obj.currentMap().title + '</div>' + '<br>' + 'More on WikiPedia:';
        for (var i = 0; i < articleInfowindow[obj.currentMap().num].articleListReady.length && i < 5; i++) {
            content = content + articleInfowindow[obj.currentMap().num].articleListReady[i];
        }
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        infowindow.open(map, obj.currentMap());
        setTimeout(function () { infowindow.close(); }, 1000);
    };
}