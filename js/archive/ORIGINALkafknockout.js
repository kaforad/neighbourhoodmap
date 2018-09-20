 //author: Oyedoyin Agbaje 

function filterLocation(queryString) { 
  //filter the location array by search vallue
  					return place_interest.mycommunity.filter(function(myCommunityData) {  
          return  myCommunityData.name.toLowerCase().indexOf(queryString.toString().toLowerCase()) > -1;
  })

}


 function myNeighboorhood(){


     var self = this;  
     //createing a counter. counter needed for dynamically created element id
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
       
        console.log(item);
        
    }
    
                
}
  ko.applyBindings(new myNeighboorhood());
