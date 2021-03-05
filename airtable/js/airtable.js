(function($)
{
	
	  Drupal.behaviors.airtable_load_iframe= {
			    attach: function(context, settings) {
			        if ($("#thisisan-iframe").length > 0){
			        	if ($('body').hasClass('thisisaniframedpage')) {
			        		
			        	} else {
			        		$('body').addClass('thisisaniframedpage');
			        	}
			        }
			  }
	  }
	  
	  Drupal.behaviors.airtable_load_record = {
			    attach: function(context, settings) {
			        $('.airtable-record .metadata-and-links', context).once('metadataenlinks').each(function() {
                         var innerhtml=$(this).html();
                         $("aside .region-sidebar-second").append('<div class="metadata-and-links-desktop">'+innerhtml + '</div>');
			    });
			  }
	  }
	  
	  
	  Drupal.behaviors.airtable_load = {
			    attach: function(context, settings) {
			        $('.airtable-zoekresultaat-container', context).once('loadthepage').each(function() {
			        	tableobj=search_to_table_object(location.search);
			        	$(".airtable-zoekresultaat-container").addClass("wait");
			        	if ($(".airtable-zoekresultaat-container.context-iframe").length >0 ){
                            tableobj.iframe='iframe';			        		
			        	}
			        	//alert(location.search);
			        	//console.log(tableobj.query);
			        	//alert(decodeURIComponent(tableobj.query));
			        	var thequery=decodeURIComponent(tableobj.query);
			        	thequery=	thequery.replace(/\+/g, ' ');

			        //	alert(fasefilter);// undefined wanneer niets meegegeven
			        	setfilters(tableobj);
                        //console.log(tableobj);
			        	//alert(thequery);
			        	// je wilt opnieuwe kunnen zoeken
			        	//$("#edit-keys").val(thequery);
			        	$.ajax({
	    	    			  url: "/ajax/toolbox/zoekresultaat",// stuurt location search naar (zie routing) _controller: '\Drupal\airtable\Controller\AirtableController::zoekresultaat'
	    	    			  type: "get", //send it through get method
	    	    			  cache: false,
	    	    			  dataType: 'html',
	    	     			  data: tableobj,
	    	    			  success: function(response) {
	    	    				 $(".airtable-zoekresultaat-container").removeClass("wait");
	    	    				 $( ".airtable-zoekresultaat-container").prepend('<div id="page1"  class="apage"></div>');
	    	    				 $( ".airtable-zoekresultaat-container #page1").html(response);
	    	    				 // nul resultatenb
	    	    				 if ($(".airtable-zoekresultaat-container #page1 a").length ==0){
	    	    					 $(".message-to-user").html('U heeft gezocht op <span class="searchterm">'+thequery+ '</span>, en gefilterd op onderstaande filters, dit heeft geen resultaten opgeleverd. <a class="blanksearch" href="?">x</a> ');
	    	    				 } else {
	    	    					 if (thequery !='') {
	    	    						 $(".message-to-user").html('U heeft gezocht op <span class="searchterm">'+thequery+'</span>  <a class="blanksearch" href="?">x</a>');
	    	    					 }
	    	    					
	    	    				 }
	    	    				 nrofpages++;
	    	    				 if ($(".airtable-zoekresultaat-container #page1 .offset").length) {
		    	    				 $( "#pager.airtable").append('<div class="pagerpage active" data="page1" >pagina 1</div>');
	    	    					 var offset=$( ".airtable-zoekresultaat-container #page1 .offset").attr('data');
	    	    					 if (offset !='') {
	    	    						 $( "#pager.airtable").append('<div class="next" data="'+offset+'">volgende</div>');
	    	    					 }
	    	    					 
	    	    				 }
	    	    				 startmasonry();
	    	    			  },
			        	
			        	
			        	
			        	
			        });
			    });
			  }
	  }
	  
	  Drupal.behaviors.airtable_nextpage = {
			    attach: function(context, settings) {	        
			        $(document).once('airtable_nextpage').on("click", '#pager.airtable .next', function(event) { 
			        //	$("airtable-zoekresultaat-container.next").addClass("wait");
			        	
			        	var offset=$(this).attr('data');
			        	$('.airtable-zoekresultaat-container .next').remove();
			        	var newsearch=(location.search !='')?location.search + '&offset='+offset:'?offset='+offset;
			        	tableobj=search_to_table_object( newsearch);
			        	if ($(".airtable-zoekresultaat-container.context-iframe").length >0 ){
                            tableobj.iframe='iframe';			        		
			        	}
			        	$.ajax({
	    	    			  url: "/ajax/toolbox/zoekresultaat",
	    	    			  type: "get", //send it through get method
	    	    			  cache: false,
	    	    			  dataType: 'html',
	    	     			  data: tableobj,
	    	    			  success: function(response) {
	    	    				  $('#pager.airtable .next').remove();
	    	    				  var prevpage=nrofpages-1;
	    	    		//		  $( ".airtable-zoekresultaat-container .apage").hide();
	    	    				 $( ".airtable-zoekresultaat-container").append('<div id="page'+nrofpages+'" class="apage"></div>');
	    	    				 $( ".airtable-zoekresultaat-container #page"+nrofpages).html(response);
	    	    		
	    	    				// alert(nrofpages);
	    	    		//		 $( "#pager.airtable .pagerpage").removeClass('active');
	    	    		//		 $( "#pager.airtable").append('<div class="pagerpage active" data="page'+nrofpages+'">pagina '+nrofpages+'</div>');
	    	    				 if ($(".airtable-zoekresultaat-container #page"+nrofpages+" .offset").length) {
	    	    					 var offset=$( ".airtable-zoekresultaat-container #page"+nrofpages+" .offset").attr('data');
	    	    					 if (offset !='') {
  	    	    					    //$( "#pager.airtable").append('<div class="next" data="'+offset+'">volgende</div>');
	    	    						 $( "#pager.airtable").html('<div class="next" data="'+offset+'">volgende</div>');
	    	    					 }
	    	    				 }
	    	    				 nrofpages++;
	    	    				// startmasonry();
	    	    				 setmasonry();
	    	    				 //
	    	    				// $("#invade")[0].scrollIntoView({behavior: "smooth"});
	    	    			  },
			        	
			        	
			        	
			        	
			        });
			        });
			        
			  }
	  }
	  
	  Drupal.behaviors.airtable_filters = {
			    attach: function(context, settings) {	 
			    	 $(document).once('airtable_filter').on("click", '.filter-filter', function(event) { 
			    		 var filtertype='';
			    		 if ($(this).hasClass('type-type')) {
			    			 filtertype='type';
			    		 } else {
			    			 filtertype='fase';
			    		 }
			    		 var addorremove;
			    		 if ($(this).hasClass('active')) {// dan is dit filter al gekozen
			    			 addorremove='remove';
			    		 } else {
			    			 addorremove='add';
			    		 }
			    		 var filtervalue='';
			    		 var prefix=filtertype+'-';
                         var currentid=$(this).attr("id");
                         filtervalue = currentid.replace(prefix,'');
                         var fasefilter=jQuery.urlParam('fasefilter');
                         var typefilter=jQuery.urlParam('typefilter');
                         var query=jQuery.urlParam('query');
                         if (!query) {
                        	 query='';
                         }
                         if (!fasefilter) {
                        	 fasefilter='';
                         }
                         if (!typefilter) {
                        	 typefilter='';
                         }
                         
                         
                        // alert(window.location.href);
                         var currenturl=window.location.href;
                         var newurl=window.location.pathname+'?query='+query;
                         //alert(window.location.pathname);
                         if (addorremove =='add') {
                        	 if (filtertype=='type'){


                        		 if (filtervalue=='alle'){
                        			 typefilter='';
                        		 } else {
                         		    if (typefilter!='') {
                        			    //er is al een typefilter in de url
                        			    types = typefilter.split(",");
                        			    types.push(filtervalue);
                        			    typestring = types.join(',');//book,website
                        		    } else {
                        			    // voeg een typefilter toe
                        			    typestring=filtervalue;//book
                        		    }
                           		   typefilter=typestring;
                        		 }
                        		 
                        	 }
                             if (filtertype=='fase'){
                        		 if (filtervalue=='alle'){
                        			 fasefilter='';
                        		 } else {
                        		    if (fasefilter!='') {
                        			    //er is al een typefilter in de url
                        			    fases = fasefilter.split(",");
                        			    fases.push(filtervalue);
                        			    fasestring = fases.join(',');//book,website
                        		    } else {
                        			    // voeg een typefilter toe
                        			    fasestring=filtervalue;//book
                        		    }
                            		fasefilter=fasestring;
                        		 }

                        	 }
                             
                        	 
                         }
                         if (addorremove =='remove') {
                        	 if (filtervalue=='alle'){
                        		 return true;// hoeven we niks mee te doen
                        	 }
                        	 if (filtertype=='type'){
                 			    types = typefilter.split(",");
                 			    typesnew=[];
                 			    for (var i = 0; i < types.length ; i++) {
                 				    if (types[i] != filtervalue) {
                 				       typesnew.push(types[i]);
                       			   //book,website
                 				    }
                 				 }
                			     typestring = typesnew.join(',');//book,website
                			     typefilter=typestring;
                        	 }
                        	 if (filtertype=='fase'){
                 			    fases = fasefilter.split(",");
                 			    fasesnew=[];
                 			    for (var i = 0; i < fases.length ; i++) {
                 				    if (fases[i] != filtervalue) {
                 				       fasesnew.push(fases[i]);
                       			   //book,website
                 				    }
                 				 }
                			     fasestring = fasesnew.join(',');//book,website
                			     fasefilter=fasestring;
                        	 }
                        	 
                        	 
                        	 
                         }
			    		 newurl=newurl+'&fasefilter='+fasefilter+'&typefilter='+typefilter;
			    		 window.location.href= newurl;
			    	 });
			    	
			    }
	  }
	  
	  Drupal.behaviors.airtable_openclosefilters = {
			    attach: function(context, settings) {
			    	  $(document).once('openclosefilters').on("click", '.openclosefilters', function(event) { 
			    		  if ($(this).parent().hasClass("open")) {
			    			  $(this).parent().removeClass("open");
			    			  $(this).parent().next().removeClass("open");
			    		  } else {
			    			  $(this).parent().addClass("open");
			    			  $(this).parent().next().addClass("open");
			    		  }
			    	  });
			    }
	  }
	
	  
	  Drupal.behaviors.airtable_pager = {
			    attach: function(context, settings) {	        
			 //       $(document).once('airtable_pager').on("click", '#pager.airtable .pagerpage', function(event) { 
//			        	var page=$(this).attr('data');
//			        	$( "#pager.airtable .pagerpage").removeClass('active');
//			        	$(this).addClass("active");
//			        	$(".airtable-zoekresultaat-container .apage").hide();
//			        	$(".airtable-zoekresultaat-container #"+page).show();
  //                      // .search-records-wrapper
	//					 $("#invade")[0].scrollIntoView({behavior: "smooth"});
			 //       });
			  	  $(window).scroll(function() {
					  //#macscroll
					  // maak de boel iets groteromdat fff soms net o.777 kleiner is dan de document height
					//  var fff=$(window).scrollTop() + $(window).height() +2;
			  		var qq="#pager.airtable div.next";
		
			  	    var top_of_element = $(qq).offset().top;
			  	    var bottom_of_element = $(qq).offset().top + $(qq).outerHeight();
			  	    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
			  	    var top_of_screen = $(window).scrollTop();

			  	    if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
			  	       console.log('visile');
			  	       if ($(qq+'.fetchnext').length ==0 ){
			  	    	   $(qq).addClass('fetchnext');
			  	    	 $(qq).click()
			  	       }
			  	     ;
			  	    } else {
			  	        // the element is not visible, do something else
			  	    }
					  
			
					  //#macscroll end
				//	  if(fff >= $(document).height()) {
					      //#mapview-hotfixcheckpage
						  // soms bleven de results bijladen in een detailweergave op de kaart
						  // dus we zetten de bijlaad functie gewoon stop wanneer we de kaart geopend hebben
						  // $("#facetmap").remove();
						  // wanneer er geen facetmap is is er geen kaart
						//  if ($("#facetmap").length < 1){
						//	  checkpage();
						//  }
						//#mapview-hotfixcheckpage end
					//   }
					});
			        
			  }
	  }
	  
	  Drupal.behaviors.airtable_historyback = {
			    attach: function(context, settings) {	        
			        $(document).once('airtable_historyback').on("click", '.airtable-record .go-back', function(event) { 
			        	  history.back();

			        });
			        
			  }
	  }
	  Drupal.behaviors.airtable_historyback_hide = {
			    attach: function(context, settings) {	        
			     if ($(".airtable-record .go-back").length) {
			    	var string=document.referrer;
			    	if ((string.includes('/toolbox/tools')) || (string.includes('/iframe/toolbox'))) {
			    		
			    	} else {
			    		$(".airtable-record .go-back").hide();
			    	}
			    	
			     }
			        
			  }
	  }
	  
	  
	  
	  Drupal.behaviors.airtable_slider= {
			  attach:function(context, settings) {
				//  $('airtable-record')
				  
				    // Start autoplay
				    var auto = true;
				     
				    // Pause duration between slides (ms)
				    var pause = 7000;
				     
				    // Get parent element
				    var $this = $('#record-slider');
				  //   alert('ddd');
				    // Slides container
				    var slidesCont = $this.children('.slides-container');
				    // Get all slides
				    var slides = slidesCont.children('.slide');
				     
				    // Get pager div
				    var pager = $this.children('.record-pager');
				     
				    // Get Previous / Next links
				    var arrowsCont = $this.children('.record-arrows');
				    var prevSlide = arrowsCont.children('.record-prev');
				    var nextSlide = arrowsCont.children('.record-next');
				     
				    // Total slides count
				    var slidesCount = slides.length;
				     
				    // Set currentSlide to first child
				    var currentSlide = slides.first();
				     
				    // Holds setInterval for autoplay, so we can reset it when user navigates
				    var autoPlay = null;
				  
				    slides.not(':first').css('display', 'none');
				    currentSlide.addClass('active');
				    $(document).once('record-sider').on("click", '#record-slider .record-prev,#record-slider .record-next', function(event) { 
				    	var direction=$(this).attr('class');
				    	if (direction=='record-next') {
				    		fadeNext();
				    	} else {
				    		fadePrev();
				    	}
				    	event.preventDefault();
				    });
				    pager.text(currentSlideIndex+' / '+slidesCount);
				  
				  
			  }
	  }


 })(jQuery);

