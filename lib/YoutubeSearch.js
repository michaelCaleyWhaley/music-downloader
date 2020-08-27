import search from "youtube-search";

class YoutubeSearch {
  constructor() {
    this.maxResults = 5;
    this.key = process.env.youtubeApiKey;
  }

  init = (searchTerm) => {
    return this.fetchData(searchTerm);
  };

  fetchData = async (searchTerm) => {
    const searchResults = await search(searchTerm, {
      maxResults: this.maxResults,
      key: this.key,
    });
    return searchResults;
  };
}

export default YoutubeSearch;
