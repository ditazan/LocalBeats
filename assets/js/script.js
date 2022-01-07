//Ticketmaster API call to pull genres
let genreDataset=[];
$.ajax({
  type: "GET",
  url: "https://app.ticketmaster.com/discovery/v2/classifications/segments/KZFzniwnSyZfZ7v7nJ?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA",
  async: true,
  dataType: "json",
  success: function (data) {
    const genres = data._embedded.genres;
    for (let i = 0; i < genres.length; i++) {
      var genreIds = genres[i].id;
      var genreNames = genres[i].name;
      var subGenre = genres[i].subGenres;
      var genre={
         name: genreNames,
         id: genreIds
      }
      genreDataset.push(genre);
      console.log(genre);
    }
  },
  error: function (xhr, status, err) {},
});


console.log(genreDataset);

genreId = "KnvZfZ7vAeA"; //rock genre
const radius = "500"; // radius does not appear to be functioning
const postalCode = "28202"; // postal code appears to be specific to the venue
const city = "Houston";
const size = "10";
const status = "onsale";
// ticketmaster events api call
$.ajax({
  type: "GET",
  url:
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size=" +
    size +
    "&genreId=" +
    genreId +
    "&city=" +
    city +
    "&radius=" +
    radius +
    "&unit=miles",
  async: true,
  dataType: "json",
  success: function (eventsData) {
    const events = eventsData._embedded.events;
    console.log(events);
  },
  error: function (xhr, status, err) {},
});
var resultPage = function () {
  $(".input-window").remove();
  $(".submit").remove();
  $(".action-window").append(
    "<div class='input-window border'> <p class='tab-title'>You should checkout ..</p> poopie</div>"
  );
  $("#visual").show();
  $("#go-back").on("click", function () {
    location.reload();
    console.log("slick");
  });
};

$(".submit").on("click", function () {
  resultPage();
});