var nrofpages=1;
var currentSlideIndex=1;

function search_to_table_object(search){
	if (search.indexOf('?') > -1) {
		search=search.substring(1);
	}
    if (search==''){
      	search='n_o_m=sq&query=';
    }
	tableobj=JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	return tableobj;
}	


function fadeNext() {
	 var athis = jQuery('#record-slider');
	 var slidesCont = athis.children('.slides-container');
	 var slides = slidesCont.children('.slide');
     currentSlide=jQuery(".slides-container .slide.active")
     currentSlide.removeClass('active').fadeOut(700);
     var slidesCount = slides.length;
    if(currentSlideIndex == slidesCount) {
        currentSlide = slides.first();
        currentSlide.delay(700).addClass('active').fadeIn(700);
        currentSlideIndex = 1;
    } else {
        currentSlideIndex++;
        currentSlide = currentSlide.next();
        currentSlide.delay(700).addClass('active').fadeIn(700);
    }
    var pager = jQuery('#record-slider .record-pager');
    pager.text(currentSlideIndex+' / '+slidesCount);
}
 
// Function responsible for fading to previous slide
function fadePrev() {
	 var athis = jQuery('#record-slider');
	 var slidesCont = athis.children('.slides-container');
	 var slides = slidesCont.children('.slide');
     currentSlide=jQuery(".slides-container .slide.active")
     currentSlide.removeClass('active').fadeOut(700);
     var slidesCount = slides.length;
 
    if(currentSlideIndex == 1) {
        currentSlide = slides.last();
        currentSlide.delay(700).addClass('active').fadeIn();
        currentSlideIndex = slidesCount;
    } else {
        currentSlideIndex--;
        currentSlide = currentSlide.prev();
        currentSlide.delay(700).addClass('active').fadeIn(700);
    }
    var pager = jQuery('#record-slider .record-pager');
    pager.text(currentSlideIndex+' / '+slidesCount);
}

