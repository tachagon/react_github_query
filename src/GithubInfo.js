import React, { Component } from 'react';

const Row = (props) => {
  return(
    <tr key={props.id}>
      <td>
        <img src={props.avatar_url} className="follower-avatar" alt="follower-avatar" />
        <a hreg="#" onClick={props.onClick} className="black" >
          {props.login}
        </a>
      </td>
      <td>
        {props.name ?
          <a hreg="#" onClick={props.onClick} className="blue" >
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

  renderRow(follower_index, id, login, avatar_url, name) {
    return (
      <Row 
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
                    return (this.renderRow(index, id, login, avatar_url, name));
                  });
                } else {
                  // Return table's row in this manner
                  // | username3 | No repo. |
                  return (this.renderRow(index, id, login, avatar_url, null));
                }
              }
              return null;
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    const {userInfo} = this.props;

    return (
      <div className="row">
        <div className="col-md-3">
          <img
            src={userInfo.avatar_url}
            className="img-fluid d-block"
            alt="user-avatar"
          />
        </div>
        <div className="col-md-9">
          <h1 className="display-1">{userInfo.login}</h1>
          <p className="lead">Bio:</p>
          <p>{userInfo.bio}</p>

          {(!userInfo.followers || userInfo.followers.length === 0) ?
            <div className="row">
              <div className="col">
                <p className="lead">No follower.</p>
              </div>
            </div>
            :
            this.renderTable(userInfo.followers)
          }

        </div>
      </div>
    );
  }
}

export default GithubInfo;