var map;
var mapCenter;
var marker;
var infowindow;
var places = place_interest.mycommunity;
var aMarker = [];
// var wikiTitle;
// var offLIneContent;
function initMap(lat = 9.024263, lng = 7.4733) {
    mapCenter = { lat: lat, lng: lng };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: mapCenter,

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

    self.queryString = ko.observable('');


    // var wikiTitle;
    // var offLineContent;
    //create marker on map load
    places.forEach(function (place) {
        marker = new google.maps.Marker({

            position: { lat: place.latlng.lat, lng: place.latlng.lng },
            title: place.name,
            animation: google.maps.Animation.DROP,
            map: map,
            visible: false
        });
        // aMarker.push(marker);
    });
    //create infowindow for later use.
    infowindow = new google.maps.InfoWindow({
        maxwidth: 200,
    });

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
                infowindow.setContent(contentDisplay);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //pick infowindow content from local data when there is any form of error e.g. no network
                infowindow.setContent(offLineContent);
            },

        });
        //end ajax call to wikipedi
    }



    var createMarkers = function (locData = self.locData()) {



        locData.forEach(function (place, index) {

            // display marker and create infowindow onClick Marker
            let contentString = place.name;
            let offLineContent = `<b>${place.name}</b><br>(<i>${place.type}</i>)</br> <p> ${place.location} <p> ${place.latlng.lat}, ${place.latlng.lng}`;
            //convert search Result name to wikipedia title by replacing spaces with underscore.
            let wikiTitle = contentString.replace(/ /g, '_') + '_(Nigeria)';
            let marker = new google.maps.Marker({
                map: map,
                position: { lat: place.latlng.lat, lng: place.latlng.lng },
                title: place.name,



                // visible:false
            });

            aMarker.push(marker);

            // infowindow = new google.maps.InfoWindow({
            //     maxwidth: 200,
            // });

            marker.addListener('click', function (event) {
                marker.setAnimation(google.maps.Animation.BOUNCE);

                self.getExData(wikiTitle, offLineContent);



                infowindow.open(map, marker);

            });

        });


    }



    createMarkers(self.locData());

    self.getClickedList = function (item) {


        self.contentString = item.name;
        self.wikiTitle = self.contentString.replace(/ /g, '_') + '_(Nigeria)';

        //   marker = new google.maps.Marker({
        //         map: map,
        //         position: {lat: item.latlng.lat, lng: item.latlng.lng},
        //         title: item.name,
        //         animation: google.maps.Animation.Bounce,
        //         // visible:false
        //     });

        var latlng = new google.maps.LatLng(item.latlng.lat, item.latlng.lng);
        marker.setPosition(latlng);
        // marker.setAnimation(null);
        marker.setAnimation(google.maps.Animation.BOUNCE);


        self.getExData(self.wikiTitle, offLineContent = '');

        infowindow.open(map, marker);

    }



    /**
    * @description Filter  array with search value
    * @param {string} Search Value - Location search value
    * @returns {array}  Search Result - return result in json format
    */
    self.filterLocation = ko.computed(function () {
        //filter the location array by search value
        return self.locData().filter(function (myCommunityData) {
            return myCommunityData.name.toLowerCase().indexOf(self.queryString().toString().toLowerCase()) > -1;
        })

    }, this);
}//end of myNeighourhood ViewModel



/**
* @description Call Map initialization and View Model Function
* @param none
* @returns none
*/
function callMapFxn() {
    initMap();
    ko.applyBindings(new myNeighbourhood());

}

/**
* @description  call function When map API  returns error
* @param {string} :none
* @returns {}  bind value to the html page
*/
function loadError() {
    $('#map').append("<div class='alert alert-warning' role='alert'> The map can not be loaded at this time.Please,confirm you are connected to the Internet</div>")
    alert('Failed Request. This may be due to no network');
}
