import decode from 'jwt-decode';

class AuthService {
  //get user data from token
  getProfile() {
    return decode(this.getToken());
  }

  //check if user is logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  //check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }
  //get token from local storage
  getToken() {
    return localStorage.getItem('id_token');
  }
  //set token to localstorage and reload page to homepage
  login(idToken) {
    //save user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }
  //clear token from localstorage and force logout with window.location.assign('/')
  logout() {
    //clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    //reload page to homepage
    window.location.assign('/');
  }
}

export default new AuthService();
