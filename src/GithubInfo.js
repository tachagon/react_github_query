import React, { Component } from 'react';

const Column = (props) => {
  return(
    <tr key={props.id}>
      <td>
        <img src={props.avatar_url} className="follower-avatar" />
        <a hreg="#" onClick={props.onClick} >
          {props.login}
        </a>
      </td>
      <td>
        {props.name ?
          <a hreg="#" onClick={props.onClick} >
            {props.name}
          </a>
          :
          "No repo."
        }
      </td>
    </tr>
  );
}

class GithubInfo extends Component {

  renderColumn(follower_index, id, login, avatar_url, name) {
    return (
      <Column 
        onClick={() => this.props.onClick(follower_index)}
        key={id}
        login={login}
        avatar_url={avatar_url}
        name={name}
      />
    );
  }

  renderTable(followers) {
    return(
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Followers:</th>
            <th scope="col">Repository</th>
          </tr>
        </thead>
        <tbody>
          {
            followers.map((follower, index) => {
              // If follower is not null.
              if (follower) {
                // Get each follower data.
                const {id, login, avatar_url, repos} = follower;

                // If follower has any repo.
                if (repos.length > 0) {
                  // Return table's row in this manner
                  // | username1 | repository1 |
                  // | username1 | repository2 |
                  // | username2 | repository3 |
                  // | username2 | repository4 |
                  return repos.map((repo) => {
                    const {id, name} = repo;
                    return (this.renderColumn(index, id, login, avatar_url, name));
                  });
                } else {
                  // Return table's row in this manner
                  // | username3 | No repo. |
                  return (this.renderColumn(index, id, login, avatar_url, null));
                }
              }
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    const {userInfo} = this.props;

    return (
      <div className="GithubInfo">
        <img src={userInfo.avatar_url} className="user-avatar" />
        <h1>Username: {userInfo.login}</h1>
        <p>Bio:<br/>{userInfo.bio}</p>

        {(!userInfo.followers || userInfo.followers.length === 0) ?
          <h2>No follower.</h2>
          :
          this.renderTable(userInfo.followers)
        }

      </div>
    );
  }
}

export default GithubInfo;