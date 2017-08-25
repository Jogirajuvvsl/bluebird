// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBl4Svl9fi5idWOjLyvfk8MlW_PgmDq8DU",
    authDomain: "unochain-a62c5.firebaseapp.com",
    databaseURL: "https://unochain-a62c5.firebaseio.com",
    projectId: "unochain-a62c5",
    storageBucket: "unochain-a62c5.appspot.com",
    messagingSenderId: "142300613866"
	}
 firebase.initializeApp(config);
 var provider = new firebase.auth.GoogleAuthProvider();
 var mail_auth_flag=false;
 var mobile_auth_flag=false;
 var user;
 window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('#recaptcha');
 var usr_email;
function signIn()
  {  
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  usr_email = result.user.email;
  console.log(user);
  console.log("User done");
  //console.log(mail_auth_flag);
  //mail_auth_flag=true;
  //console.log(mail_auth_flag);
  //usr_email=user.email.
  //console.log("Done");
  //console.log(mail_auth_flag);

	  document.getElementById("gmail_correct").style.display="block";
  email_ver=true;
  console.log("Email ver");
  console.log(email_ver);
  // ...
}).catch(function(error) {
  // Handle Errors here.
 mail_auth_flag=false;
  console.log("failed");
  console.log(error);
  console.log(mail_auth_flag);
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode);
  console.log(errorMessage);
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  document.getElementById("gmail_fail").style.display="block";
  // ...
  })};
 
 if(user!=null)
 document.getElementById("gmail_correct").style.display="block";
	  
  
