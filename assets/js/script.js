
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
      //  console.log(cityName,genreId);

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
               const eventVenue = events[i]._embedded.venues;
               console.log(eventDate, eventTime, eventTimeZone, eventStatus, eventName);
               console.log(eventVenue);
            }

         },
         error: function (xhr, status, err) {

         }
      })

});
