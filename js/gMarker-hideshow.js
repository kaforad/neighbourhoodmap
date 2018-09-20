 //code from google documentation for removing marker ,hidding or showing marker
  var myMarkers =[];
 // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < myMarkers.length; i++) {
          myMarkers[i].setMap(map);
        }
      }
 // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }
 // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        myMarkers = [];
      }

//marker animation function
    function toggleBounce(makerName) {
       
        if (makerName.getAnimation() !== null) {
          makerName.setAnimation(null);
        } else {
          makerName.setAnimation(google.maps.Animation.BOUNCE);
        }
      }