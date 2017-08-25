$("getAllDetails").click(function(){
         $.ajax({
				url: "/getAllDetails",
				type: "get",
				contentType: "application/json",
				cache: true,
				timeout: 5000,
				success: function(data) {
					
					console.log(data);
				});
});
