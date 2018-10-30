import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
      playlistNamePlaceholder: 'New Playlist'
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.loadAsNew = this.loadAsNew.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState({ playlistTracks: [...this.state.playlistTracks, track]});
  }

  removeTrack(track){
    const playlist = this.state.playlistTracks.filter(removedTrack => removedTrack.id !== track.id);
    this.setState({ playlistTracks: playlist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => (
      track.uri
    ));
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: ''});
    this.setState({playlistTracks: []});
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  loadAsNew() {
    const { cookies } = this.props;
    cookies.remove('searchTerm');
    window.location = '/';
  }

  render() {
    return (
      <div>
        <h1><a onClick={this.loadAsNew}>Ja<span className="highlight">mmm</span>ing</a></h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
            onSearchTermChange={this.updateSearchTerm}
          />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistNamePlaceholder={this.state.playlistNamePlaceholder}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
// export default App;
export default withCookies(App);
