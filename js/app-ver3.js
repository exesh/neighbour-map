var map, infowindow;
var markers = [];
var positions = [];  //?????? нужны?



//Define data
var myPlaces = [
    {
    position : {lat: 53.866520, lng: 27.5221000},
    name : 'First place',
    content : 'Info here',
    title : 'Auto'
    },
    {
    position : {lat: 53.863694, lng: 27.522007},
    name : 'Second place',
    content : 'Info here',
    title : 'Auto'
    }
];

   var defaultIcon = makeMarkerIcon('D91E29');
    var highlightedIcon = makeMarkerIcon('FEEC01');

function initMap() {
    //Map Styles
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
      center: {lat: 53.866694, lng: 27.522007},
      zoom: 17,
      styles : styles,
      mapTypeControl : false
    });

    infowindow = new google.maps.InfoWindow({
        content : this.content
    });

    console.log(myPlaces);


    var title, location;
    // myPlaces.forEach(function(myPlaces) {
        for (var i = 0; i < myPlaces.length; i++) {
        name = myPlaces[i].name;
        position = myPlaces[i].position;
        position.lat = myPlaces[i].position.lat;
        position.lng = myPlaces[i].position.lng;
        positions.push({
            name,
            position
        });
    };

    for (var j = 0; j < positions.length; j++) {
        var marker = new google.maps.Marker({
              position : positions[j].location,
              map : map,
              animation: google.maps.Animation.DROP,
              icon: defaultIcon,
              title : positions[j].title
        });
        markers.push(marker);

        
          marker.addListener('click', function () {
          infowindow.open(map, marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null);
          }, 2140);
        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
            this.setAnimation(google.maps.Animation.BOUNCE);
        });
        marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            }
        });
    };

    ko.applyBindings(new ListViewModel());
};


var Mapdata = function (data) {
this.position = ko.observable(data.position);
this.title = ko.observable(data.title);
}


//ViewModel
function ListViewModel() {
    var self = this;
    this.mapList = ko.observableArray([]);
    for (var i = 0; i < markers.length; i++) {
        self.mapList.push (new  Mapdata (markers[i]))
    // markers.forEach(function(item) {
    // self.mapList.push (new  Mapdata (item))
    // });
}
}

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