!function(a){a.chanakya=a.chanakya||{},a.chanakya.Map=function(){var a={map:null,places:null,infoWindow:null,directionsService:null,geoLocation:null,directionsDisplay:null,Source:{location:null,marker:null,container:null,city:null},Destination:{location:null,marker:null,container:null,city:null},Autocomplete:{source:null,destination:null,results:[]},Directions:{TravelMode:{transit:google.maps.TravelMode.TRANSIT,walking:google.maps.TravelMode.WALKING,driving:google.maps.TravelMode.DRIVING},UnitSystem:{metric:google.maps.UnitSystem.METRIC,imperial:google.maps.UnitSystem.IMPERIAL},waypoints:[],routeAlternatives:!1,travelModeSelected:google.maps.TravelMode.DRIVING,unitSystemSelected:google.maps.UnitSystem.METRIC},Markers:[],Events:{sourceLocationChangedEvent:null}},e=function(a,e,t,o){var i={center:o,zoom:14,disableDefaultUI:!0,mapTypeControl:!1,zoomControl:!1,scaleControl:!1,streetViewControl:!1};chanakya.Map._Details.map=new google.maps.Map(a,i),chanakya.Map.setContainer("source",e),chanakya.Map.setContainer("destination",t),n(),chanakya.Map._Details.places=new google.maps.places.PlacesService(chanakya.Map._Details.map),chanakya.Map._Details.directionsService=new google.maps.DirectionsService,chanakya.Map._Details.directionsDisplay=new google.maps.DirectionsRenderer,chanakya.Map._Details.geoLocation=new google.maps.Geocoder,chanakya.Map._Details.directionsDisplay.setMap(chanakya.Map._Details.map)},n=function(){$('<div id="centerMark"/>').addClass("centerMarker").appendTo(chanakya.Map._Details.map.getDiv()),google.maps.event.addListener(chanakya.Map._Details.map,"dragend",function(){chanakya.Map.existsSource()&&chanakya.Map.existsDestination()||chanakya.Map.setSource(chanakya.Map._Details.map.getCenter())})},t=function(a,e){a&&e&&"source"===a.toLowerCase()?(chanakya.Map._Details.Source.container=e,chanakya.Map._Details.Source.container.value=""):a&&e&&"destination"===a.toLowerCase()&&(chanakya.Map._Details.Destination.container=e,chanakya.Map._Details.Destination.container.value="")},o=function(a){chanakya.Map._Details.Source.location=a,chanakya.Map.getGeoLocation(a,function(a,e){chanakya.Map.setSourceCity(a.toLowerCase()),chanakya.Map._Details.Source.container.value=e},function(){chanakya.Map._Details.Source.container.value="Dropped pin location"}),chanakya.Map._Details.map.setCenter(a),chanakya.Map._Details.sourceLocationChangedEvent=new CustomEvent("sourceLocationChanged",{detail:{lat:chanakya.Map.getSourceLatitude(),lng:chanakya.Map.getSourceLongitude()}}),chanakya.Map._Details.Source.container.dispatchEvent(chanakya.Map._Details.sourceLocationChangedEvent)},i=function(){chanakya.Map._Details.Source.location=null,chanakya.Map._Details.Source.city=null,chanakya.Map._Details.Source.container.value="",chanakya.Map.clearMarkers("source")},c=function(a){chanakya.Map._Details.Destination.location=a,chanakya.Map.getGeoLocation(a,function(a,e){chanakya.Map.setDestinationCity(a.toLowerCase()),chanakya.Map._Details.Destination.container.value=e},function(){}),chanakya.Map._Details.destinationLocationChangedEvent=new CustomEvent("destinationLocationChanged",{detail:{lat:chanakya.Map.getDestination().location.k,lng:chanakya.Map.getDestination().location.D}}),chanakya.Map._Details.Destination.container.dispatchEvent(chanakya.Map._Details.destinationLocationChangedEvent)},s=function(){chanakya.Map._Details.Destination.location=null,chanakya.Map._Details.Destination.city=null,chanakya.Map._Details.Destination.container.value="",chanakya.Map.clearMarkers("destination")},l=function(a,n,t,o,i){var c=new google.maps.LatLng(o.latitude,o.longitude);return e(a,n,t,c),chanakya.Map.setSource(c),i(),!0},r=function(a,n,t,o){return navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(i){var c=new google.maps.LatLng(i.coords.latitude,i.coords.longitude);return e(a,n,t,c),chanakya.Map.setSource(c,n),o(),!0}),!1},u=function(a){chanakya.Map._Details.infoWindow=new google.maps.InfoWindow({content:a})},p=function(a,e,n){var t=new google.maps.Marker({position:a,title:e,icon:n?n:""});return t.setMap(chanakya.Map._Details.map),chanakya.Map._Details.Markers.push(t),t},M=function(a){if(a=a?a.toLowerCase():void 0,a&&"source"!==a||!chanakya.Map.existsSource()||!chanakya.Map.getSource().marker||(chanakya.Map._Details.Source.marker.setMap(null),chanakya.Map._Details.Source.marker=null),a&&"destination"!==a||!chanakya.Map.existsDestination()||!chanakya.Map.getDestination().marker||(chanakya.Map._Details.Destination.marker.setMap(null),chanakya.Map._Details.Destination.marker=null),!a||"cabs"===a){for(var e=chanakya.Map._Details.Markers.length-1;e>=0;e--)chanakya.Map._Details.Markers[e].setMap(null),chanakya.Map._Details.Markers[e]=null;chanakya.Map._Details.Markers=[]}},y=function(){for(var a=0;a<chanakya.Map._Details.Autocomplete.results.length;a++)chanakya.Map._Details.Autocomplete.results[a]&&(chanakya.Map._Details.Autocomplete.results[a]=null);chanakya.Map._Details.Autocomplete.results=[]},k=function(){return chanakya.Map._Details.Source&&chanakya.Map._Details.Source.location?!0:!1},D=function(){return chanakya.Map._Details.Destination&&chanakya.Map._Details.Destination.location?!0:!1},h=function(a,e,n){chanakya.Map._Details.geoLocation.geocode({latLng:a},function(a,t){if(t==google.maps.GeocoderStatus.OK)if(a[0]){for(var o=null,i=a[0].address_components.length-1;i>0;i--)"locality"==a[0].address_components[i].types[0]&&(o=a[0].address_components[i].long_name);e(o,a[0].formatted_address)}else n();else n()})},g=function(){return chanakya.Map._Details.Source},d=function(){return chanakya.Map._Details.Destination},_=function(){return chanakya.Map._Details.Source.city},m=function(){return chanakya.Map._Details.Destination.city},S=function(a){chanakya.Map._Details.Source.city=a},f=function(a){chanakya.Map._Details.Destination.city=a},v=function(){return chanakya.Map.existsSource()?chanakya.Map.getSource().location.k:null},L=function(){return chanakya.Map.existsSource()?chanakya.Map.getSource().location.D:null},C=function(a,e){return new google.maps.LatLng(a,e)},w=function(){return chanakya.Map._Details.map};return{_Details:a,getMap:w,intializeGmaps:l,intializeGmapsUsingNavigator:r,intializeInfoWindow:u,setContainer:t,setSource:o,clearSource:i,setDestination:c,clearDestination:s,existsSource:k,existsDestination:D,getGeoLocation:h,getSource:g,getDestination:d,getSourceCity:_,getDestinationCity:m,setSourceCity:S,setDestinationCity:f,setMarker:p,clearMarkers:M,clearResults:y,getSourceLatitude:v,getSourceLongitude:L,convertLatLngToLocation:C}}()}(window);
!function(a){a.chanakya=a.chanakya||{},a.chanakya.Map=a.chanakya.Map||{},a.chanakya.Map.Search=function(){var a=function(a){chanakya.Map._Details.Autocomplete.source=new google.maps.places.Autocomplete(a,{}),google.maps.event.addListener(chanakya.Map._Details.Autocomplete.source,"place_changed",function(){t(a,"source")})},e=function(a){chanakya.Map._Details.Autocomplete.destination=new google.maps.places.Autocomplete(a,{}),google.maps.event.addListener(chanakya.Map._Details.Autocomplete.destination,"place_changed",function(){t(a,"destination")})},t=function(a,e){e=e.toLowerCase();var t={};"source"===e?t={title:"Source",type:e}:"destination"===e&&(t={title:"Destination",type:e});var o=chanakya.Map._Details.Autocomplete[t.type].getPlace();o.geometry?(chanakya.Map._Details.map.panTo(o.geometry.location),chanakya.Map["clear"+t.title](),chanakya.Map["set"+t.title](o.geometry.location)):a.placeholder="Enter a place",chanakya.Map.existsSource()&&chanakya.Map.existsDestination()&&chanakya.Map.Directions.getDirections(chanakya.Map.getSource().location,chanakya.Map.getDestination().location)};return{initializeAutocompleteSourceBox:a,initializeAutocompleteDestinationBox:e}}()}(window);
!function(a){a.chanakya=a.chanakya||{},a.chanakya.Map=a.chanakya.Map||{},a.chanakya.Map.Directions=function(){var a=function(a,e){var t={origin:a,destination:e,travelMode:chanakya.Map.Directions.getTravelMode(),provideRouteAlternatives:chanakya.Map.Directions.getRouteAlternatives(),unitSystem:chanakya.Map.Directions.getUnitSystem()};chanakya.Map._Details.directionsService.route(t,function(a,e){e==google.maps.DirectionsStatus.OK&&(chanakya.Map.clearMarkers(),chanakya.Map._Details.directionsDisplay.setMap(chanakya.Map._Details.map),chanakya.Map._Details.directionsDisplay.setDirections(a),$(".centerMarker").hide())})},e=function(a){a=a.toLowerCase(),chanakya.Map._Details.Directions.travelModeSelected=chanakya.Map._Details.Directions.TravelMode[a]?chanakya.Map._Details.Directions.TravelMode[a]:chanakya.Map._Details.Directions.TravelMode.driving,chanakya.Map.existsSource()&&chanakya.Map.existsDestination()&&chanakya.Map.getDirections(chanakya.Map.getSource().location,chanakya.Map.getDestination().location)},t=function(){return chanakya.Map._Details.Directions.travelModeSelected},n=function(a){chanakya.Map._Details.Directions.routeAlternatives="boolean"==typeof a?a:!1},i=function(){return chanakya.Map._Details.Directions.routeAlternatives},c=function(a){a=a.toLowerCase(),chanakya.Map._Details.Directions.unitSystemSelected=chanakya.Map._Details.Directions.UnitSystem[a]?chanakya.Map._Details.Directions.UnitSystem[a]:chanakya.Map._Details.Directions.UnitSystem.metric,chanakya.Map.existsSource()&&chanakya.Map.existsDestination()&&chanakya.Map.getDirections(chanakya.Map.getSource().location,chanakya.Map.getDestination().location)},s=function(){return chanakya.Map._Details.Directions.unitSystemSelected},o=function(){chanakya.Map._Details.directionsDisplay.setMap(null),chanakya.Map.clearDestination(),chanakya.Map.existsSource()&&chanakya.Map._Details.map.setCenter(chanakya.Map.getSource().location),$(".centerMarker").show()};return{getDirections:a,clearDirections:o,setTravelMode:e,getTravelMode:t,setRouteAlternatives:n,getRouteAlternatives:i,setUnitSystem:c,getUnitSystem:s}}()}(window);
!function(i){i.chanakya=i.chanakya||{},i.chanakya.cabrates={auto:{bengaluru:{minprice:25,minkm:1.9,rate:13},mumbai:{minprice:17,minkm:1.5,rate:11.33},delhi:{minprice:25,minkm:2,rate:8},"new delhi":{minprice:25,minkm:2,rate:8}},ola:{mumbai:{mini:{minprice:100,minkm:4,rate:15},sedan:{minprice:150,minkm:4,rate:21},prime:{minprice:200,minkm:5,rate:17},airportmini:{minprice:100,minkm:4,rate:15},airportsedan:{minprice:150,minkm:4,rate:21},airportprime:{minprice:200,minkm:5,rate:17}},bengaluru:{mini:{minprice:100,minkm:6,rate:10},sedan:{minprice:150,minkm:8,rate:13},prime:{minprice:200,minkm:5,rate:18},airportmini:{minprice:540,minkm:30,rate:13,toll:75},airportsedan:{minprice:600,minkm:30,rate:16,toll:75},airportprime:{minprice:800,minkm:30,rate:18,toll:75}},pune:{mini:{minprice:100,minkm:5,rate:12},sedan:{minprice:100,minkm:6,rate:18},prime:{minprice:200,minkm:5,rate:18},airportmini:{minprice:100,minkm:5,rate:12},airportsedan:{minprice:100,minkm:5,rate:12},airportprime:{minprice:200,minkm:5,rate:18}},chennai:{mini:{minprice:100,minkm:5,rate:12},sedan:{minprice:150,minkm:6,rate:16},prime:{minprice:150,minkm:5,rate:18},pink:{minprice:150,minkm:5,rate:18},airportmini:{minprice:100,minkm:4,rate:15},airportsedan:{minprice:150,minkm:4,rate:21},airportprime:{minprice:200,minkm:5,rate:17}},goa:{sedan:{minprice:250,minkm:6,rate:15}},jaipur:{mini:{minprice:49,minkm:3,rate:10},sedan:{minprice:99,minkm:5,rate:14},prime:{minprice:200,minkm:5,rate:18}},hyderabad:{mini:{minprice:100,minkm:4,rate:10},sedan:{minprice:150,minkm:6,rate:14},airportmini:{minprice:499,minkm:30,rate:12},airportsedan:{minprice:600,minkm:30,rate:16}},chandigarh:{mini:{minprice:49,minkm:3,rate:10},sedan:{minprice:99,minkm:5,rate:14}},ahmedabad:{mini:{minprice:49,minkm:3,rate:10},sedan:{minprice:100,minkm:4,rate:12}},surat:{mini:{minprice:49,minkm:3,rate:12},sedan:{minprice:49,minkm:2,rate:14}},mysore:{mini:{minprice:49,minkm:2,rate:12},sedan:{minprice:49,minkm:2,rate:14}}},tfs:{bengaluru:{nano:{minprice:25,minkm:2,rate:10},sedan:{minprice:49,minkm:4,rate:16},hatchback:{minprice:49,minkm:4,rate:14},airporthatchback:{minprice:650,minkm:30,rate:14},airportsedan:{minprice:700,minkm:30,rate:16}},chennai:{hatchback:{minprice:49,minkm:4,rate:15},sedan:{minprice:49,minkm:4,rate:16},suv:{minprice:300,minkm:8,rate:18}},delhi:{hatchback:{minprice:49,minkm:4,rate:14},sedan:{minprice:49,minkm:6,rate:16}},"new delhi":{hatchback:{minprice:49,minkm:4,rate:14},sedan:{minprice:49,minkm:6,rate:16}},hyderabad:{hatchback:{minprice:49,minkm:4,rate:12},sedan:{minprice:49,minkm:4,rate:14},airporthatchback:{minprice:499,minkm:30,rate:12},airportsedan:{minprice:599,minkm:30,rate:14},airportsuv:{minprice:999,minkm:40,rate:16}},jaipur:{hatchbacksedan:{minprice:49,minkm:4,rate:10},sedan:{minprice:49,minkm:4,rate:12},airporthatchback:{minprice:49,minkm:4,rate:10},airportsedan:{minprice:49,minkm:4,rate:12}},mumbai:{hatchbacksedan:{minprice:150,minkm:6,rate:15},sedan:{minprice:150,minkm:6,rate:18},suv:{minprice:200,minkm:6,rate:21},airporthatchback:{minprice:49,minkm:4,rate:10},airportsedan:{minprice:49,minkm:4,rate:12},airportsuv:{minprice:200,minkm:6,rate:21}},pune:{eeco:{minprice:49,minkm:4,rate:13},hatchback:{minprice:49,minkm:4,rate:14},sedan:{minprice:49,minkm:4,rate:16},airporteeco:{minprice:49,minkm:4,rate:13},airporthatchback:{minprice:49,minkm:4,rate:14},airportsedan:{minprice:49,minkm:4,rate:16}},chandigarh:{mini:{minprice:49,minkm:3,rate:10},sedan:{minprice:99,minkm:5,rate:14}},ahmedabad:{hatchback:{minprice:49,minkm:4,rate:12},sedan:{minprice:49,minkm:4,rate:14},airporthatchback:{minprice:49,minkm:4,rate:12},airportsedan:{minprice:49,minkm:4,rate:14}},surat:{hatchback:{minprice:49,minkm:4,rate:12},sedan:{minprice:49,minkm:4,rate:14},airportsuv:{minprice:300,minkm:8,rate:16},airportsedan:{minprice:49,minkm:4,rate:14},airporthatchback:{minprice:49,minkm:4,rate:12}},mysore:{hatchback:{minprice:49,minkm:4,rate:14},sedan:{minprice:49,minkm:4,rate:16},suv:{minprice:90,minkm:4,rate:18},airporthatchback:{minprice:60,minkm:4,rate:16},airportsedan:{minprice:60,minkm:4,rate:16},airportsuv:{minprice:90,minkm:4,rate:18}}},meru:{bengaluru:{meru:{minprice:80,minkm:4,rate:19.5},genie:{minprice:90,minkm:4,rate:10}},delhi:{meru:{minprice:69,minkm:3,rate:23},genie:{minprice:90,minkm:4,rate:10}},"new delhi":{meru:{minprice:69,minkm:3,rate:23},genie:{minprice:90,minkm:4,rate:10}},pune:{meru:{minprice:99,minkm:4,rate:15},genie:{minprice:90,minkm:6,rate:12}},hyderabad:{meru:{minprice:40,minkm:2,rate:21},genie:{minprice:90,minkm:4,rate:10}},jaipur:{meru:{minprice:99,minkm:5,rate:10}},ahmedabad:{meru:{minprice:100,minkm:6,rate:15},genie:{minprice:49,minkm:4,rate:10}},chennai:{meru:{minprice:90,minkm:4,rate:15},genie:{minprice:90,minkm:4,rate:10}},mysore:{meru:{minprice:49,minkm:2,rate:14},genie:{minprice:49,minkm:2,rate:12}},kolkata:{meru:{minprice:150,minkm:6,rate:15}}}},i.chanakya.cost=function(){var i=function(){var i=function(){return chanakya.cabrates.auto[chanakya.Map.getSourceCity()].rate},a=function(i){return chanakya.cabrates.ola[chanakya.Map.getSourceCity()][i].rate||14},e=function(i){return chanakya.cabrates.tfs[chanakya.Map.getSourceCity()][i].rate||14},m=function(i){return chanakya.cabrates.meru[chanakya.Map.getSourceCity()][i].rate||14};return{auto:i,ola:a,tfs:e,meru:m}}(),a=function(a){return a<=chanakya.cabrates.auto[chanakya.Map.getSourceCity()].minkm?chanakya.cabrates.auto[chanakya.Map.getSourceCity()].minprice:a*i.auto()},e=function(e,m){return"auto"===m?a(e):e<=chanakya.cabrates.ola[chanakya.Map.getSourceCity()][m].minkm?chanakya.cabrates.ola[chanakya.Map.getSourceCity()][m].minprice:chanakya.cabrates.ola[chanakya.Map.getSourceCity()][m].minprice+(e-chanakya.cabrates.ola[chanakya.Map.getSourceCity()][m].minkm)*i.ola(m)},m=function(e,m){return"auto"===m?a(e):e<=chanakya.cabrates.tfs[chanakya.Map.getSourceCity()][m].minkm?chanakya.cabrates.tfs[chanakya.Map.getSourceCity()][m].minprice:chanakya.cabrates.tfs[chanakya.Map.getSourceCity()][m].minprice+(e-chanakya.cabrates.tfs[chanakya.Map.getSourceCity()][m].minkm)*i.tfs(m)},r=function(a,e){return a<=chanakya.cabrates.meru[chanakya.Map.getSourceCity()][e].minkm?chanakya.cabrates.meru[chanakya.Map.getSourceCity()][e].minprice:chanakya.cabrates.meru[chanakya.Map.getSourceCity()][e].minprice+(a-chanakya.cabrates.meru[chanakya.Map.getSourceCity()][e].minkm)*i.meru(e)},n=function(i){var r=["",1e6];return a(i)<r[1]&&(r=["auto",a(i)]),e(i,"mini")<r[1]&&(r=["ola",e(i,"mini")]),m(i,"nano")<r[1]&&(r=["tfs",m(i,"nano")]),r};return{auto:a,ola:e,tfs:m,meru:r,cheapest:n}}()}(window);
!function(e){function a(e){return e.toLowerCase()}function i(e){return e.toUpperCase()}e.chanakya=e.chanakya||{},e.mobilecheck=function(){var a=!1;return function(e){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(a=!0)}(navigator.userAgent||navigator.vendor||e.opera),a},e.androidAppCheck=function(){var a=!1;return function(){/TaxiStopApp\/[0-9\.]+$/.test(navigator.userAgent)&&(a=!0)}(navigator.userAgent||navigator.vendor||e.opera),a};var t=angular.module("chanakyaApp",["ngSanitize"]);t.controller("ChanakyaCtrl",["$scope","$http","$interval",function(t,n,o){function r(e,i,n){if(t.mask=!1,t.availableTypes={ola:0,uber:0,tfs:0,meru:0,all:0},!i.cabsEstimate)return void(t.mask=!0);for(var o=0;o<i.cabsEstimate.length;o++)i.cabsEstimate[o].available&&(t.availableTypes[a(i.cabsEstimate[o].type)]++,t.availableTypes.all++);t.cabs.estimate=i.cabsEstimate,t.cabs.coordinates=i.cabs,t.loading=!1,n||t.selectService(e,!0),s(43*(t.availableTypes[t.cabs.selected]>5?5:t.availableTypes[t.cabs.selected]))}function s(a){p.style.height=t.isMobile?0===t.availableTypes[t.cabs.selected]?t.mapHeight-25+"px":t.mapHeight-a+"px":document.body.clientHeight,google.maps.event.trigger(e.chanakya.Map.getMap(),"resize"),e.chanakya.Map.existsSource()&&e.chanakya.Map.existsDestination()||e.chanakya.Map.getMap().setCenter(e.chanakya.Map.getSource().location)}function c(){if("all"!==t.cabs.selected)return void l(t.cabs.coordinates[i(t.cabs.selected)],t.cabs.selected);for(var e=0;e<t.services.length;e++)l(t.cabs.coordinates[i(t.services[e].name)],t.services[e].name,!0)}function l(a,i,t){t||e.chanakya.Map.clearMarkers("cabs");for(var n in a)for(var o=(a[n],0);2>o;o++){var r=a[n][o];if(r){var s=e.chanakya.Map.convertLatLngToLocation(r.lat,r.lng);e.chanakya.Map.setMarker(s,i.toUpperCase()+" "+n,g[n])}}}t.source={lat:void 0,lng:void 0},t.cabs={selected:"ola"},t.loading=!0,t.loadingMsg="loading...";var p=document.getElementById("map-canvas"),u=document.getElementById("searchSource"),d=document.getElementById("searchDestination"),g={Mini:e.CDN_IMAGE_PREFIX+"/images/mini.png",Hatchback:e.CDN_IMAGE_PREFIX+"/images/mini.png",Genie:e.CDN_IMAGE_PREFIX+"/images/mini.png",Nano:e.CDN_IMAGE_PREFIX+"/images/mini.png",Sedan:e.CDN_IMAGE_PREFIX+"/images/sedan.png",Meru:e.CDN_IMAGE_PREFIX+"/images/sedan.png",Prime:e.CDN_IMAGE_PREFIX+"/images/prime.png",Pink:e.CDN_IMAGE_PREFIX+"/images/prime.png",Auto:e.CDN_IMAGE_PREFIX+"/images/auto.png","Kaali Peeli":e.CDN_IMAGE_PREFIX+"/images/mini.png",uberX:e.CDN_IMAGE_PREFIX+"/images/mini.png",UberBLACK:e.CDN_IMAGE_PREFIX+"/images/sedan.png"};t.services=[{name:"ola",icon:e.CDN_IMAGE_PREFIX+"/images/ola-icon-50x50.png"},{name:"uber",icon:e.CDN_IMAGE_PREFIX+"/images/uber-icon-50x50.png"},{name:"tfs",icon:e.CDN_IMAGE_PREFIX+"/images/tfs-icon-50x50.jpg"},{name:"meru",icon:e.CDN_IMAGE_PREFIX+"/images/meru-icon-50x50.jpg"}],t.getCabImg=function(e){return g[e]},t.getCabTypeImg=function(e){return"ola"==a(e)?t.services[0].icon:"uber"==a(e)?t.services[1].icon:"tfs"==a(e)?t.services[2].icon:"meru"==a(e)?t.services[3].icon:void 0},t.travelTime=0,t.travelDistance=0,t.travelInfoLoadFailed=!1,t.setTravelInfo=function(){if(t.destination&&t.destination.lat){var e="eta?srcLat="+t.source.lat+"&srcLng="+t.source.lng;e+="&destLat="+t.destination.lat+"&destLng="+t.destination.lng,n.get(e).success(function(e){e.success?(t.travelInfoLoadFailed=!1,t.travelTime=Math.ceil(e.duration.value/60),t.travelDistance=e.distance.value/1e3):t.travelInfoLoadFailed=!0})}},t.getTravelTime=function(a){if(!e.chanakya.Map.existsDestination()||!a.available)return"";if(t.travelInfoLoadFailed)return"failed";if(0===t.travelTime)return"wait";var i=Math.floor(a.duration)+t.travelTime;return Math.floor(i)+" mins"},t.getArrivalTime=function(e){return e.available?"Arrives in "+Math.floor(e.duration)+" mins":"Not available"},t.uberCost={uberGO:"",uberX:"",UberBLACK:"",multipliers:{uberGO:1,uberX:1,UberBLACK:1}},t.getTravelCost=function(i){if(!e.chanakya.Map.existsDestination()||!i.available)return"";if(0===t.travelDistance)return"calculating";if("ola"==a(i.type))return t.travelInfoLoadFailed?"failed":"apx &#8377;"+Math.ceil(e.chanakya.cost.ola(t.travelDistance,i.name.toLowerCase()));if("tfs"==a(i.type))return t.travelInfoLoadFailed?"failed":"apx &#8377;"+Math.ceil(e.chanakya.cost.tfs(t.travelDistance,i.name.toLowerCase()));if("meru"==a(i.type))return t.travelInfoLoadFailed?"failed":"apx &#8377;"+Math.ceil(e.chanakya.cost.meru(t.travelDistance,i.name.toLowerCase()));if("uber"==a(i.type)){if(""===t.uberCost[i.name])return"calculating";var n="";return 1!=t.uberCost.multipliers[i.name]&&(n="<span class='multiplier'>"+t.uberCost.multipliers[i.name]+"x</span>"),n+" &#8377;"+t.uberCost[i.name]}},t.getUberCost=function(){n.get("cabs/uber/cost?srcLat="+t.source.lat+"&srcLng="+t.source.lng+"&destLat="+t.destination.lat+"&destLng="+t.destination.lng).success(function(e){for(var a in e.prices)t.uberCost[e.prices[a].name]=e.prices[a].low_estimate==e.prices[a].high_estimate?e.prices[a].low_estimate:e.prices[a].low_estimate+"-"+e.prices[a].high_estimate,t.uberCost.multipliers[e.prices[a].name]=e.prices[a].multiplier})},t.showFilter=function(e){return e.available?"all"===t.cabs.selected?!0:a(e.type)!==t.cabs.selected?!1:!0:!1},t.typingOn=!1,t.isShownDetails=function(){return t.isMobile?!t.typingOn:!0},t.clearSource=function(){t.source=void 0,e.chanakya.Map.clearSource(),e.chanakya.Map.Directions.clearDirections()},t.clearDestination=function(){t.destination=void 0,e.chanakya.Map.clearDestination(),e.chanakya.Map.Directions.clearDirections()},t.openApp=function(e){t.isAndroidApp&&Android.openApp(a(e))},t.promoteApp=function(e){t.isAndroidApp&&e&&Android.promoteTaxiStop(e)},t.mask=!1,t.availableTypes={ola:0,uber:0,tfs:0,meru:0,all:0},t.refreshTrue=!1,t.selectService=function(e,a){t.refreshTrue&&(t.refreshTrue=!1,t.getService(e,!0)),(t.cabs.selected!==e||a)&&(a||s(43*(t.availableTypes[e]>5?5:t.availableTypes[e])),t.cabs.selected=e,c())},t.showMask=function(){return t.loading||0===t.availableTypes[t.cabs.selected]},t.getCabs=function(e,a){n.get("cabs/all?lat="+t.source.lat+"&lng="+t.source.lng).success(function(i){r(e,i,a)})},t.getService=function(e,a){t.getCabs(e,a)},t.init=function(){t.isMobile=e.mobilecheck(),t.isAndroidApp=e.androidAppCheck(),t.isMobile&&!t.isAndroidApp?(t.mapHeight=document.body.clientHeight-148,p.style.height=t.mapHeight+"px"):t.isMobile&&t.isAndroidApp&&(t.mapHeight=screen.height-148,p.style.height=t.mapHeight+"px"),o(function(){t.refreshTrue=!0},3e4)},google.maps.event.addDomListener(e,"load",function(){if(e.androidAppCheck()){var a=Android.getUserLocation(),i={latitude:21,longitude:78};a&&(a=a.split("|"),i={latitude:a[0],longitude:a[1]}),e.chanakya.Map.intializeGmaps(p,u,d,i,function(){e.chanakya.Map.Search.initializeAutocompleteSourceBox(u),e.chanakya.Map.Search.initializeAutocompleteDestinationBox(d)})}else e.chanakya.Map.intializeGmapsUsingNavigator(p,u,d,function(){e.chanakya.Map.Search.initializeAutocompleteSourceBox(u),e.chanakya.Map.Search.initializeAutocompleteDestinationBox(d)})}),t.setSourceUserLocation=function(){if(t.loading=!0,e.chanakya.Map.clearMarkers("cabs"),e.androidAppCheck()){var a=Android.getUserLocation(),i={latitude:21,longitude:78};if(a&&(a=a.split("|"),i={latitude:a[0],longitude:a[1]}),i.latitude==t.source.lat)return c(),void(t.loading=!1);e.chanakya.Map.setSource(e.chanakya.Map.convertLatLngToLocation(i.latitude,i.longitude))}else navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(a){if(a.coords.latitude==t.source.lat)return c(),t.loading=!1,!1;var i=e.chanakya.Map.convertLatLngToLocation(a.coords.latitude,a.coords.longitude);return e.chanakya.Map.setSource(i),!0})},u.addEventListener("sourceLocationChanged",function(e){t.source={lat:e.detail.lat,lng:e.detail.lng},t.getService(t.cabs.selected),t.typingOn=!1},!1),d.addEventListener("destinationLocationChanged",function(e){t.destination={lat:e.detail.lat,lng:e.detail.lng},t.uberCost={uberX:"",UberBLACK:"",multipliers:{uberX:1,UberBLACK:1}},t.setTravelInfo(),t.getUberCost(),t.typingOn=!1},!1),t.init()}])}(window,angular);