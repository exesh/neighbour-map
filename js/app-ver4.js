
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

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 53.866694, lng: 27.523007},
          zoom: 17,
          styles: styles,
          mapTypeControl: false
        });

        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        var locations = [
          {title: 'Autoservice', location: {lat: 53.8665389, lng: 27.52214134}},
          {title: 'Bank ATM', location: {lat: 53.86655155, lng: 27.52396524}},
          {title: 'Cafe Hutorok', location: {lat: 53.86717154, lng: 27.52474845}},
          {title: 'Bus stop', location: {lat: 53.86670972, lng: 27.52496302}},
          {title: 'Take away food', location: {lat: 53.86603911, lng: 27.52430856}},
          {title: 'Shop', location: {lat: 53.86614666, lng: 27.52135813}}
        ];

        var infowindow = new google.maps.InfoWindow();


        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('D91E29');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FEEC01');

        // The following group uses the location array to create an array of markers on initialize.
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

          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
          populateInfoWindow(this, infowindow);
          //   marker.setAnimation(google.maps.Animation.BOUNCE);
          // setTimeout(function () {
          //   marker.setAnimation(null);
          // }, 2140);
          // infowindow.open(map, marker);
          // marker.setAnimation(google.maps.Animation.BOUNCE);
          // setTimeout(function () {
          //   marker.setAnimation(null);
          // }, 2140);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          //   this.setAnimation(google.maps.Animation.BOUNCE);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
            // if (this.getAnimation() !== null) {
            //     this.setAnimation(null);
            // }
          });
        }

      ko.applyBindings(new ListViewModel());
      }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 500;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }

      // This function will loop through the markers array and display them all.
      // function showListings() {
      //   var bounds = new google.maps.LatLngBounds();
      //   // Extend the boundaries of the map for each marker and display the marker
      //   for (var i = 0; i < markers.length; i++) {
      //     markers[i].setMap(map);
      //     bounds.extend(markers[i].position);
      //   }
      //   map.fitBounds(bounds);
      // }

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
        self.mapList.push (new  Mapdata (markers[i]));
    }
    this.mapChoice = function (obj) {
      for (var i = 0; i < self.mapList().length; i++) {
        markers[i].setMap(null);
      };
      obj.currentMap().setMap(map);
    }

    this.mapSelected = ko.observableArray(['Germany'])
    
}


      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
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

