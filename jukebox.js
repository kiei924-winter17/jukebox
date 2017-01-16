$(function() {
  var fetchTracks = function(albumId, callback) {
    $.ajax({
      url: 'https://api.spotify.com/v1/albums/' + albumId,
      success: function(response) {
        callback(response);
      }
    });
  };
  var searchAlbums = function(query) {
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: query,
        type: 'album'
      },
      success: function(response) {
        // Set a window-level variable so we can use it in the console
        window.response = response;

        // Write the response from Spotify to the console, in pretty collapsible way
        console.log(response);

        // See all the guts
        console.log(JSON.stringify(response));

        // Empty the existing album list
        $('.album-list').show().empty()

        // Fill the album list with each album in the response
        $.each(response.albums.items, function(index, album) {
          var markup = '<img src="' + album.images[0].url +'" data-album-id="' + album.id + '">';
          $('.album-list').append(markup);
        });
      }
    });
  };
  $('form').on('submit', function(event) {
    event.preventDefault();
    searchAlbums($('#artist').val());
  });
  $(document).on('click', '.album-list img', function(event) {
    fetchTracks($(this).data('album-id'), function(data) {
      if (window.audioObject !== undefined) {
        window.audioObject.pause();
      }
      window.audioObject = new Audio(data.tracks.items[0].preview_url);
      window.audioObject.play();
    });
  });
  $(document).on('click', '.stop-it', function(event) {
    event.preventDefault();
    if (window.audioObject !== undefined) {
      window.audioObject.pause();
    }
  });
});