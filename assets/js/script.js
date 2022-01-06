
//Ticketmaster API call to pull genres
$.ajax({
   type: "GET",
   url: "https://app.ticketmaster.com/discovery/v2/classifications/segments/KZFzniwnSyZfZ7v7nJ?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA",
   async: true,
   dataType: "json",
   success: function (data) {
      const genres = data._embedded.genres;
      // console.log(genres);
         for (let i = 0; i < genres.length; i++) {
                   const genreIds = genres[i].id;
                    const genreNames = genres[i].name;
                    console.log(genreIds,genreNames);
               }
   },
   error: function (xhr, status, err) {
   }
});


const genreId = "KnvZfZ7vAeA"; //rock genre
const radius = "200"; // radius does not appear to be functioning
const postalCode = "28202"; // postal code appears to be specific to the venue
const size = "100"; //not working
const status = "onsale"
// ticketmaster events api call
$.ajax({
  type:"GET",
  url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size="+size+"&genreId="+genreId,
  async:true,
  dataType: "json",
  success: function(eventsData) {
     const events=eventsData._embedded.events;
              console.log(events);

           },
  error: function(xhr, status, err) {

           }
});