function isScrolledIntoView(elem)
{
    var docViewTop = jQuery(window).scrollTop();
    console.log(docViewTop);
    var docViewBottom = docViewTop + jQuery(window).height();

    var elemTop = jQuery(elem).offset().top;
    console.log(elemTop);
    var elemBottom = elemTop + jQuery(elem).height();

   // return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    return  (elemTop >= docViewTop);
}


function startmasonry() {


	jQuery('.masonrydisplay').imagesLoaded(function(){
         setTimeout(function(){
        	 jQuery('.masonrydisplay').masonry({
		          itemSelector: '.tool-record',
		          columnWidth: 0,
		          gutter:0,
		          transitionDuration: '1.0s'
	           });
       	}, 1000);
        setTimeout(function(){
        	 jQuery('.tool-record').addClass('loaded').addClass('first');;
       	}, 500);

       });
	

}

function setmasonry(){
	//jQuery('.masonrydisplay').masonry('layout');
	jQuery('.masonrydisplay').masonry( 'reloadItems' );// masonry moet alles opnieuw indexeren en bekijken
	jQuery('.masonrydisplay').masonry( 'layout' );	
	   setTimeout(function(){
      	 jQuery('.tool-record').addClass('loaded');
     	}, 1000);

	
}

function setfilters(tableobj){
	var typefilter=tableobj.typefilter;
	var fasefilter=tableobj.fasefilter;
	jQuery(".thefilters-filters .active").removeClass("active");
	if (typefilter && typefilter!='') {
		var types = typefilter.split(",");
		for (index = 0; index < types.length; ++index) {
			jQuery("#filters-type #type-"+types[index]).addClass('active');
		}
	} else {
		jQuery("#filters-type #type-alle").addClass('active');
	}
	if (fasefilter && fasefilter!='') {
		var fases = fasefilter.split(",");
		for (index = 0; index < fases.length; ++index) {
			jQuery("#filters-fase #fase-"+fases[index]).addClass('active');
		}
	} else {
		jQuery("#filters-fase #fase-alle").addClass('active');
	}
}

jQuery.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}	