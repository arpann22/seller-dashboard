// scripts
jQuery(document).ready(function ($) {
  $(".ws_mega_menu").css("display", "none");
  $("h2.ws_mega_menu_button").on("click", function () {
    $(".ws_mega_menu").toggle();
    $(this).toggleClass("active");
  });

  // getting selected currrency value
  $("#wstr-mulitcurrency").change(function () {
    var currency = $(this).val();
    $.ajax({
      type: "post",
      dataType: "json",
      url: cpmAjax.ajax_url,
      data: {
        action: "set_currency_session",
        currency: currency,
      },
      success: function (response) {
        if (response.data) {
          location.reload();
        }
      },
    });
  });

  // When the magnifying glass is clicked make the image whole screen single domain page  =================================
  $(".fa-magnifying-glass").on("click", function () {
    const imageSrc = $(".featured-image img").attr("src");

    // Set the image source in the modal
    $("#modalImage").attr("src", imageSrc);

    $("#imageModal").fadeIn();
  });

  $(".close").on("click", function () {
    $("#imageModal").fadeOut();
  });
  $(window).on("click", function (e) {
    if ($(e.target).is("#imageModal")) {
      $("#imageModal").fadeOut();
    }
  });

  // zoom feature on hover ====================================
  $(".img_producto")
    .on("mouseover", function () {
      // Scale the image
      $(this).css({ transform: "scale(" + $(this).closest(".img_producto_container").attr("data-scale") + ")" });
    })
    .on("mouseout", function () {
      // Reset the scale
      $(this).css({ transform: "scale(1)" });
    })
    .on("mousemove", function (e) {
      // Adjust transform origin based on mouse position
      const offset = $(this).offset();
      const x = ((e.pageX - offset.left) / $(this).width()) * 100;
      const y = ((e.pageY - offset.top) / $(this).height()) * 100;

      $(this).css({ "transform-origin": x + "% " + y + "%" });
    });


  // TESTIMONIAL SLIDER
  $(".ws-testimonial-container").slick({
    centerMode: false,
    // centerPadding: "100px",
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: true,
    prevArrow: $(".prev"),
    nextArrow: $(".next"),
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $(".prev").on("click", function () {
    $(".next").removeClass("active");
    $(".prev").addClass("active");
  });

  $(".next").on("click", function () {
    $(".prev").removeClass("active");
    $(".next").addClass("active");
  });
});

jQuery(".swiper-wrapper").slick({
  centerMode: true,
  centerPadding: "265px",
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: 1,
      },
    },
  ],
});

// trending cards aniamtion effect

