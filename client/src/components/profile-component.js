import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const ProfileComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>你需要先登入!</div>}
      {currentUser && (
        <div>
          <h1>Profile page.</h1>
          <header className="jumbotron">
            <h3>
              <strong>{currentUser.user.username}</strong>
            </h3>
          </header>
          <h3>
            <strong>Token:{currentUser.token}</strong>
          </h3>
          <h3>
            <strong>ID:{currentUser.user._id}</strong>
          </h3>
          <h3>
            <strong>Email:{currentUser.user.email}</strong>
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
