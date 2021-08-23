// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4-07aYWAvCFXh5PWpI3fYVu4MFwquNgI",
  authDomain: "edutech-318507.firebaseapp.com",
  projectId: "edutech-318507",
  storageBucket: "edutech-318507.appspot.com",
  messagingSenderId: "194404881591",
  appId: "1:194404881591:web:39198ee613a95b9fa1e932"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // let uid = user.uid;
    const user = firebase.auth().currentUser;

    if (user !== null) {
      // User is signed in
      $("#signUp").css('display', 'none');
      $("#icons").css('display', 'inline');
    }
  } else {
    // User is signed out
    $("#signUp").css('display', 'inline');
    $("#icons").css('display', 'none');
  }
});

function logout() {
  const socket = io();
  const user = firebase.auth().currentUser;

  socket.emit('logout', user.uid);
  
  firebase.auth().signOut().then(() => {
    // success
    window.location.href = '/';
    alert('계정이 로그아웃 되었습니다.');
  }).catch((error) => {
    alert('Error: ', error);
    console.log(error)
  });
}