jQuery(document).ready(function ($) {
  var $container = $(".ws_home_trending_cards .ws-cards-container-wrapper");
  var $contents = $container.html();

  $container.html('<div class="scrolling">' + $contents + "</div>");

  var $scrolling = $container.find(".scrolling");

  // Clone the contents for seamless scrolling (optional)
  for (let i = 0; i < 1; i++) {
    $scrolling.append($scrolling.children().clone());
  }

  var isPaused = false; // Track the paused state

  $(".toggleMarquee").on("click", function () {
    isPaused = !isPaused;

    // Update button icon based on the paused state
    if (isPaused) {
      $(this).html('<i class="fa-solid fa-circle-play"></i>');
      $scrolling.css("animation-play-state", "paused");
    } else {
      $(this).html('<i class="fa-regular fa-circle-pause"></i>');
      $scrolling.css("animation-play-state", "running");
    }
  });

  // Add mouse grab scrolling functionality
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Mouse down event to initiate dragging
  $container.on("mousedown", function (e) {
    isDragging = true;
    startX = e.pageX - $container.offset().left; // Get the mouse position relative to the container
    scrollLeft = $container.scrollLeft(); // Get the current scroll position
    $container.css("cursor", "grabbing"); // Change cursor to grabbing
  });

  // Mouse leave event to stop dragging
  $container.on("mouseleave", function () {
    isDragging = false;
    $container.css("cursor", "grab"); // Reset cursor
  });

  // Mouse up event to stop dragging
  $container.on("mouseup", function () {
    isDragging = false;
    $container.css("cursor", "grab"); // Reset cursor
  });

  // Mouse move event to handle the dragging
  $container.on("mousemove", function (e) {
    if (!isDragging) return; // Do nothing if not dragging
    e.preventDefault(); // Prevent default text selection
    const x = e.pageX - $container.offset().left; // Get the current mouse position
    const walk = (x - startX) * 2; // Calculate distance to scroll
    $container.scrollLeft(scrollLeft - walk); // Scroll the container
  });

  $scrolling.addClass("scrolling-animation");

  // var $container = $('.ws_home_trending_cards .ws-cards-container-wrapper');
  // var $contents = $container.html();

  // $container.html('<div class="scrolling">' + $contents + '</div>');

  // var $scrolling = $container.find('.scrolling');

  // for (let i = 0; i < 1; i++) {
  //   $scrolling.append($scrolling.children().clone());
  // }

  // var isPaused = false; // Track the paused state

  // $('.toggleMarquee').on('click', function () {
  //   isPaused = !isPaused;

  //   // Update button icon based on the paused state
  //   if (isPaused) {
  //     $(this).html('<i class="fa-solid fa-circle-play"></i>');
  //     $scrolling.css('animation-play-state', 'paused');
  //   } else {
  //     $(this).html('<i class="fa-regular fa-circle-pause"></i>');
  //     $scrolling.css('animation-play-state', 'running');
  //   }

  // });

  // $scrolling.addClass('scrolling-animation');

  // favourite section ===========================
  $(".ws-card-likes i").on("click", function () {
    var $this = $(this);
    var domainId = $(this).closest(".ws-card-likes").attr("id");

    // Get the current count from the span (handle both number and 'K' format)
    var countText = $this.closest(".ws-card-likes").find("span").text().trim();
    var count = 0;

    // Check if the count is in the 'K' format and convert to a number
    if (countText.includes("K")) {
      count = parseFloat(countText.replace("K", "")) * 1000;
    } else {
      count = parseInt(countText);
    }

    $.ajax({
      type: "post",
      dataType: "json",
      url: cpmAjax.ajax_url,
      data: {
        action: "wstr_favourite",
        domain_id: domainId,
      },
      success: function (response) {
        if (response.success == true) {
          // console.log(response.data);
          if (response.data.count == "deduct") {
            count = Math.max(0, count - 1); // Prevent negative count
          } else {
            // Add to the count
            count++;
          }

          // Update the displayed count (convert back to 'K' format if necessary)
          if (count >= 1000) {
            $this
              .closest(".ws-card-likes")
              .find("span")
              .text((count / 1000).toFixed(1) + "K");
          } else {
            $this.closest(".ws-card-likes").find("span").text(count);
          }
        }
      },
    });
    // single product add class to checked element on payment option
    $('.payment-option').on('change', function () {
      console.log('arpan');
      // Remove 'active' class from all groups
      $('.payment_form_group').removeClass('active');

      // Add 'active' class to the parent of the currently checked input
      // $(this).closest('.payment_form_group').addClass('active');
    });

  });

  // // password validation
  $("#wstr_signup").on("submit", function (e) {
    var password = $("#password").val();
    var confirmPassword = $("#confirm-password").val();
    var errorMessage = "";

    // Password validation
    if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters long.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errorMessage = "Password must contain at least one special character.";
    } else if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
    }

    if (errorMessage !== "") {
      $("#error-msg").text(errorMessage);
      e.preventDefault();
    } else {
      $("#error-msg").text("");
      // Submit the form if validation passes
      // this.submit();
    }
  });

  // FAQ ACCORDION TOGGLE
  $(".wstr-faq-accordion-header").on("click", function () {
    var $parent = $(this).parent(".wstr-faq-accordion-item");

    // Close all other accordions
    $(".wstr-faq-accordion-item")
      .not($parent)
      .removeClass("active")
      .find(".wstr-faq-accordion-content")
      .slideUp(200)
      .prev(".wstr-faq-accordion-header")
      .find(".wstr-faq-icon i")
      .removeClass("fa-xmark")
      .addClass("fa-plus");

    // Toggle the clicked accordion
    $parent
      .toggleClass("active")
      .find(".wstr-faq-accordion-content")
      .slideToggle(200);
    $(this).find(".wstr-faq-icon i").toggleClass("fa-plus fa-xmark");
  });

  // PRICING PACAKAGES

  var slickInitialized = false;

  function initializeSlick() {
    if ($(window).width() < 768) {
      if (!slickInitialized) {
        $(".wstr-pricing-packages").slick({
          dots: true,
          arrows: false,
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
        });
        slickInitialized = true;
      }
    } else {
      if (slickInitialized) {
        $(".wstr-pricing-packages").slick("unslick");
        slickInitialized = false;
      }
    }
  }

  initializeSlick();
  $(window).resize(initializeSlick);
});

document.addEventListener("DOMContentLoaded", function () {
  var element = document.querySelector("#wstr-mulitcurrency");
  var choices = new Choices(element, {
    searchEnabled: false, // Disables the search feature
    itemSelectText: "", // Removes the "Press to select" text
  });
});


