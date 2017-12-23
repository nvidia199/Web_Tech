var viewModel = new function()
{
	var apikey = 'A491Blf11EgsYMWGiUGcgNA2rM3bDNtD';
    var self = this;

    //get the user ID from the cookie
    var cookie = document.cookie;
    console.log('cookie :', cookie.slice(3))
    var userID = parseInt(cookie.slice(3));

    //logout the user
    self.logout = function(){
        var json = $.post('/api/logout', ko.toJS(''))
        window.location = 'http://127.0.0.1:8000'
    }

    //the search string for the search box
    self.searchstring2 = ko.observable('');

    // the function called by hitting the search button
    self.search = function(){
        window.location = "http://127.0.0.1:8000/search" + self.searchstring2(); 
    }

    var url = window.location.href;

    //get the keyword from the url
    var searchstring = url.slice(28);
    console.log('SS : ', searchstring);

    //the function called when clicking on a Spot-Event event
    self.openEvent = function(id){
        window.location = "http://127.0.0.1:8000/event" + id;
    }

    // the function called by clicking on a Ticketmaster event
    self.openTicketEvent = function(id){
        window.location = "http://127.0.0.1:8000/ticketevent" + id;
    }

    // filters all the events not matching the keyword
   self.filterf = function(event){
        return searchstring == event.event_name;
    }

    //sorts function to be used on the event array to sort them by date
    self.sortf = function(a, b){
    	var aDate = a.event_date;
    	var bDate = b.event_date;
    	return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
    }


    // the array which contain the data for the events to be displayed, the event variable contains the Spot-Event events
    // and the ticketmaster variable contains the ticketmaster events
    self.events = ko.observableArray();
    self.ticketmaster = ko.observableArray();

    // puts the data from the get request into the array
    function createEvents(data) {
        self.events(data);
    }

    // puts the data from the get request into the array
    function createTicketmaster(data) {
    	if(data.page.totalElements > 0){
    		self.ticketmaster(data._embedded.events);
    	}
    }

    // gets the events from the Spot-Event database which need to be displayed
    self.getEvents = function(){
        var json = $.getJSON('/api/event',function(data){
            console.log('Events:',data);
            data.map(el => el.venue = {'address': {'street' : ''}});
            data2 = data.filter(self.filterf);
            console.log('Filtered :',data2);
            data3 = data2.sort(self.sortf);
            console.log('Sorted :', data3);
            self.getVenues(data3);
            console.log('venues added :', self.events());
            //self.getUsers();
            console.log('user added :', self.events());
        });
    }

    // gets the events from the Ticketmaster database which need to be displayed
    self.getTicketmaster = function(){
    	var json = $.getJSON('https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + searchstring + '&countryCode=BE&apikey='+ apikey, function(data){
    		createTicketmaster(data);
            console.log('Ticketmaster :', self.ticketmaster);
    	});
    	
    }

    // the function to like the event, this is was eventually moved to the event page
    self.likeEvent = function(eventID){
        var json = $.put('api/eventlike/' + eventID + '/' + userID);
    }


    //functions must be executed when starting up the page
    self.getEvents();
    self.getTicketmaster();


    // gets the venues, addresses and users for the event data
    self.getVenues = function(events){
        events.forEach(function(event){
            var json = $.getJSON(event.venue_id,function(data){
                event.venue = data
                var json = $.getJSON(event.venue.address_id,function(data2){
                    event.venue.address = data2;
                    var json = $.getJSON(event.user_id,function(data){
                      event.user = data
                      self.events.push(event)
                    })
                })
            })
        })};
    }

    
     //function called by clicking on Tickmaster, toggles the visibility of the Ticketmaster events
    self.toggleTicket = function(){
        self.showTicketmaster(!self.showTicketmaster());
    }

    //function called by clicking on Spot-Event, toggles the visibility of the Spot-Event events
    self.toggleSpot = function(){
        self.showSpotEvent(!self.showSpotEvent());
    }

    self.showTicketmaster = ko.observable(true);
    self.showSpotEvent = ko.observable(true);


    // since jquery didnt have a put function we created one
    $.put = function(url, data, callback, type){
        if ( $.isFunction(data) ){
            type = type || callback,
            callback = data,
            data = {}
        }
        return $.ajax({
            url: url,
            type: 'PUT',
            success: callback,
            data: data,
            contentType: type
        });
    }

ko.applyBindings(viewModel);  