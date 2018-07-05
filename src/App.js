import React, { Component } from 'react';
import CryptoJS from 'crypto-js';

import InputBar from './InputBar';
import GithubInfo from './GithubInfo';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
      displayUserInfo: false,
      displayLoader: false,
      displayFollowersLoader: false,
      errorMessage: '',
      userInfo: {
        login: '',
        avatar_url: '',
        bio: '',
        followers: [
          {
            id: '',
            login: '',
            avatar_url: '',
            repos: [
              {
                id: '',
                name: '',
              },
            ],
          },
        ],
      },
    };
  }

  handleChange(event) {
    this.setState({usernameInput: event.target.value});
  }

  handleSubmit(event) {
    // Prevent browser refresh
    event.preventDefault();

    // Asynchronouse fetch data
    this.fetchUserData(this.state.usernameInput);

    // Synchronouse fetch data
    // this.fetchData(this.state.usernameInput);
    
    // Set input form value to empty
    this.setState({usernameInput: ''});
  }

  handleClick(follower_index) {
    // Get a follower object
    const follower = this.state.userInfo.followers[follower_index];

    // If follower is not null
    if (follower) {
      // Get login(username) data of follower
      const {login} = follower;

      // Asynchronouse fetch data
      return this.fetchUserData(login);

      // Synchronouse fetch data
      // return this.fetchData(login);
    }
    return null;
  }

  requestHeaders() {
    return {
      method: "GET",
      headers: {
        "Authorization": "token " + decrypt(process.env.REACT_APP_CIPHER_TOKEN, process.env.REACT_APP_PHRASE),
      },
    };
  }

  async myFetch(url, headers={}) {
    const data = await fetch(url, headers)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      });

    return data;
  }

// This is synchronouse fetch data from GITHUB API
  async fetchData(username) {
    // Define GITHUB API
    const GITHUB_USERS_API = 'https://api.github.com/users/';
    const GITHUB_USERS_URL = GITHUB_USERS_API + username;

    // Define request headers
    const REQUEST_HEADERS = this.requestHeaders();

    // Get current userInfo
    const userInfo = {...this.state.userInfo};

    // Show loader
    this.setState({
      displayLoader: true,
      displayUserInfo: false,
      errorMessage: '',
    });

    try {
      // Fetch user data according to username
      // and get data from response
      const {login, avatar_url, bio, followers_url} = await this.myFetch(GITHUB_USERS_URL, REQUEST_HEADERS);

      userInfo['login'] = login;
      userInfo['avatar_url'] = avatar_url;
      userInfo['bio'] = bio;
      userInfo['followers'] = [];

      // Set state for display user informaiton
      this.setState({
        displayLoader: false,
        displayFollowersLoader: true,
        displayUserInfo: true,
        userInfo: userInfo,
      });

      // Fet user's followers
      const followersArray = await this.myFetch(followers_url, REQUEST_HEADERS);

      // Use for loop because forEach loop is not handle with asynchronouse
      for (let i = 0; i < followersArray.length; i++) {

        // Get repos url from each follower
        const {repos_url} = followersArray[i];

        // Get repositories for each follower
        const reposArray = await this.myFetch(repos_url, REQUEST_HEADERS);

        // Set repos array for each follower
        followersArray[i]['repos'] = reposArray;

        // Set each follower into followers array
        userInfo['followers'][i] = {...followersArray[i]};

        // Set state for display each follower
        this.setState({
          displayFollowersLoader: false,
          userInfo: userInfo,
        });
      }

      // Set state in case of user have no follower
      this.setState({
        displayFollowersLoader: false,
      });

    } catch (error) {
      this.setState({
        displayLoader: false,
        displayFollowersLoader: false,
        displayUserInfo: false,
        errorMessage: error.message,
        userInfo: this.resetUserInfo(),
      });
    }

  }

// This is asynchronouse fetch data from GITHUB API
  fetchUserData(username) {

    // Show loader
    this.setState({
      displayLoader: true,
      displayUserInfo: false,
      errorMessage: '',
    });

    fetch('https://api.github.com/users/' + username, this.requestHeaders())
      .then(response => {
        if (!response.ok) {
          // Throw error when respose status is not 200
          throw Error(response.statusText);
        } else {
          // Return response data as json
          return response.json()
        }
      })
      .then(responseJson => {

        // Get datas that we need from JSON response.
        const {login, avatar_url, bio, followers, followers_url} = responseJson;
        
        // Create empty array for stores followers
        const followersArr = Array(followers).fill(null);

        this.setState({
          displayLoader: false,
          displayFollowersLoader: true,
          displayUserInfo: true,
          userInfo: this.resetUserInfo(login, avatar_url, bio, followersArr),
        });

        // Get user's followers
        this.fetchUserFollowers(followers_url);

      })
      .catch(error => {
        this.setState({
          displayLoader: false,
          displayFollowersLoader: false,
          displayUserInfo: false,
          errorMessage: error.message,
          userInfo: this.resetUserInfo(),
        });
      });
  }

  fetchUserFollowers(followers_url) {
    fetch(followers_url, this.requestHeaders())
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        // Copy followers array to modify later
        const followersArr = this.state.userInfo.followers.slice();

        responseJson.forEach((follower, index) => {
          // Get data from each follower
          const {id, login, avatar_url, repos_url} = follower;
          
          // Add each follower into array
          followersArr[index] = {
            id: id,
            login: login,
            avatar_url: avatar_url,
            repos: [],
          };

          // Get user's repos.
          this.fetchUserRepos(repos_url, index);
        });

        this.setState({
          displayFollowersLoader: false,
          userInfo: {
            ...this.state.userInfo,
            followers: followersArr,
          },
        });

      });
  }

  fetchUserRepos(repos_url, owner_index) {
    fetch(repos_url, this.requestHeaders())
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        // Get a follower object follow by owner index
        const follower = {...this.state.userInfo.followers[owner_index]};

        let repos = [];

        responseJson.forEach((repo) => {
          // Get repo data from JSON response
          const {id, name} = repo;

          // Add new object to repos array
          repos.push({
            id: id, 
            name: name
          });
        });

        // Create new follower object and change repos array property.
        const newFollower = {...follower, repos: repos};

        // Get followers array from current state.
        const followers = this.state.userInfo.followers.slice();

        // Change an old follower data to new follower data
        // which updated repos array property.
        followers[owner_index] = newFollower;

        this.setState({
          userInfo: {
            ...this.state.userInfo,
            followers: followers,
          },
        });
      });
  }

  resetUserInfo(login='', avatar_url='', bio='', followers=[]) {
    return {
      ...this.state.userInfo,
      login: login,
      avatar_url: avatar_url,
      bio: bio,
      followers: followers,
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row mb-4">
          <InputBar
            value={this.state.usernameInput}
            onChange={event => this.handleChange(event)}
            onSubmit={event => this.handleSubmit(event)} 
          />
        </div>

        {this.state.displayLoader &&
          <div className="row">
            <div className="col"></div>
            <div className="col text-center">
              <h3>Loading...</h3>
            </div>
            <div className="col"></div>
          </div>
        }
        
        {this.state.displayUserInfo ? 
          <GithubInfo 
            userInfo={this.state.userInfo}
            onClick={follower_index => this.handleClick(follower_index)} 
            displayFollowersLoader={this.state.displayFollowersLoader}
          />
          :
          this.state.errorMessage &&
            <div className="row">
              <div className="col">
                <div className="alert alert-danger" role="alert">
                  {this.state.errorMessage}
                </div>
              </div>
            </div>
        }
        
      </div>
    );
  }
}

export default App;

function decrypt(ciphertext, secret) {
  const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}