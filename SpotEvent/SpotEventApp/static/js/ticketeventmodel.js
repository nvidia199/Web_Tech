
var viewModel = new function()
{
    var self = this;
    var apikey = 'A491Blf11EgsYMWGiUGcgNA2rM3bDNtD';


    //the search string for the search box
    self.searchstring = ko.observable('');

    // the function called by hitting the search button
    self.search = function(){
        window.location.href = "search" + self.searchstring(); 
    }

    //gets the event ID from the url
    var url = window.location.href;
    var eventID = url.slice(33);
    console.log('ID :', eventID);

    //logout the user
    self.logout = function(){
        var json = $.post('/api/logout', ko.toJS(''))
        window.location = 'http://127.0.0.1:8000'
    }

    // the data for the event
    self.event = {
        name : ko.observable(),
        date: ko.observable(),
        venue_name : ko.observable(),
        street : ko.observable(),
        city : ko.observable(),
        zip_code : ko.observable(),
        country : ko.observable(),
        promoter : ko.observable(),
        url : ko.observable(),
        attractions : ko.observableArray(),
    }

    // the function called by the 'buy tickets' button, redirect to the page
    self.ticketlink = function(){
        window.location = self.event.url()
    }


    //creates the event data
    function createEvent(data) {
        temp = data._embedded.events[0];
        console.log('temp :', temp);

        self.event.name(temp.name)
        self.event.date(temp.dates.start.localDate)
        self.event.venue_name(temp._embedded.venues[0].name)
        self.event.street(temp._embedded.venues[0].address.line1)
        self.event.city(temp._embedded.venues[0].city.name)
        self.event.zip_code(temp._embedded.venues[0].postalCode)
        self.event.country(temp._embedded.venues[0].country.name)
        self.event.promoter(temp.promoter.name)
        self.event.attractions(temp._embedded.attractions)
        self.event.url(temp.url)
        console.log('attract: ', self.event.attractions())




        console.log("Event :", self.event.name());
        console.log("Eventdate :")
    }

    //gets the event data from the ticketmaster database
    self.getEvent = function(){
        console.log('getEvent');
        var json = $.getJSON('https://app.ticketmaster.com/discovery/v2/events.json?id='+ eventID + '&apikey=' + apikey, function(data){
            createEvent(data);
            initialize();
            codeAddress();
        })
    }

    // calls the function to get the event
    self.getEvent();

     //initializes the google map
    var geocoder;
    var map;
    function initialize() {
        geocoder = new google.maps.Geocoder();
        //var latlng = new google.maps.LatLng(-34.397, 150.644);
        var mapOptions = {
            zoom: 10,
            //center: latlng
        }
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    }

    // codes the address and marks it on the map
    function codeAddress() {
        var address = self.event.street() + " " + self.event.city() 
        + " " + self.event.zip_code() + " " + self.event.country();
        console.log("GOOGLE",address)
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

ko.applyBindings(viewModel);  