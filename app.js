import fetch from "node-fetch";
import SpotifyWebApi from "spotify-web-api-node";

class SpotifyTrackFinder {
  constructor({ clientId, clientSecret, playlistName = "" }) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });
    this.playListName = playlistName;
  }

  init = () => {
    this.spotifyAuthentication();
  };

  spotifyAuthentication = async () => {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      global.accessToken = data.body["access_token"];
      this.spotifyApi.setAccessToken(data.body["access_token"]);
      this.getUserData();
    } catch (e) {
      console.log(`e: `, e);
    }
  };

  getUserData = async () => {
    const data = await this.spotifyApi.getUserPlaylists("sircaley");

    const playlists = data.body.items.filter((item) => {
      return item.name === "2021";
    });
    if (playlists.length < 1) {
      console.log(`LOG: less than 1 playlist found`);
      return;
    }

    const [
      {
        tracks: { href },
      },
    ] = playlists;
console.log(`playlists: `, playlists);

    // const trackData = await getData(href);
    // console.log(`trackData: `, trackData.items[0].track);

    // console.log(`track name: `, trackData.items[0].track.name);
    // console.log(`artists: `, trackData.items[0].track.artists[0].name);
  };
}

const clientId = process.env.spotifyClientId;
const clientSecret = process.env.spotifyClientSecret;
const spotifyTrackFinder = new SpotifyTrackFinder({ clientId, clientSecret });
spotifyTrackFinder.init();

// Create the api object with the credentials
// const spotifyApi = new SpotifyWebApi({
//   clientId: clientId,
//   clientSecret: clientSecret,
// });

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function (data) {
//     console.log("The access token expires in " + data.body["expires_in"]);
//     console.log("The access token is " + data.body["access_token"]);

//     // Save the access token so that it's used in future calls
//     global.accessToken = data.body["access_token"];
//     spotifyApi.setAccessToken(data.body["access_token"]);
//     getUserPlaylist();
//   },
//   function (err) {
//     console.log("Something went wrong when retrieving an access token", err);
//   }
// );

// const getUserPlaylist = () => {
//   spotifyApi.getUserPlaylists("sircaley").then(
//     async function (data) {
//       const playlists = data.body.items.filter((item) => {
//         return item.name === "2021";
//       });
//       if (playlists.length < 1) {
//         console.log(`LOG: less than 1 playlist found`);
//         return;
//       }

//       const [
//         {
//           tracks: { href },
//         },
//       ] = playlists;

//       const trackData = await getData(href);
//       // console.log(`trackData: `, trackData.items[0].track);

//       console.log(`track name: `, trackData.items[0].track.name);
//       console.log(`artists: `, trackData.items[0].track.artists[0].name);
//     },
//     function (err) {
//       console.log("Something went wrong!", err);
//     }
//   );
// };

async function getData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer " + global.accessToken },
  });
  return response.json();
}
