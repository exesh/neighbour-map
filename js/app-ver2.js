//map define
      var map;
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
	    },
	    {
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "poi.business",
	        "elementType": "labels.text",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "poi.business",
	        "elementType": "labels.icon",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "poi.place_of_worship",
	        "elementType": "labels.text",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "poi.place_of_worship",
	        "elementType": "labels.icon",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "road",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "visibility": "simplified"
	            }
	        ]
	    },
	    {
	        "featureType": "administrative.neighborhood",
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "color": "#333333"
	            }
	        ]
	    },
	    {
	        "featureType": "road.local",
	        "elementType": "labels.text",
	        "stylers": [
	            {
	                "weight": 0.5
	            },
	            {
	                "color": "#333333"
	            }
	        ]
	    },
	    {
	        "featureType": "transit.station",
	        "elementType": "labels.icon",
	        "stylers": [
	            {
	                "gamma": 1
	            },
	            {
	                "saturation": 50
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




	      };



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




		//Octopus
var MapFunc = function (data) {

		 //    var defaultIcon = makeMarkerIcon('D91E29');
			// var highlightedIcon = makeMarkerIcon('FEEC01');

initMap();
	this.name = ko.observable(data.name);
	this.content = ko.observable(data.content);
	this.title = ko.observable(data.title);
	this.position = ko.observable(data.position);

			      var marker = new google.maps.Marker({
		          position : this.position,
		          map : map,
		          animation: google.maps.Animation.DROP,
		          icon: defaultIcon,
		          title : this.title
		        })

		        // var infowindow = new google.maps.InfoWindow({
		        //   content : this.content
		        // });



	  //       marker.addListener('click', function () {
	  //         infowindow.open(map, marker);
	  //         marker.setAnimation(google.maps.Animation.BOUNCE);
	  //         setTimeout(function () {
			//     marker.setAnimation(null);
			//   }, 2140);
	  //       })


	  //       var defaultIcon = makeMarkerIcon('D91E29');
			// var highlightedIcon = makeMarkerIcon('FEEC01');


	  //             function makeMarkerIcon(markerColor) {
	  //       var markerImage = new google.maps.MarkerImage(
	  //         'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	  //         '|40|_|%E2%80%A2',
	  //         new google.maps.Size(41, 54),
	  //         new google.maps.Point(0, 0),
	  //         new google.maps.Point(10, 54),
	  //         new google.maps.Size(41, 54));
	  //       return markerImage;
	  //     }

		 //          marker.addListener('mouseover', function() {
	  //           this.setIcon(highlightedIcon);
	  //           // this.setAnimation(google.maps.Animation.BOUNCE);
	  //         });
	  //         marker.addListener('mouseout', function() {
	  //           this.setIcon(defaultIcon);
	  //       //     if (this.getAnimation() !== null) {
	  //       //   this.setAnimation(null);
	  //       // }
	  //         });


}






		//ViewModel
var ViewModel = function () {
	var self = this;
	this.mapList = ko.observableArray([]);
	myPlaces.forEach(function(mapItem) {
	self.mapList.push (new MapFunc(mapItem))
	});
		this.currentMap = ko.observable(this.mapList()[0]);
		this.mapChoice = function (obj) {
		self.currentMap(obj);
		}
}





//Initialising ViewModel
		ko.applyBindings(new ViewModel());