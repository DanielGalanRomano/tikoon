(function ($) {

  "use strict";



  // data - background

  $("[data-background]").each(function () {

    $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")

  })



  // meanmenu

  $('#mobile-menu').meanmenu({

    meanMenuContainer: '.mobile-menu',

    meanScreenWidth: "992"

  });



  // sticky

  $(window).on('scroll', function () {

    var scroll = $(window).scrollTop();

    if (scroll < 2) {

      $("#header-sticky").removeClass("sticky");

    } else {

      $("#header-sticky").addClass("sticky");

    }

  });





  // One Page Nav

  var top_offset = $('.header-area').height() - 10;

  $('.main-menu nav ul').onePageNav({

    currentClass: 'active',

    scrollOffset: top_offset,

  });



  // counter

  $('.counter').counterUp({

    delay: 10,

    time: 1000

  });



  $('.popup-img').magnificPopup({

    type: 'image'

  });



  $('.popup-video').magnificPopup({

    type: 'iframe'

  });





  $('.brand-active').slick({

    dots: false,

    arrows: false,

    infinite: true,

    speed: 300,

    slidesToShow: 4,

    slidesToScroll: 1,

    responsive: [{

        breakpoint: 1024,

        settings: {

          slidesToShow: 4,

          slidesToScroll: 1,

          infinite: true,

          dots: false,

        }

      },

      {

        breakpoint: 992,

        settings: {

          slidesToShow: 2,

          slidesToScroll: 2

        }

      },

      {

        breakpoint: 767,

        settings: {

          slidesToShow: 2,

          slidesToScroll: 2

        }

      },

      {

        breakpoint: 500,

        settings: {

          slidesToShow: 1,

          slidesToScroll: 1

        }

      }

    ]

  });





  $('.testimonail-active').slick({

    slidesToShow: 1,

    slidesToScroll: 1,

    arrows: false,

    fade: true,

    asNavFor: '.testimonial-img-active',

  });

  $('.testimonial-img-active').slick({

    slidesToShow: 3,

    slidesToScroll: 1,

    asNavFor: '.testimonail-active',

    dots: false,

    centerMode: true,

    focusOnSelect: true,

    centerPadding: '0px',

    arrows: false,

    responsive: [{

      breakpoint: 1024,

      settings: {

        slidesToShow: 3,

        slidesToScroll: 1,

        infinite: true,

        dots: false,

      }

    },

    {

      breakpoint: 992,

      settings: {

        slidesToShow: 3,

        slidesToScroll: 2

      }

    },

    {

      breakpoint: 767,

      settings: {

        slidesToShow: 1,

        slidesToScroll: 1

      }

    },

    {

      breakpoint: 480,

      settings: {

        slidesToShow: 1,

        slidesToScroll: 1

      }

    }

    ]

  });





  // WOW active

  if ($('.WOW').length !== 0) {
      new WOW().init();
  }




  // map

  function basicmap() {

    // Basic options for a simple Google Map

    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions

    var mapOptions = {

      // How zoomed in you want the map to start at (always required)

      zoom: 11,

      scrollwheel: false,

      // The latitude and longitude to center the map (always required)

      center: new google.maps.LatLng(40.6700, -73.9400), // New York

      // This is where you would paste any style found on Snazzy Maps.

      styles: [{

        "featureType": "all",

        "elementType": "geometry.fill",

        "stylers": [{

          "weight": "2.00"

        }]

      }, {

        "featureType": "all",

        "elementType": "geometry.stroke",

        "stylers": [{

          "color": "#9c9c9c"

        }]

      }, {

        "featureType": "all",

        "elementType": "labels.text",

        "stylers": [{

          "visibility": "on"

        }]

      }, {

        "featureType": "landscape",

        "elementType": "all",

        "stylers": [{

          "color": "#f2f2f2"

        }]

      }, {

        "featureType": "landscape",

        "elementType": "geometry.fill",

        "stylers": [{

          "color": "#ffffff"

        }]

      }, {

        "featureType": "landscape.man_made",

        "elementType": "geometry.fill",

        "stylers": [{

          "color": "#ffffff"

        }]

      }, {

        "featureType": "poi",

        "elementType": "all",

        "stylers": [{

          "visibility": "off"

        }]

      }, {

        "featureType": "road",

        "elementType": "all",

        "stylers": [{

          "saturation": -100

        }, {

          "lightness": 45

        }]

      }, {

        "featureType": "road",

        "elementType": "geometry.fill",

        "stylers": [{

          "color": "#eeeeee"

        }]

      }, {

        "featureType": "road",

        "elementType": "labels.text.fill",

        "stylers": [{

          "color": "#7b7b7b"

        }]

      }, {

        "featureType": "road",

        "elementType": "labels.text.stroke",

        "stylers": [{

          "color": "#ffffff"

        }]

      }, {

        "featureType": "road.highway",

        "elementType": "all",

        "stylers": [{

          "visibility": "simplified"

        }]

      }, {

        "featureType": "road.arterial",

        "elementType": "labels.icon",

        "stylers": [{

          "visibility": "off"

        }]

      }, {

        "featureType": "transit",

        "elementType": "all",

        "stylers": [{

          "visibility": "off"

        }]

      }, {

        "featureType": "water",

        "elementType": "all",

        "stylers": [{

          "color": "#46bcec"

        }, {

          "visibility": "on"

        }]

      }, {

        "featureType": "water",

        "elementType": "geometry.fill",

        "stylers": [{

          "color": "#c8d7d4"

        }]

      }, {

        "featureType": "water",

        "elementType": "labels.text.fill",

        "stylers": [{

          "color": "#070707"

        }]

      }, {

        "featureType": "water",

        "elementType": "labels.text.stroke",

        "stylers": [{

          "color": "#ffffff"

        }]

      }]

    };

    // Get the HTML DOM element that will contain your map

    // We are using a div with id="map" seen below in the <body>

    var mapElement = document.getElementById('contact-map');



    // Create the Google Map using our element and options defined above

    var map = new google.maps.Map(mapElement, mapOptions);



    // Let's also add a marker while we're at it

    var marker = new google.maps.Marker({

      position: new google.maps.LatLng(40.6700, -73.9400),

      map: map,

      title: 'Cryptox'

    });

  }

  if ($('#contact-map').length != 0) {

    google.maps.event.addDomListener(window, 'load', basicmap);

  }





})(jQuery);