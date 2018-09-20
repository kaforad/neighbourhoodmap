 //author: Oyedoyin Agbaje 

function filterLocation(queryString) { 
  //filter the location array by search vallue
  					return place_interest.mycommunity.filter(function(myCommunityData) {  
          return  myCommunityData.name.toLowerCase().indexOf(queryString.toString().toLowerCase()) > -1;
  })

}


(function searchit(){    

//display marker onkeyup 
  var searchValue;
  var searchResult ;
 
 document.addEventListener('keyup', function (){
      deleteMarkers();
  
      searchValue = document.getElementById("searchQuery").value;
    
      searchResults=filterLocation(searchValue);
   
      searchResults.forEach(function(searchResult){
      showMarkers();
      displayMaker(searchResult);
      });
   
     
      }, false);


    
      
   return searchResult;

 }());
 function displayMaker(searchResult){
   
  // display marker and create infowindow onClick Marker
       let contentString =searchResult.name;
       let offLineContent=`<b>${searchResult.name}</b><br>(<i>${searchResult.type}</i>)</br> <p> ${searchResult.location} <p> ${searchResult.latlng.lat}, ${searchResult.latlng.lng}`;
       //convert search Result name to wikipedia title by replacing spaces with underscore.
       let wikiTitle = contentString.replace(/ /g, '_') +'_(Nigeria)'; 
          infowindow = new google.maps.InfoWindow({
          content: contentString,
        });  
      let myMarker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: searchResult.latlng,
                map:map, 
                title:searchResult.name
        
        });
        //create an array of markers      
         myMarkers.push(myMarker);
          myMarker.addListener('click', function() {
          
           //unset marker animation when another marker is clicked 
           for(var i=0;i<myMarkers.length;i++){
            myMarkers[i].setAnimation(null);
           }
         
           map.panTo(myMarker.position);
           map.setZoom(13);
          //call toggleBounce function to animate marker          
          toggleBounce(myMarker);
          
          //start ajax call to Wikipedia API
              var contentDisplay="";
                $.ajax({
                        url:'https://en.wikipedia.org/w/api.php',
                        dataType:'jsonp',
                        data:{
                                action:'opensearch',
                                search:wikiTitle,
                                format:'json',                        
                            },
                        success: function(data) {
                              //set Map info window to marker informationdetails 
                              data.shift(); //remove the first element  of the array which is the Title sent to wikipeadia API.
                              data.forEach(function(info){
                               
                              contentDisplay +="<p>"+ info.toString()+"</p>";
                                  
                              }); 
                             
                                //set infowindow content
                                infowindow.setContent(contentDisplay);                             
                               
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                              //pick infowindow content from local data when there is any form of error e.g. no network
                               infowindow.setContent(offLineContent); 
                             
                            },
                        type:'GET',
                      });
         //end ajax call to wikipedia
          infowindow.open(map, myMarker);
        });

  }//end displayMaker function
 //author: Oyedoyin Agbaje 
  
  var results;
  var infowindow;
  var map ;
  var contentString;
  function initMap() { 
 
  var mapPosition = {lat:9.024263,lng:7.4733};
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: mapPosition
  });

  //display maker on page load
  results = place_interest.mycommunity;
  results.forEach(function(result){
      displayMaker(result);
  });





 }
// call function When map API  returns error
 function loadError(){
 $('#map').append("<div class='alert alert-warning' role='alert'> The map can not be loaded at this time.Please,confirm you are connected to the Internet</div>")
 }

 function myNeighboorhood(){


     var self = this;  
     //creating a counter. counter needed for dynamically created element id
     //bind iterateId to an element that needs a counter
     self.iteratingId =ko.observable(0);      
     self.iterateId= function(observable){
        self.iteratingId( this.iteratingId+1)
     
     };

     self.myInterestedLocation = ko.observableArray(place_interest.mycommunity);
     self.searchQuery = ko.observable("");
     self.searchResult = ko.computed(function(){
   
  		  return filterLocation(self.searchQuery());
 	    },this)

  // get value of clicked location list
        self.getLocation = function(item){
          
          showMarkers();         
          displayMaker(item);
          
          
        
    }
    
                
}
  ko.applyBindings(new myNeighboorhood());
