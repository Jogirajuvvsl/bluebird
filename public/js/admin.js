
    $("#getAllDetails").click(function(){
        
     console.log("reached getALL details in js");

		$.ajax({
				url: "/getAllDetails",
				type: "get",
				contentType: "application/json",
				cache: true,
				timeout: 5000,
				complete: function(data) {
					
					console.log("reached this");
					console.log(data.responseJSON[0].value[2]);
		 }});
		
		
	
		 console.log(" after ajax call to get the details");

		
    });
  document.getElementById("gmail_fail").style.display="block";