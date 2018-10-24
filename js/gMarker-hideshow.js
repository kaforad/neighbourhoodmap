//code from google documentation for removing marker ,hidding or showing marker
// var myMarkers = [];
// Sets the map on all markers in the array.
function setMapOnAll(map,aMarker) {
    console.log('setMapOnAll');
       console.log(aMarker);

  for (var i = 0; i < places.length; i++) {
    aMarker[i].setMap(map);
  }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  //     console.log('clearMarkers');
  // console.log(aMarker);

  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers(aMarker) {
  //  console.log('showMarkers');
  //  console.log(aMarker);
  setMapOnAll(map,aMarker);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers(aMarker) {
  clearMarkers();
  aMarker = [];
}

//marker animation function
function toggleBounce(makerName) {

  if (makerName.getAnimation() !== null) {
    makerName.setAnimation(null);
  } else {
    makerName.setAnimation(google.maps.Animation.BOUNCE);
  }
}


