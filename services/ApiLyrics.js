const axios = require('axios');

class LyricsApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.lyrics.ovh'
    });
  }

  getLyrics = (artist, song) => this.api.get(`https://api.lyrics.ovh/v1/${artist}/${song}`);

}


module.exports = LyricsApi