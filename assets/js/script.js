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
         console.log(genreIds, genreNames);
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
   error: function (xhr, status, err) {
   }
});

function appendGenres(genreIds, genreNames) {
   const genreOptions = $(`<option value="${genreIds},${genreNames}"></option>`).text(genreNames);
   $("#genreId").append(genreOptions);
}

$('.submit').on('click', function (event) {
   event.preventDefault();
   const genreData = $("#genreId").val().split(",");
   const genreId = genreData[0].trim();
   const genreName = genreData[1].trim();
   const cityName = $("#cityName").val().trim();
   console.log(genreName, genreId);
   if (cityName == null || cityName == "") {
      alert("ERROR: A city name is required. Please enter a city name.")
      return
   } else if (genreId == null || genreId == "") {
      alert("ERROR: A music genre is required. Please select a music genre.")
      return
   }
   else
      getYouTube(genreName);
   $.ajax({
      type: "GET",
      url: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=mN8PQ731bAnsxgiKstMF7PWhVZtHxsEA&size=20&genreId=${genreId}&city=${encodeURIComponent(cityName)}&radius=100&unit=miles`,
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

const getYouTube = function (genreName) {
   fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(genreName)}%20music&type=video&key=AIzaSyC4AYVtJ1KEsd6TtAnFspQ3jpN7ORCFQZs`)
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
               // console.log(videoEtag, videoId, videoTitle, videoChannelId, videoChannelTitle, videoDesc, videoDateTime);
               console.log(videoThumbSm, videoThumbMd, videoThumbLg);
               // crtVideoPlayer(videoId);
               option1(videoId, videoChannelTitle, videoDesc,videoThumbSm)

            };
         } else {
            alert(error + " something went wrong");
         }
      })
};

// function crtVideoPlayer(videoId) {
//    const videoPlayer = $(`<iframe id="player" class="youtube" display = "block" type="text/html" width="340" height="207" src="http://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0"></iframe>`);
//    $(".input-window").append(videoPlayer);
// }

function option1(videoId, videoChannelTitle, videoDesc,videoThumbSm) {
   $(".input-ul").append(`<li class='input-li' id = '${videoId}'><img src='${videoThumbSm}' class='${videoId}' alt='${videoChannelTitle}'><span>${videoChannelTitle}<br>${videoDesc}</span></ul>`);
}

var resultPage = function () {
   $(".input-window").remove();
   $(".submit").remove();
   $(".action-window").append(
      "<div class='input-window border'> <p class='tab-title'>You should checkout ..</p></div>"
   );
   $(".input-window").append("<ul class='input-ul'></ul>");
   
   $("#visual").show();
   $("#go-back").on("click", function () {
      location.reload();
      console.log("slick");
   });
};

$(".submit").on("click", function () {
   resultPage();
});

