      var map;
      // Create a new blank array for all the listing markers.
      var markers = [];

      function initMap() {
        // Create a styles array to use with the map.
    var styles =
    [
        {
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "gamma": 1
                }
            ]
        }
    ];

        // Constructor creates a new map
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 53.866694, lng: 27.523007},
          zoom: 17,
          styles: styles,
          mapTypeControl: false
        });

        //My locations list
        var locations = [
          {title: 'Autoservice', location: {lat: 53.8665389, lng: 27.52214134}},
          {title: 'Bank ATM', location: {lat: 53.86655155, lng: 27.52396524}},
          {title: 'Cafe Hutorok', location: {lat: 53.86717154, lng: 27.52474845}},
          {title: 'Bus stop', location: {lat: 53.86670972, lng: 27.52496302}},
          {title: 'Take away food', location: {lat: 53.86603911, lng: 27.52430856}},
          {title: 'Shop', location: {lat: 53.86614666, lng: 27.52135813}}
        ];

        var infowindow = new google.maps.InfoWindow();

        var defaultIcon = makeMarkerIcon('D91E29');
        var highlightedIcon = makeMarkerIcon('FEEC01');

        //Creating markers
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
          });

          // Push the marker to our array of markers.
          markers.push(marker);

          // Create an onclick event to open the infowindow at each marker and bounce function.
          marker.addListener('click', function() {
          var self = this;
          populateInfoWindow(this, infowindow);
          this.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            self.setAnimation(null);
          }, 2140);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        }

      ko.applyBindings(new ListViewModel());
      }

      // This function populates the infowindow
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
        }
      }

      // This function takes in a COLOR, and then creates a new marker
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }

//Constructor for ViewModel
var Mapdata = function (data) {
this.currentMap = ko.observable(data);
this.title = ko.observable(data.title);
data.setMap(map);
}


//ViewModel
function ListViewModel() {
    var self = this;
    this.mapList = ko.observableArray([]);
    for (var i = 0; i < markers.length; i++) {
        self.mapList.push(new Mapdata(markers[i]));
    };
    this.mapChoice = function(obj) {
        for (var i = 0; i < self.mapList().length; i++) {
            markers[i].setMap(null);
        };
        obj.currentMap().setMap(map);
    };

    //This function takes the object (maybe) from selected drop-down list by user
    //and makes visible only selected marker
    self.mapSelected = function(obj) {
        for (var i = 0; i < self.mapList().length; i++) {
            markers[i].setMap(null);
        };
        obj.currentMap().setMap(map);
        console.log("!this works!");
    };
}

