var initialCats = [
{
		clickCount : 0,
		name : 'Tabby',
		imgSrc :'img/kh.jpg',
		imgAttribution: 'url'
		},
		{
		clickCount : 0,
		name : 'Hobby',
		imgSrc :'img/kh.jpg',
		imgAttribution: 'url'
		}
];



// var markersArr = [
// 	{
// 		position : {lat: 53.866520, lng: 27.5221000},
// 		map : map,
// 		animation: google.maps.Animation.DROP,
// 		icon: defaultIcon,
// 		title : 'Autoservis'
// 	}
// ];




var Cat = function (data) {
this.clickCount = ko.observable(data.clickCount);
this.name = ko.observable(data.name);
this.imgSrc = ko.observable(data.imgSrc);
this.imgAttribution = ko.observable(data.imgAttribution);
this.cats = ko.observableArray([
            { name: 'Bert', imgSrc: ko.observable('img/kh.jpg'), clickCount : ko.observable(0)},
            { name: 'Berty', imgSrc: ko.observable('img/kh.jpg'), clickCount : ko.observable(0)}
        ]);
this.retLevel = ko.computed(function() {
	var title;
	var clicks = this.clickCount();
		if (clicks < 5) {
			title = 'Newcat'
		} else {

			title = 'Infant'
		}
		return title;
	}, this);
}


var ViewModel = function () {
	var self = this;
	this.catList = ko.observableArray([]);
	initialCats .forEach(function(catItem) {
	self.catList.push (new 	Cat (catItem))
	});
		this.currentCat = ko.observable(this.catList()[0]);



		this.catChoice = function (obj) {
		self.currentCat(obj);
		}




	this.incrementCounter = function() {
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};

}

ko.applyBindings(new ViewModel());