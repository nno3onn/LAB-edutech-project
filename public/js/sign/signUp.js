// const provider = new firebase.auth.GoogleAuthProvider();

// firebase.auth().signInWithPopup(provider0.then((result) => {
//   let token = result.credential.accessToken;
//   let user = result.user;
// }))
console.log(firebase);

firebase.initializeApp({
  apiKey: 'AIzaSyA4-07aYWAvCFXh5PWpI3fYVu4MFwquNgI',
  authDomain: 'edutech-318507.firebaseapp.com',
  projectId: 'edutech-318507',
  storageBucket: 'edutech-318507.appspot.com',
  messagingSenderId: '194404881591',
  appId: '1:194404881591:web:39198ee613a95b9fa1e932'
});

const user = firebase.auth().currentUser;
console.log(user)

if (user !== null) {
  user.providerData.forEach((profile) => {
    
    $('#welcome').text(`${profile.providerID}님 안녕하세요!`);
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
} else {
}

$("#login").on('click', e => {
  console.log(111)

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // 로그인 되어 있을 때 처리
        } else {
          firebase.auth().signInWithPopup(provider)
            .then((result) => {
              let token = result.credential.accessToken;
              let user = result.user;
              console.log(token, user);
              $('#welcome').text(`${user.displayName}님 안녕하세요!`);
            })
            .catch(err => {
              let errorCode = error.code;
              let errorMessage = error.message;
              let email = error.email;
              let credential = error.credential;
              console.log(err);
          });
        }
    })
  })
  .catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(error)
    console.log(errorCode, errorMessage);
  });
});

$('#logout').on('click', e => {
  firebase.auth().signOut().then(() => {
    $('#welcome').text(`안녕하세요!`);
  }).catch((err) => {
    console.log(err);
  })
});
