var root = "http://comp426.cs.unc.edu:3001/";
var map;
var airlineFilter;


let newArrivalTime;
let newDepartureTime;
let newArrivalAirport;
let newDepartureAirport, activeAirport;


let airlineNames;

    function showFilters(){
        console.log('show filters success');
        $('.filter-container').show();
        $('.creation-container').hide();
        $('#welcome').remove();
    }
    function showCreation(){
        $('.filter-container').hide();
        $('.creation-container').show();
        $('#welcome').remove();
    }
    function setArrivalTime(){
        time = new Date($("#time-slider").val()*1000);
        let hours = String(time.getUTCHours());
        let minutes = String(time.getUTCMinutes());
        newArrivalTime = hours.padStart(2, "0") + ":" + minutes.padStart(2, "0");
        $('#aTime').children('p').html('Arrival Time: ' + newArrivalTime);
    }
    function setDepartureTime(){
        time = new Date($("#time-slider").val()*1000);
        let hours = String(time.getUTCHours());
        let minutes = String(time.getUTCMinutes());
        newDepartureTime = hours.padStart(2, "0") + ":" + minutes.padStart(2, "0");
        $('#dTime').children('p').html('Departure Time: ' + newDepartureTime);
    }
    function setArrivalAirport(){
        newArrivalAirport = activeAirport;
        $('#aAirport').children('p').html('Arrival Airport: ' + newArrivalAirport);

    }

    function setDepartureAirport(){
        newDepartureAirport = activeAirport;
        $('#dAirport').children('p').html('Departure Airport: ' + newDepartureAirport);

    }

    $("flight-id-input").on("keyup", function() {
        
        
        
    });


