firebase.auth().onAuthStateChanged((user) => {
  console.log('hi')
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    $('#user_div').css('display', 'block');
    $('#login_div').css('display', 'none');
    // let uid = user.uid;

    const user = firebase.auth().currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const uid = user.uid;
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      $("#user_para").text(`Welcome User : ${email} ${displayName} ${uid} ${photoURL} ${emailVerified}`)

      global.user = displayname;
      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }
    // ...
  } else {
    // User is signed out
    $('#user_div').css('display', 'none');
    $('#login_div').css('display', 'block');
  }
});


function login() {
  let userEmail = $('#email_field').val();
  let userPass = $('#password_field').val();

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
  });
}

function logout() {
  firebase.auth().signOut().then(() => {
    // success
  }).catch((error) => {
    alert('Error: ', error);
  });
}

function loginSocial(social) {
  let provider;
  if (social === 'Google') {
    provider = new firebase.auth.GoogleAuthProvider();
  } else if (social === 'Facebook') {
    provider = new firebase.auth.FacebookAuthProvider();
  }
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}
