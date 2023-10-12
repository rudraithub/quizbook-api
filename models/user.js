// models/user.js
const Profile = require('./profile');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.profile = null; // Initialize with an empty profile
  }
}

module.exports = User;
