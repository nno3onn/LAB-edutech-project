firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // let uid = user.uid;
    const user = firebase.auth().currentUser;
    if (user !== null) {
      // User is signed in
      $(".profile").css('display', 'block');
      console.log(user)
      const { uid, displayName, email, photoURL, providerData, phoneNumber, emailVerified} = user;
      const { creationTime, lastSignInTime } = user.metadata;
      $("#welcome").text(`${displayName}님, 안녕하세요 !`);
      $("#displayName").text(displayName);
      $("#email").text(email);
      $("#photoURL").attr('src', photoURL);
      $("#creationTime").text(creationTime);
      $("#lastSignInTime").text(lastSignInTime);
      $("#phoneNumber").text(phoneNumber);
      $("#providerId").text(`${providerData[0].providerId.split('.')[0]}로 로그인 중`);
    }
  } else {
    // User is signed out
    window.location.href = "/";
    alert('로그인을 해주세요!');
  }
});
