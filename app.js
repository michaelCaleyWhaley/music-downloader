import fetch from "node-fetch";
import SpotifyWebApi from "spotify-web-api-node";

class SpotifyTrackFinder {
  constructor({
    clientId,
    clientSecret,
    playlistName = "2021",
    userName = "sircaley",
  }) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });
    this.playListName = playlistName;
    this.userName = userName;
  }

  init = () => {
    this.spotifyAuthentication();
  };

  spotifyAuthentication = async () => {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      global.accessToken = data.body["access_token"];
      this.spotifyApi.setAccessToken(data.body["access_token"]);
      this.getTrackHref();
    } catch (e) {
      console.log(`spotifyAuthentication error: `, e);
    }
  };

  findPlaylist = (playlistArray) => {
    return playlistArray.filter((item) => {
      return item.name === this.playListName;
    });
  };

  getTrackHref = async () => {
    try {
      const data = await this.spotifyApi.getUserPlaylists(this.userName);

      const playlists = this.findPlaylist(data.body.items);
      if (playlists.length < 1) {
        console.log(`LOG: less than 1 playlist found`);
        return;
      }
      const [
        {
          tracks: { href },
        },
      ] = playlists;
      this.fetchTrackData(href);
    } catch (e) {
      console.log(`getUserData error: `, e);
    }
  };

  fetchTrackData = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + global.accessToken },
    });
    const json = await response.json();

    console.log(`json: `, json);

    // console.log(`track name: `, trackData.items[0].track.name);
    // console.log(`artists: `, trackData.items[0].track.artists[0].name);
  };
}

const clientId = process.env.spotifyClientId;
const clientSecret = process.env.spotifyClientSecret;
const spotifyTrackFinder = new SpotifyTrackFinder({ clientId, clientSecret });
spotifyTrackFinder.init();
