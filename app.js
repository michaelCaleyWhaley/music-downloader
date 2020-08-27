import fetch from "node-fetch";
import SpotifyWebApi from "spotify-web-api-node";
import YoutubeSearch from "./lib/YoutubeSearch";
import YoutubeDownloader from "./lib/YoutubeDownloader";

class SpotifyTrackFinder {
  constructor({
    clientId,
    clientSecret,
    playlistName = "2019",
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
    if (!json.items) {
      console.log("No tracks fetched");
      return;
    }

    const tracks = json.items.map(
      ({ track: { artists, name, duration_ms } }) => ({
        artist: artists.map(({ name }) => name).join(" "),
        name,
        duration_ms,
      })
    );

    this.findDownloadLinks(tracks);
  };

  findDownloadLinks = async (tracks) => {
    const youtubeSearch = new YoutubeSearch();

    const downloadLinks = await tracks.map(async ({ artist, name }) => {
      const { results } = await youtubeSearch.init(`${artist} ${name}`);

      const [{ link }] = results.filter(({ link, description }) => {
        if (link.toLowerCase().indexOf("channel") !== -1) {
          return false;
        }
        if (description.toLowerCase().indexOf("live") === -1) {
          return { link, description };
        }
        return false;
      });

      return { artist, name, link };
    });

    Promise.all(downloadLinks).then((result) => {
      const youtubeDownloader = new YoutubeDownloader();
      youtubeDownloader.init(result);
    });
  };
}

const clientId = process.env.spotifyClientId;
const clientSecret = process.env.spotifyClientSecret;
const spotifyTrackFinder = new SpotifyTrackFinder({ clientId, clientSecret });
spotifyTrackFinder.init();
