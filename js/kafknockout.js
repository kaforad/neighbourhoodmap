var results;
var infowindow;
var map;
var contentString;
// var myMarker;
//  var myMarkers ;



/**
* @description Filter  array with search value
* @param {string} Search Value - Location search value
* @returns {array}  Search Result - return result in json format
*/

function filterLocation(queryString) {
  //filter the location array by search vallue
  return place_interest.mycommunity.filter(function (myCommunityData) {
    return myCommunityData.name.toLowerCase().indexOf(queryString.toString().toLowerCase()) > -1;
  })

}




/**
* @description ViewModel  for filtering
* @param {string} :none
* @returns {}  bind value to the html page
*/
function myNeighbourhood() {
  var self = this;
  let marker;
  let infowindow = new google.maps.InfoWindow({
    content: contentString,
  });



  function createMarker(Mpos, mTitle, animationType) {
    // clearMarkers();
    //create a single marker
    let myMarker = new google.maps.Marker({
      animation: animationType,
      position: Mpos,
      map: map,
      title: mTitle

    });

    return myMarker;
  };

  function createMarkerArray() {
    //Multiple Markers creation - creating markers Array
    let mData = place_interest.mycommunity;
    mData.forEach(function (result) {
      result = result;
      myMarker = createMarker(result.latlng, result.name, google.maps.Animation.DROP);
      myMarkers.push(myMarker);//myMarkers array declared in gMarker-hideshow.json
    });
    return myMarkers;
  }

  (function (lat = 9.024263, lng = 7.4733) {
    self.mapPosition = { lat: lat, lng: lng };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: self.mapPosition
    });

    //create and display maker on page load
    this.results = place_interest.mycommunity;
    this.results.forEach(function (result) {
      result = result;
      var myMarker = displayMarker(result);




    });


  } ());





  //creating a counter. counter needed for dynamically created element id
  //bind iterateId to an element that needs a counter
  self.iteratingId = ko.observable(0);
  self.iterateId = function (observable) {
    self.iteratingId(this.iteratingId + 1)

  };

  /**
* @description create marker ,display windowinfo
* @param{string} searchResult :The result of a search or filter
  @param{boolean} True  : true if a list item is clicked on
* @returns {}: none
*/

  function displayMarker(searchResult, listClick = false) {

    // display marker and create infowindow onClick Marker
    let contentString = searchResult.name;
    let offLineContent = `<b>${searchResult.name}</b><br>(<i>${searchResult.type}</i>)</br> <p> ${searchResult.location} <p> ${searchResult.latlng.lat}, ${searchResult.latlng.lng}`;
    //convert search Result name to wikipedia title by replacing spaces with underscore.
    let wikiTitle = contentString.replace(/ /g, '_') + '_(Nigeria)';

    let myMarker = createMarker(searchResult.latlng, searchResult.name, google.maps.Animation.DROP);
    myMarkers.push(myMarker);



    //do when marker is clicked: display infowindow
    myMarker.addListener('click', function () {


      setAnimationToNull();
      map.panTo(myMarker.position);
      map.setZoom(13);
      //call toggleBounce function to animate marker
      toggleBounce(myMarker);
      getInfoData(wikiTitle, offLineContent);
      infowindow.open(map, myMarker);
    });

    //do when location list item is clicked: display infowindow
    if (listClick == true) {
      setAnimationToNull();
      map.panTo(myMarker.position);
      map.setZoom(13);
      //call toggleBounce function to animate marker
      toggleBounce(myMarker);
      getInfoData(wikiTitle, offLineContent);
      infowindow.close();
      infowindow.open(map, myMarker);
    }




  }



  //set markers animation to null
  function setAnimationToNull() {

    for (var i = 0; i < myMarkers.length; i++) {
      myMarkers[i].setAnimation(null);
    }
  };


  //filter location with search value
  self.myInterestedLocation = ko.observableArray(place_interest.mycommunity);
  self.searchQuery = ko.observable("");
  self.searchResult = ko.computed(function () {
    return filterLocation(self.searchQuery());
 	}, this);

  // get value of clicked location list
  self.getClickedList = function (item) {
    self.loc = item.latlng;
    showMarkers();
    displayMarker(item, listClick = true);

  };


  /**
* @description search for location based on value type into search
* @param  :none*
* @returns {json} - search result
*/

  (function searchit() {

    //display marker onkeyup
    var searchValue;
    var searchResult;

    document.addEventListener('keyup', function () {
      deleteMarkers();
      searchValue = document.getElementById("searchQuery").value;
      searchResults = filterLocation(searchValue);
      searchResults.forEach(function (searchResult) {
        showMarkers();
        displayMarker(searchResult);
      });
    }, false);
    return searchResult;

  } ());

  /**
* @description  get location details from external API(WIKIPEDIA)
* @param {string} wikiTitle:The title of wikipedia page whose location details is required
* @param {string} offLineContent: Information to be displayed on infowindow  when offline
* @returns {}  set marker infowindow value
*/

  function getInfoData(wikiTitle, offLineContent) {
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
      type: 'GET',
    });
    //end ajax call to wikipedi
  }




}
function callMapFxn() {
  ko.applyBindings(new myNeighbourhood());
}

/**
* @description  call function When map API  returns error
* @param {string} :none
* @returns {}  bind value to the html page
*/
function loadError() {
  $('#map').append("<div class='alert alert-warning' role='alert'> The map can not be loaded at this time.Please,confirm you are connected to the Internet</div>")
}
