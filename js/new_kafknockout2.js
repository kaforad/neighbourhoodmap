var map;
var mapCenter;
var marker;
var infowindow;
var places=place_interest.mycommunity;
// var wikiTitle;
// var offLIneContent;
function initMap(lat = 9.024263, lng = 7.4733) {
    mapCenter = { lat: lat, lng: lng };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: mapCenter,

    });

    varwitkTitle ="witkTitle";
    var offLineContent = "offLineContent";
  getExData = function (wikiTitle, offLineContent) {
        //start ajax call to Wikipedia API

        let contentDisplay = "";
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                search: wikiTitle,
                format: 'json',
            },
            success: function (data) {

                //set Map info window to marker informationdetails
                data.shift(); //remove the first element  of the array which is the Title sent to wikipeadia API.
                data.forEach(function (info) {

                    contentDisplay += "<p>" + info.toString() + "</p>";
                });
                //set infowindow content
                self.infowindow.setContent(contentDisplay);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //pick infowindow content from local data when there is any form of error e.g. no network
                self.infowindow.setContent(offLineContent);
            },

        });
        //end ajax call to wikipedi
    }


// for(var i=0;i<places.length;++i){
places.forEach(function(place,index){
     // display marker and create infowindow onClick Marker
    let contentString = place.name;
    let offLineContent = `<b>${place.name}</b><br>(<i>${place.type}</i>)</br> <p> ${place.location} <p> ${place.latlng.lat}, ${place.latlng.lng}`;
    //convert search Result name to wikipedia title by replacing spaces with underscore.
    let wikiTitle = contentString.replace(/ /g, '_') + '_(Nigeria)';
   var marker = new google.maps.Marker({
       map: map,
       position: {lat: place.latlng.lat, lng: place.latlng.lng},
       title: place.name,
       animation:google.maps.Animation.DROP
            });
    infowindow = new google.maps.InfoWindow({
            maxwidth: 200,
        });
    marker.addListener('click', function () {
    getExData(wikiTitle,offLineContent);
    infowindow.open(map, marker);
    marker.animation= google.maps.Animation.BOUNCE;
    });
});

}

/**
* @description ViewModel  for filtering
* @param {string} :none
* @returns {}  bind value to the html page
*/
function myNeighbourhood() {
    var self = this;
    var marker;
    var infowindow;
    self.locData = ko.observableArray(place_interest.mycommunity);
    self.ainfowindow = ko.observableArray();
    self.aMarker= ko.observableArray();
    self.queryString = ko.observable('');
    var wikiTitle;
    var offLineContent;

    self.getClickedList = function (item) {
        self.loc = item.latlng;

    }

    /**
    * @description  get location details from external API(WIKIPEDIA)
    * @param {string} wikiTitle:The title of wikipedia page whose location details is required
    * @param {string} offLineContent: Information to be displayed on infowindow  when offline
    * @returns {}  set marker infowindow value
    */
    self.getExData = function (wikiTitle, offLineContent) {
        //start ajax call to Wikipedia API

        let contentDisplay = "";
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                search: wikiTitle,
                format: 'json',
            },
            success: function (data) {

                //set Map info window to marker informationdetails
                data.shift(); //remove the first element  of the array which is the Title sent to wikipeadia API.
                data.forEach(function (info) {

                    contentDisplay += "<p>" + info.toString() + "</p>";
                });
                //set infowindow content
                self.infowindow.setContent(contentDisplay);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //pick infowindow content from local data when there is any form of error e.g. no network
                self.infowindow.setContent(offLineContent);
            },

        });
        //end ajax call to wikipedi
    }

self.createInfoWindow = function (createdMarker) {
        self.infowindow = new google.maps.InfoWindow({
            maxwidth: 200,
        });
        //open infowindow  on marker click event
        createdMarker.addListener('click', function () {
            self.infowindow.open(map, self.marker);
            self.maker.animation=google.maps.Animation.BOUNCE
        });


    }


    // self.createMarker = function () {
        self.locData().forEach(function (loc, index) {
            console.log(loc);
            self.marker = new google.maps.Marker({
                map: map,
                position: {lat: loc.latlng.lat, lng: loc.latlng.lng},
                title: loc.name,
                animation:google.maps.Animation.DROP
            })
            self.contentString = loc.name;
            self.wikiTitle =  self.contentString.replace(/ /g, '_') + '_(Nigeria)';
            self.offLineContent = `<b>${self.contentString.name}</b><br>(<i>${self.contentString.type}</i>)</br> <p> ${self.contentString.location}`;// <p> ${self.contentString.latlng.lat}, ${self.contentString.latlng.lng}`;
            self.aMarker().push(self.marker);
               //poplulate infowindow
           self.getExData(self.wikiTitle, self.offLineContent);
            //create marker infowindow
            self.createInfoWindow(self.marker);
        });
    // }



    self.filterLocation = ko.computed(function() {
        //filter the location array by search value
        return self.locData().filter(function (myCommunityData) {
            return myCommunityData.name.toLowerCase().indexOf(self.queryString().toString().toLowerCase()) > -1;
        })

    }, this);
}//end of myNeighourhood ViewModel

function callMapFxn() {
    initMap();
    // ko.applyBindings(new myNeighbourhood());

}

/**
* @description  call function When map API  returns error
* @param {string} :none
* @returns {}  bind value to the html page
*/
function loadError() {
    $('#map').append("<div class='alert alert-warning' role='alert'> The map can not be loaded at this time.Please,confirm you are connected to the Internet</div>")
}
