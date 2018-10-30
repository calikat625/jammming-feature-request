import React, { Component } from 'react';
import './SearchBar.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withAlert } from 'react-alert';

class SearchBar extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    const { cookies } = props;
    super(props);
    this.state = {
      searchTerm: cookies.get('searchTerm') || ''
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  search() {
    if (!this.state.searchTerm.length) {
      this.props.alert.info('Search value required');
      return;
    }
    this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange(event) {
    const { cookies } = this.props;
    cookies.set('searchTerm', event.target.value, {
      path: '/',
      maxAge: 3600
    });
    this.setState({searchTerm: event.target.value});
  }

  handleKeyUp(event) {
    if (event.key === 'Enter' && this.state.searchTerm.length) {
      this.search();
    }
  }

  componentDidMount() {
    if (!this.state.searchTerm.length) {
      return;
    }
    this.props.onSearch(this.state.searchTerm);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Enter A Song, Album, or Artist"
          value={this.state.searchTerm}
          onChange={this.handleTermChange}
          onKeyUp={this.handleKeyUp}
        />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default withAlert(withCookies(SearchBar));
