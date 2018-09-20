 //author: Oyedoyin Agbaje 
  
  var results;
  
  function initMap() { 
 
 var mapPosition = {lat:9.024263,lng:7.4733};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: mapPosition
  });
 var infowindow;
 var contentString;

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
 

  

  //display maker on page load
  results = place_interest.mycommunity;
  results.forEach(function(result){
      displayMaker(result);
  });

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
           map.setZoom(11);
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



 }
// call function When map API  returns error
 function loadError(){
 $('#map').append("<div class='alert alert-warning' role='alert'> The map can not be loaded at this time.Please,confirm you are connected to the Internet</div>")
 }