$(document).ready(() => {
    $('.creation-container').hide();
    $('.filter-container').hide();

    var time = 0;
    
    $("#flight-map-container").hide();
    $('#login-button').on('click', () => {
    event.preventDefault()
	let user = $('#username-input').val();
	let pass = $('#password-input').val();

	$.ajax(root + "sessions",
	       {
		   type: "POST",
		   xhrFields: {withCredentials: true},
		   data: {
		       user: {
			   username: user,
			   password: pass
		       }
		   },
		   success: () => {
               generateContent();
		   },
		   error: (jqxhr, status, error) => {
		       alert("error logging in, wrong username or password");
               generateContent();
		   }
	       }); 
    });
    
    $('#logout-button').on('click', () => {
    event.preventDefault()
	

	$.ajax( root + "sessions",
	       {
		   type: "DELETE",
		   xhrFields: {withCredentials: true},
		   success: () => {
               $(".login-container").show();
               $("#flight-map-container").hide();
		   }
	       });
    });
    
    $('#new-account-button').on('click', () => {
    event.preventDefault()
	let user = $('#new-username-input').val();
	let pass = $('#new-password-input').val();


	$.ajax(root + "users",
	       {
		   type: "POST",
		   xhrFields: {withCredentials: true},
		   data: {
		       user: {
			   username: user,
			   password: pass
		       }
		   },
		   success: () => {
		   },
		   error: (jqxhr, status, error) => {
		       alert("something happened, try again");
		   }
	       });
    });
    
    function generateContent() {
        $(".login-container").hide();
        $("#flight-map-container").show();
        //make the map
        buildMap();
        //buildAirports();
        
        
    }
    
    $("#time-slider").on("input", function() {
        time = $(this).val();
        //console.log(time);
        
        myDate = new Date(1000*time);
        $("#time-display").html((myDate.toUTCString()).substr(17,23));
        //console.log(myDate.toUTCString());
    });
    
    function buildMap() {
        var us = {lat: 37.0902, lng: -97.7129};
        map = new google.maps.Map(document.getElementById('map'), {
          center: us,
          zoom: 4.7,
          mapTypeControl: false,
            streetViewControl: false,
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });
        $.ajax(root + "airports",
	       {
		   type: "GET",
		   xhrFields: {withCredentials: true},
		   success: (airports) => {
               let airportList = new Array(airports.length);
               
               for (let i=0; i<airports.length; i++) {
                  var airport = airports[i];
                    //console.log(airport.latitude+", "+airport.longitude);
                    airportList[i] = airport.name;
                  /*var marker = new google.maps.Marker({
                    position: {lat: Number(airport.latitude), lng: Number(airport.longitude)},
                    map: map,
                    size: new google.maps.Size(100,100),
                    title: airport.code
                  });*/
		        }
               //console.log(airportList);
               //console.log($('#airport-input').val);
               let airportName;
               $('#airport-input').on('keydown', function(){
                   $('.airport-autocomplete-items').css('visibility', 'visible');
                   airportName=$('#airport-input').val();
               });
               
               $('#airport-input').autocomplete({
                   source: airportList,
                   appendTo: $('.airport-autocomplete-items'),
                   select: function(ui){
                       //console.log(airportName);
                       //console.log('test ui menu item: '+$('.ui-menu-item').text());
                       
                       
                       $('.ui-menu-item').on('click',function(){
                            console.log('uhh: '+$(this).text());
                            airportName=$(this).text();
                       });
                       
                       $.ajax({
                            url: 'http://comp426.cs.unc.edu:3001/airports?filter[name]='+ airportName,
                            type:'GET',
                            xhrFields: {withCredentials: true},
                            success:(airport) =>{
                                buildAirport(airport[0].id);
                            }
                           
                       });
                       $('.airport-autocomplete-items').css('visibility', 'hidden');
                   }
               });
		   },
		   error: (jqxhr, status, error) => {
		       alert("error");
		   }
	       });
        
    }
    
    function buildAirport(id) {
        $.ajax(root + "airports/" + id,
	       {
		   type: "GET",
		   xhrFields: {withCredentials: true},
		   success: (airport) => {
               console.log(root + "airports/" + id);


                    var marker = new google.maps.Marker({
                    position: {lat: Number(airport.latitude), lng: Number(airport.longitude)},
                    map: map,
                    icon: "airport.png",
                    size: new google.maps.Size(100,100),
                    data: airport.name
                    });
                    
                    info = new google.maps.InfoWindow();
                    info.setContent(airport.name);
                    //console.log(airport.name);
                    getFlights(airport.id);
                    marker.addListener('click', function() {
                        info.open(map, marker);
                        activeAirport = this.data;
                        
                    });
                    
		        
		   },
		   error: (jqxhr, status, error) => {
		       alert("error");
		   }
	       });
        
    }
    
     function getFlights(id) {
        let planeicon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          strokeColor: '#393'
        };

        var departureCoords;
        $.ajax(root + "airports/" +id,
	       {
		   type: "GET",
		   xhrFields: {withCredentials: true},
		   success: (airport) => {
                //console.log(airport.latitude+", "+airport.longitude);
		          departureCoords = {lat: Number(airport.latitude), lng: Number(airport.longitude)}
		      }
	       });
        
         $('#airline-input').on('input',function(){
            airlineFilter=$(this).val();
            console.log("filter changed to " + airlineFilter);
        });
        /*$('#airline-input').autocomplete({
                   source: airlineNames,
                   appendTo: $('.airline-autocomplete-items'),
                   select: function(ui){
                       
                       $.ajax({
                            url: 'http://comp426.cs.unc.edu:3001/airline?filter[name]='+ airlineFilter
                            type:'GET',
                            xhrFields: {withCredentials: true},
                            //success:(airport) =>{
                                //buildAirport(airport[0].id);
                            //}
                           
                       });
                       $('.airline-autocomplete-items').css('visibility', 'hidden');
                   }
               });
        */
        $.ajax(root + "flights?filter[departure_id]=" + id,
	       {
		   type: "GET",
		   xhrFields: {withCredentials: true},
		   success: (flights) => {
               
               let flightPath = Array(flights.length);
                for (let i=0; i<flights.length; i++) {
                  var flight = flights[i];
                //console.log(flight.arrival_id);
		          $.ajax(root + "airports/" + flight.arrival_id,
                        {
                      type: "GET",
                      xhrFields: {withCredentials: true},
		              success: (airport) => {
                          var arrivalCoords = {lat: Number(airport.latitude), lng: Number(airport.longitude)}
                          var marker = new google.maps.Marker({
                            position: arrivalCoords,
                            map: map,
                            icon: "airport.png",
                            title: airport.code
                          });
                          var airlineIcon;
                          flightPath[i] = new google.maps.Polyline({
                          path: [departureCoords,arrivalCoords],
                          icons: [{
                            icon: {
                              path: google.maps.SymbolPath.CIRCLE,
                              fillColor: 'yellow',
                              fillOpacity: 0.8,
                              scale: 8,
                              strokeColor: 'gold',
                              strokeWeight: 14
                            },
                            offset: '0%'
                          }],
                          geodesic: true,
                          strokeColor: '#e82acc',
                          strokeOpacity: 1.0,
                          strokeWeight: 2
                          });
                        let depart = new Date(flights[i].departs_at);
                        let arrive = new Date(flights[i].arrives_at);
                        if (depart.toUTCString()>arrive.toUTCString()) {
                            arrive = arrive + 86400;
                        }
                        flyPlane(flightPath[i],depart,arrive);
                        flightPath[i].setMap(map);
                        
                  }
                  
		        });
	       };
               
               
		   },
		   error: (jqxhr, status, error) => {
		       alert("error");
		   }
	       });
        }

    
    
    
    function flyPlane(path,depart,arrive) {
           // console.log(depart+", "+arrive);
            $("#time-slider").on("input", function() {
            time = $(this).val() * 1000;
            
            
            
            var icons = path.get('icons');
                

                
                icons[0].offset = ((time-depart)/(arrive-depart)*100)+"%";
                if (time<depart) {
                    icons[0].offset = "0%";
                }
                
             
            path.set('icons', icons);
            });  
   }
    
    

});