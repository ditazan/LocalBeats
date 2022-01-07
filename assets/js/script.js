
//Ticketmaster API call to pull genres
$.ajax({
   type: "GET",
   url: "https://app.ticketmaster.com/discovery/v2/classifications/segments/KZFzniwnSyZfZ7v7nJ?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA",
   async: true,
   dataType: "json",
   success: function (data) {
      const genres = data._embedded.genres;
      for (let i = 0; i < genres.length; i++) {
         const genreIds = genres[i].id;
         const genreNames = genres[i].name;
         appendGenres(genreIds, genreNames);
      }
   },
   error: function (xhr, status, err) {
   }
});

function appendGenres(genreIds, genreNames) {
   const genreInitial = $('<option id="genreNone" value=""></option>').text("");
   const genreOptions = $('<option id="' + genreIds + '" value="' + genreIds + '"></option>').text(genreNames);
   $("#genreId").append(genreInitial, genreOptions);
}

$('.submit').on('click', function (event) {
   event.preventDefault();
   const cityName = $("#cityName").val();
   const genreId = $("#genreId").val();
   if (cityName == null || cityName == "") {
      alert("ERROR: A city name is required. Please enter a city name.")
   }
   else

      $.ajax({
         type: "GET",
         url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size=20&genreId=" + genreId + "&city=" + cityName + "&radius=100&unit=miles",
         async: true,
         dataType: "json",
         success: function (eventsData) {
            const events = eventsData._embedded.events;
            console.log(events);
            for (let i = 0; i < events.length; i++) {
               const eventDate = events[i].dates.start.localDate;
               const eventTime = events[i].dates.start.localTime;
               const eventTimeZone = events[i].dates.timezone;
               const eventStatus = events[i].dates.status.code;
               const eventName = events[i].name;
               const venueArray = events[i]._embedded.venues;
               console.log(eventDate, eventTime, eventTimeZone, eventStatus, eventName);
               venueParse(venueArray);
            }

         },
         error: function (xhr, status, err) {

         }
      })

});

function venueParse(venueArray) {
   for (let index = 0; index < venueArray.length; index++) {
      const venueId = venueArray[index].id;
      const venueName = venueArray[index].name;
      const venueAddress = venueArray[index].address.line1;
      const venueCity = venueArray[index].city.name;
      const venueState = venueArray[index].state.stateCode;
      const venueZip = venueArray[index].postalCode;
      const venueLat = venueArray[index].location.latitude;
      const venueLong = venueArray[index].location.longitude;
      const venueTimeZone = venueArray[index].timezone
      console.log(venueId, venueName, venueAddress, venueCity, venueState, venueZip, venueLat, venueLong, venueTimeZone);
   }
};