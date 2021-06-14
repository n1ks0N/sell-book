$('.promo').val(localStorage.getItem('ref'))

$('#STATUS_URL').val(`${window.location.origin}`)
$('#PAYMENT_URL').val(`${window.location.origin}`)
$('#NOPAYMENT_URL').val(`${window.location.origin}`)


$('#format-choice').change((e) => {
  secondStep(e.target.value)
  $('#next-step').css('display', 'none')
})
$('#next-step').click(() => {
  secondStep($('#format-choice').val())
  $('#next-step').css('display', 'none')
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
console.log(localStorage)
if (localStorage.getItem('date') >= Date.now()) {
  $('.btn-output').prop('disabled', true)
}
$('.btn-output').mousedown(() => {

  firebase.firestore().collection('users').doc(localStorage.getItem('email')).set({
    money: 0
  }, { merge: true })
})

$('.btn-pay').mousedown((e) => {
  if ($('.promo').val()) {
    firebase.firestore().collection('users').doc($('.promo').val()).get().then((doc) => {
      if (doc.exists) {
        const ref = doc.data().ref
        firebase.firestore().collection('users').doc($('.promo').val()).set({
          money: doc.data().money + 700 * 0.4
        }, { merge: true })
        if (ref) {
          firebase.firestore().collection('users').doc(ref).get().then((doc) => {
            if (doc.exists) {
              firebase.firestore().collection('users').doc(ref).set({
                money: doc.data().money + 700 * 0.15
              }, { merge: true })
            }
          })
        }
      }
    })
  }
})
$('.btn-pay').mouseup(() => {
  if ($('#InputEmail1').val() || $('#InputEmail2').val() && $('#InputCity1').val() && $('#InputIndex1').val() && $('#InputAdress1').val()) window.open(`${window.location.origin}?pay=true`)
})


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

      localStorage.setItem('email', email);

      usersDB.doc(email).get().then((doc) => {
        if (doc.exists) {
          money = doc.data().money
          date = doc.data().date.seconds * 1000
          console.log(date)
          localStorage.setItem('date', date)
          if (doc.data().ref) localStorage.setItem('ref', doc.data().ref)
          $('.user__name').text(name)
          $('.user__email').text(`Email: ${email}`)
          $('.user__money').text(`Баланс: ${money} ₽`)
          $('#refInput').val(`${window.location.origin}?ref=${email}`)
          $('.output__date').text(`Дата последнего вывода: ${date ? new Date(date) : 'отсутствует'}`)
          $('#inputEmail3').val(email)
        } else {
          // doc.data() will be undefined in this case
          usersDB.doc(email).set({
            money: 0,
            date: false,
            ref: localStorage.getItem('ref') ? localStorage.getItem('ref') : false
          })
          $('.user__name').text(name)
          $('.user__email').text(`Email: ${email}`)
          $('.user__money').text(`Баланс: ${money} ₽`)
          $('#refInput').val(`${window.location.origin}?ref=${email}`)
          $('.output__date').text(`Дата последнего вывода: ${date ? new Date(date) : 'отсутствует'}`)
          $('#inputEmail3').val(email)
        }
      })
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
if (window.location.search.split('=')[0] === '?pay') {
  $('#perfectmoney').click()
}
