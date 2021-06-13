$('#format-choice').change((e) => {
  secondStep(e.target.value)
})
$('#next-step').click(() => {
  secondStep($('#format-choice').val())
})
const secondStep = (type) => {
  switch (type) {
    case 'e-book':
      $('.modal__print').css('display', 'none')
      $('.modal__e-book').css('display', 'block')
      break;
    case 'print':
      $('.modal__e-book').css('display', 'none')
      $('.modal__print').css('display', 'block')
      break;
  }
}

$('.btn-copy').click(() => navigator.clipboard.writeText($('#refInput').val()));
$('.btn-out').click(() => firebase.auth().signOut());
$('.btn-pay').click(() => firebase.firestore().collection('users').doc())


var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
    }
  ],
  // Other config options...
});
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '/user.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};
ui.start('#firebaseui-auth-container', uiConfig);


if (window.location.pathname === '/user.html') {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      $('.login').css('display', 'none');
      $('.user').css('display', 'block');

      const user = firebase.auth().currentUser,
        name = user.displayName,
        email = user.email.toLowerCase(),
        uid = user.uid,
        usersDB = firebase.firestore().collection('users')
      let money = 0,
        date = false

      usersDB.doc(email).get().then((doc) => {
        if (doc.exists) {
          money = doc.data().money
          date = doc.data().date
          if (ref) localStorage.setItem('ref', doc.data().ref)
        } else {
          // doc.data() will be undefined in this case
          usersDB.doc(email).set({
            money: 0,
            date: false,
            ref: localStorage.getItem('ref') ? localStorage.getItem('ref') : false
          })
        }
      })

      $('.user__name').text(name)
      $('.user__email').text(`Email: ${email}`)
      $('.user__money').text(`Баланс: ${money} ₽`)
      $('#refInput').val(`${window.location.origin}?ref=${email}`)
      $('.output__date').text(`Дата последнего вывода: ${date ? new Date(date) : 'отсутствует'}`)
      $('#inputEmail3').val(email)
    } else {
      // User is signed out
      $('.login').css('display', 'block');
      $('.user').css('display', 'none');
    }
  });
}

if (window.location.search.split('=')[0] === '?ref') {
  localStorage.setItem('ref', window.location.search.split('=')[1])
}