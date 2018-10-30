import React, { Component } from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';
import { withAlert } from 'react-alert';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  onSave() {
    if (!this.props.playlistName.length && !this.props.playlistTracks.length) {
      this.props.alert.info('Name and Track(s) are empty');
      return;
    } else if (!this.props.playlistName.length) {
      this.props.alert.info('Playlist Name is required');
      return;
    }
    this.props.onSave();
  }

  render() {
    return (
      <div className="Playlist">
        <input
          placeholder={this.props.playlistNamePlaceholder}
          value={this.props.playlistName}
          onChange={this.handleNameChange}
          />

        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />

        <a
          className="Playlist-save"
          onClick={this.onSave}
          >SAVE TO SPOTIFY</a>
      </div>
    )
  }
}

export default withAlert(Playlist);
