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
   error: function (xhr, status, err) { },
});

function appendGenres(genreIds, genreNames) {
   const genreOptions = $(
      `<option value="${genreIds},${genreNames}"></option>`
   ).text(genreNames);
   $("#genreId").append(genreOptions);
}

$(".submit").on("click", function (event) {
   event.preventDefault();
   var genreData = $("#genreId").val().split(",");
   var genreId = genreData[0].trim();
   var genreName = genreData[1];
   var cityName = $("#cityName").val().trim();
   if (cityName == null || cityName == "") {
      inputError();
      return;
   } else if (genreId == null || genreId == "") {
      inputError();
      return;
   } else getYouTube(genreName);

   $.ajax({
      type: "GET",
      url: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size=20&genreId=${genreId}&city=${encodeURIComponent(
         cityName
      )}`,
      async: true,
      dataType: "json",
      success: function (eventsData) {

         var events = eventsData._embedded.events;
         console.log(events);
         if (events.length > 5) {
            for (let i = 0; i < 5; i++) {
               const eventDate = events[i].dates.start.localDate;
               const eventTime = events[i].dates.start.localTime;
               const eventStatus = events[i].dates.status.code;
               var eventVenue = events[i]._embedded.venues[0].name;
               var eventLocation = events[i]._embedded.venues[0].address.line1;
               const eventName = events[i].name;
               const venueArray = events[i]._embedded.venues;
               console.log(venueArray);
               makeEvents(
                  eventName,
                  eventDate,
                  eventVenue,
                  eventLocation,
                  eventStatus
               );
            }
         } else if (events === undefined) {
            $(".event-display p").text("Sorry No Events Available");
         }
         else {
            for (let i = 0; i < events.length; i++) {
               const eventDate = events[i].dates.start.localDate;
               const eventTime = events[i].dates.start.localTime;
               const eventStatus = events[i].dates.status.code;
               var eventVenue = events[i]._embedded.venues[0].name;
               var eventLocation = String(events[i]._embedded.venues[0].address.line1);
               const eventName = events[i].name;
               console.log(eventName);
               const venueArray = events[i]._embedded.venues;
               console.log(venueArray);
               makeEvents(
                  eventName,
                  eventDate,
                  eventVenue,
                  eventLocation,
                  eventStatus
               );
            }
         }
      },
      error: function (xhr, status, err) {
         inputError();
      },
   });
   resultPage();
});

function venueParse(venueArray) {
  for (let index = 0; index < venueArray.length; index++) {
    var venueId = venueArray[index].id;
    var venueName = venueArray[index].name;
    var venueAddress = venueArray[index].address.line1;
    var venueCity = venueArray[index].city.name;
    var venueState = venueArray[index].state.stateCode;
    var venueZip = venueArray[index].postalCode;
    var venueLat = venueArray[index].location.latitude;
    var venueLong = venueArray[index].location.longitude;
    var venueTimeZone = venueArray[index].timezone;
    //  console.log(
    //    venueId,
    //    venueName,
    //    venueAddress,
    //    venueCity,
    //    venueState,
    //    venueZip,
    //    venueLat,
    //    venueLong,
    //    venueTimeZone
    //  );
  }
}

const getYouTube = function (genreName) {
   // fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(genreName)}%20music&type=video&key=AIzaSyC4AYVtJ1KEsd6TtAnFspQ3jpN7ORCFQZs`)
   fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(genreName)}%20music&type=video&key=AIzaSyC4AYVtJ1KEsd6TtAnFspQ3jpN7ORCFQZs`)
      .then(async function (response) {
         if (response.ok) {
            const dataYouTube = await response.json();
            console.log(dataYouTube);
            const youtubeCallEtag = dataYouTube.etag;
            const youtubeNextToken = dataYouTube.nextPageToken;
            console.log(youtubeCallEtag, youtubeNextToken);
            for (let yt = 0; yt < dataYouTube.items.length; yt++) {
               const videoEtag = dataYouTube.items[yt].etag;
               const videoId = dataYouTube.items[yt].id.videoId;
               const videoTitle = dataYouTube.items[yt].title;
               const videoChannelId = dataYouTube.items[yt].snippet.channelId;
               const videoChannelTitle = dataYouTube.items[yt].snippet.channelTitle;
               const videoDesc = dataYouTube.items[yt].snippet.description;
               const videoDateTime = dataYouTube.items[yt].snippet.publishTime;
               const videoThumbSm = dataYouTube.items[yt].snippet.thumbnails.default.url;
               const videoThumbMd = dataYouTube.items[yt].snippet.thumbnails.medium.url;
               const videoThumbLg = dataYouTube.items[yt].snippet.thumbnails.high.url;
               console.log(videoThumbSm, videoThumbMd, videoThumbLg);
               option1(videoId, videoChannelTitle, videoDesc, videoThumbSm);

            };
         } else {
            alert(error + " something went wrong");
         }
      })
};


function option1(videoId, videoChannelTitle, videoDesc, videoThumbSm) {
  $(".input-window").append(`<button type='button' class='input-button' id='${videoId}' onclick=crtVideoPlayer('${videoId}')><img src='${videoThumbSm}' alt='${videoChannelTitle}' /><span>${videoChannelTitle}<br>${videoDesc}</span></button>`);
};


function crtVideoPlayer(videoId) {
  document.cookie.samesite = 'none; secure';
  $(".action-window").append('<div class="vidModal" display="none"></div>');
  $(".vidModal").append('<div class="vidHeader" display="none"><img src="./assets/images/close.png" alt="button to close modal" class="imgClose" display="none" onclick=closeModal() /></div>');
  $(".vidModal").append('<div class="vidBody" display="none"></div>');
  const videoPlayer = $(`<iframe id="player" class="youtube" type="text/html" samesite="none;secure" width="340" height="207" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&samesite=none;secure" frameborder="0"></iframe>`);
  $(".vidBody").append(videoPlayer);
}


const closeModal = function () {
  $(".youtube").remove();
  $(".vidModal").remove();
  $(".vidHeader").remove();
  $(".imgClose").remove();
  $(".vidBody").remove();
}

var resultPage = function () {
  $(".input-window").remove();
  $(".submit").remove();

  $(".action-window").append(
    "<div class='event-display border '> <p class='tab-title'>You should checkout ...</p></div>"
  );
  $(".action-window").append(
    "<div class='input-window border '> <p class='tab-title'>You should checkout ...</p></div>"
  );
 $(".go-back").show();
  $(".go-back").on("click", function () {
    location.reload();
  });
};

var inputError = function () {
   var errorModal = $(
      "<div class='error-modal'>Invalid genre selection or City<p style='color:red; padding-top:10px; font-size:14px'> exit </p></div>"
   );
   $("body").append(errorModal);
   errorModal.on("click", function () {
      location.reload();
   });
};

let selectedGenreHistory = [];

var saveLocal = function () {
   localStorage.setItem("selectedGenres", selectedGenreHistory);
};

var loadLocal = function () {
   var existing = JSON.parse(localStorage.getItem("selectedGenres"));
   existing = existing ? existing.split(",") : [];
};

var makeSelectedGenre = function (genre) {
   var selectedG = $(
      "<button class='selected " + genre + "'>" + genre + "</button>"
   );
   $(".selected-genres").append(selectedG);
};

$("select").on("change", function () {
   var selectedGenre = $("select option:selected").text();
   //   saveLocal();
   //   loadLocal();
   selectedGenreHistory.push(selectedGenre);
   console.log(selectedGenreHistory);
   console.log(selectedGenre);
});

var makeEvents = function (artist, date, venue, location, availibility) {
  var eventBox = $("<div class='border event'></div>");
  var eventHead = $("<div class='eventHead' ></div>");
  var eventArtist = $("<p style='font-style:italic'>" + artist + "</p>");
  var eventDate = $("<p>" + date + "</p>");
  var eventVenue = $("<p>" + venue + "</p>");
  var eventLocation = $("<p>" + location + "</p>");
  var eventAvail = $("<p>" + availibility + "</p>");

  $(".event-display").append(eventBox);
  eventBox.append(eventHead);

  eventHead.append(eventArtist);
  eventHead.append(eventDate);

  eventBox.append(eventVenue);
  eventBox.append(eventLocation);
  eventBox.append(eventAvail);
};
