// Spectrum AC & Heating
// Developer: Adam Culpepper

$(function () {
	var url = (document.URL); //Cached for heavy general use

	//Add the name of the page to the body ID for better CSS targeting
	var pageStub = (url).split("/").pop();
	if (pageStub == "") {
		var pageStub = "home";
	}
	
	if ( navigator.userAgent.toLowerCase().indexOf("ipad") >1 ) {
		var os = "ipad";
	} else {
		var os = "";
	}

	$("body").attr("id", pageStub).addClass(os); //no touchy!	

	//Active page link
	$("#header .nav a").each(function() {
		if ( pageStub == $(this).attr("href").split("/").pop() ) {
			$(this).addClass("active");
		}
	});

	$("#header .nav li").hover(function() {
		$(this).prev().find("a").addClass("borderless");
	}, function() {
		$(this).prev().find("a").removeClass("borderless");
	});

	//$(".cycle-overlay div").eq(0).css({"background": "red"});
	//$(".cycle-overlay div").eq(1).addClass("desc");

	// Updates the info div immediately.
	$(window).resize();

});


$(window).load(function() {
	//setTimeout(function() { $("#header .call span").css("color", "#F0F")	}, 5000);

	var bannerSlider = $(".cycle-slideshow a");

	//alert(bannerSlider.length);
	if ( bannerSlider.length = 2 ) {
		//$("#prev, #next, .cycle-overlay").hide();
	}

	// use an object as map
//	var map = {};
//	$(bannerSlider).each(function(){
//		var value = $(this).html();
//		if (map[value] == null){
//			map[value] = true;
//		} else {
//			$(this).remove();
//		}
//	});

});


// Bind the resize event. When the window size changes, update its corresponding info div.
$(window).resize(function() {
	var elem = $(this);
	// Update the info div width and height - replace this with your own code
	// to do something useful!
	//$('#window-info').text( 'window width: ' + elem.width() + ', height: ' + elem.height() );
	var junk1 = 'window width: ' + $(window).width() + ', height: ' + $(window).height();
	var junk2 = 'device width: ' + window.screen.width + ', height: ' + window.screen.height;
	//$("#window-info").html(junk1 + "<br>" + junk2);
});


// Print
function makepage(src) {
	return "<html>\n" +
		"<head>\n" +
		"<title>Spectrum Coupon</title>\n" +
		"<script>\n" +
		"function step1() {\n" +
		" setTimeout('step2()', 10);\n" +
		"}\n" +
		"function step2() {\n" +
		" window.print();\n" +
		" window.close();\n" +
		"}\n" +
		"</scr" + "ipt>\n" +
		"</head>\n" +
		"<body onLoad='step1()'>\n" +
		"<img src='" + src + "'/>\n" +
		"</body>\n" +
		"</html>\n";
}

function printme(evt) {
	if (!evt) {
		// Old IE
		evt = window.event;
	}
	var image = evt.target;
	if (!image) {
		// Old IE
		image = window.event.srcElement;
	}
	src = image.src;
	link = "about:blank";
	var pw = window.open(link, "_new");
	pw.document.open();
	pw.document.write(makepage(src));
	pw.document.close();
}
