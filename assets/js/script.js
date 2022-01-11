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
      {
        // for (let sub = 0; sub < genres[i]._embedded.subgenres.length; sub++) {
        //    const subGenreId = genres[i]._embedded.subgenres[sub].id;
        //    const subGenreName = genres[i]._embedded.subgenres[sub].name;
        //    console.log(subGenreId,subGenreName);
        // }
      }
      appendGenres(genreIds, genreNames);
    }
  },
  error: function (xhr, status, err) {},
});

function appendGenres(genreIds, genreNames) {
  const genreOptions = $(`<option value="${genreIds}">${genreNames}</option>`);
  $("#genreId").append(genreOptions);
}

$(".submit").on("click", function (event) {
  event.preventDefault();
  const genreData = $("#genreId").val().split(",");
  const genreId = genreData[0].trim();
  const genreName = genreOptions.text();
  const cityName = $("#cityName").val().trim();
  if (cityName == null || cityName == "") {
    inputError();
    return;
  } else if (genreId == null || genreId == "") {
    inputError();
    return;
  } else resultPage();
  getYouTube(genreName);
  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size=5&genreId=" +
      genreId +
      "&city=" +
      cityName +
      "&radius=100&unit=miles",
    async: true,
    dataType: "json",
    success: function (eventsData) {
      const events = eventsData._embedded.events;
      console.log(events);
      for (let i = 0; i < events.length; i++) {
        const eventDate = events[i].dates.start.localDate;
        const eventTime = events[i].dates.start.localTime;
        const eventStatus = events[i].dates.status.code;
        var eventVenue = events[i]._embedded.venues[0].name;
        const eventName = events[i].name;
        const venueArray = events[i]._embedded.venues;
        makeEvents(eventName, eventDate, eventVenue);
        //   console.log(
        //     eventDate,
        //     eventTime,
        //     eventTimeZone,
        //     eventStatus,
        //     eventName
        //   );
        venueParse(venueArray);
      }
    },
    error: function (xhr, status, err) {
      inputError();
    },
  });
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

var getYouTube = function (genreName) {
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      genreName
    )}%20music&type=video&key=AIzaSyC4AYVtJ1KEsd6TtAnFspQ3jpN7ORCFQZs`
  ).then(async function (response) {
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
        const videoThumbSm =
          dataYouTube.items[yt].snippet.thumbnails.default.url;
        const videoThumbMd =
          dataYouTube.items[yt].snippet.thumbnails.medium.url;
        const videoThumbLg = dataYouTube.items[yt].snippet.thumbnails.high.url;
        console.log(
          videoEtag,
          videoId,
          videoTitle,
          videoChannelId,
          videoChannelTitle,
          videoDesc,
          videoDateTime
        );
        console.log(videoThumbSm, videoThumbMd, videoThumbLg);
        crtVideoPlayer(videoId);
      }
    } else {
      alert(error + " something went wrong");
    }
  });
};

function crtVideoPlayer(videoId) {
  const videoPlayer = $(
    `<iframe id="player" class="youtube" display = "block" type="text/html" async="" width="340" height="207" src="http://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0"></iframe>`
  );
  $(".input-window").append(videoPlayer);
}

var resultPage = function () {
  $(".input-window").remove();
  $(".submit").remove();
  $(".action-window").append(
    "<div class='input-window border event-display'> <p class='tab-title'>You should checkout ..</p> </div>"
  );
  //   $("#visual").show();
  $("#go-back").on("click", function () {
    location.reload();
    console.log("slick");
  });
};

var inputError = function () {
  var errorModal = $(
    "<div class='error-modal'>Invalid genre selection or City<p style='color:red; padding-top:10px; font-size:12px'> exit </p></div>"
  );
  $("body").append(errorModal);
  errorModal.on("click", function () {
    errorModal.remove();
  });
};

let selectedGenreHistory = [];

var saveLocal = function () {
  localStorage.setItem("selectedGenres", selectedGenreHistory);
};

var loadLocal = function () {
  var existing = JSON.parse(localStorage.getItem("selectedGenres"));

  existing = existing ? existing.split(',') : [];

//   $.each(selectedGenreHistory, function () {
//     makeSelectedGenre(selectedGenreHistory[i]);
//   });
};

var makeSelectedGenre = function (genre) {
  var selectedG = $("<button class='selected "+genre+"'>" + genre + "</button>");
  $(".selected-genres").append(selectedG);
};

$("select").on("change", function () {
  var selectedGenre = $("select option:selected").text();
  saveLocal();
  loadLocal();
  selectedGenreHistory.push(selectedGenre);
  saveLocal();
  console.log(selectedGenreHistory);
  console.log(selectedGenre);
});

var makeEvents = function (artist, date, venue) {
  var eventBox= $("</div>");

  

  $("event-display").append(eventBox);
}
