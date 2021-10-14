/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }*/
async function searchShows(query) {

  const response =  await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const shows = [];
  
  //place the show object into an empty array per each data from response
  for(let data of response.data){
    shows.push(data.show)
  }
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="">
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);
      $showsList.append($item);

    //add show image if it exists
    try{
      $item.find('.card-img-top').attr('src', show.image.medium)
    }catch(err){
      console.log(err);
      $item.find('.card-img-top').attr('src', "https://tinyurl.com/tv-missing");
    }

    //add episodes button at the end of the card
    const $episodeButton = $('<button type="button" class="btn btn-primary">Episodes</button>');
    $episodeButton.on('click', async function(){
      const episodes = await getEpisodes(show.id);
      populateEpisodes(episodes);
    });
    $item.find('.card-body').append($episodeButton);
  }
};

/** Populate episodes list:
 *     - given list of episodes, add episodes to DOM */
function populateEpisodes(episodes){
  const $episodesList = $("#episodes-list");

  $episodesList.empty();
  for(let episode of episodes){
    const $item = $(`<li>${episode.name} (season: ${episode.season}, episode: ${episode.number})</li>`);
    $episodesList.append($item);
  }
  //show episodes list; initially hidden
  $("#episodes-area").show();
}

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }*/
 async function getEpisodes(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  return episodes.data;
}



/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list*/
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});