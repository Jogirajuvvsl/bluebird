function signIn()
  {  
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user.email;
  console.log(user);
  mail_auth_flag=true;
  console.log("Done");
  console.log(mail_auth_flag);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  mail_auth_flag=false;
  console.log("failed");
  console.log(mail_auth_flag);
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorMessage);
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
};
  
 
function verifyPhone() { 
console.log("Entered the phone auth");
 phonemodal.style.display = "block";
};

  
  
  
$("#facecapture").click(function (e){
		var video=document.getElementById('video');
		console.log(video);
		
	        var canvas=document.getElementById('newimage');
	    console.log(canvas);   
	        navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.oGetUserMedia||navigator.msGetUserMedia;
               if(navigator.getUserMedia)
	           {
			   navigator.getUserMedia({video:true},streamWebCam,throwError);
	           }
	          canvas.width=video.clientWidth;
	          canvas.height=video.clientHeight;
			   var context=canvas.getContext('2d');
	          context.drawImage(video, 0, 0); 
	
	});
	
	function streamWebCam(stream)
	       {
	          video.src=window.URL.createObjectURL(stream);
	          video.play();
	       }
	   

	   function throwError(e)
	      {  alert(e.name);
	      }	
  
