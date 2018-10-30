let userAccessToken = '';
const clientId = 'ac35928a20b94432827b81049cb4ce8f';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (userAccessToken.length) {
      return userAccessToken;
    }

    const accessToken = window.location.href.match(/access_token=([^&]*)/);
    const expiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (accessToken && expiresIn) {
      userAccessToken = accessToken[1];
      window.setTimeout(() => {
        userAccessToken = '';
      }, Number(expiresIn[1])*1000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectURI}&scope=playlist-modify-public`;
    }
  },

  getUserId(accessToken) {
    try {
      const headers = {Authorization: `Bearer ${accessToken}`};
      return fetch(`https://api.spotify.com/v1/me`, {
        headers: headers
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }).then(jsonResponse => {
        return jsonResponse.id ? jsonResponse.id : '';
      });
    } catch(error) {
      console.log(error);
    }
  },

  async getPlaylistId(accessToken, userId, playlistName) {
    try {
      const headers =  {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json'
      };
      const data = JSON.stringify({
        name: playlistName,
        public: true,
      });
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: data
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.id;
      }
    } catch(error) {
      console.log(error);
    }
  },

  search(term) {
    const accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
  			return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message);
    }).then(jsonResponse => {
      if (jsonResponse.tracks.items) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  async savePlaylist(playlistName, trackURIs) {
    if (!(playlistName.length && trackURIs.length)) {
      return;
    }
    const accessToken = this.getAccessToken();
    const userId = await this.getUserId(accessToken);
    const playlistId = await this.getPlaylistId(accessToken, userId, playlistName);
    const data = JSON.stringify({ uris: trackURIs });
    const headers =  {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json'
    };
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: headers,
      method: 'POST',
      body: data
    }).then(response => {
      if (response.ok) {
    		return response.json();
      }
    }).then(jsonResponse => {
      return JSON.stringify(jsonResponse);
    });
  }

}

export default Spotify;
