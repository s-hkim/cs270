$(function() {
  var IMGURL = "http://lorempixel.com/400/200/";
  var NUM_ROW = 5;
  var NUM_COL = 2;
  var MAX_COLLECTION = 10;
  var CAROUSEL_HEIGHT = 50;
  var CAROUSEL_WIDTH = 100;
  var categories = [
    "abstract",
    "animals",
    "business",
    "cats",
    "city",
    "food",
    "nightlife",
    "fashion",
  ];
  var current_category = 0;
  var $carousel = $('#carousel');
  var $checkbox = $('#checkbox');
  var $collection = $('#collection');
  var $single = $('#single');
  var $prev_button = $('#prev-button');
  var $next_button = $('#next-button');

  var createCarousel = function() {
    $carousel.css({
      width: CAROUSEL_WIDTH+30+'px',
      height: CAROUSEL_HEIGHT+'px'
    });
    categories.forEach(function(x) {
      var $item = $('<div/>').addClass('carousel-item')
                            .css({
                              width: CAROUSEL_WIDTH+'px',
                              height: CAROUSEL_HEIGHT+'px'
                            })
                            .append(
                              $('<img src="' + IMGURL + x + '" />')
                            );
      $carousel.append($item);
    });
    $($carousel.children()[current_category]).addClass('carousel-active');
  };
  var showSingle = function () {
    var source = $($(this).children()[0]).attr('src');
    $single.empty();
    $single.append($('<img src="'+source+'"/>'));
    $single.append($('<div>'+source.split(IMGURL)[1]+'</div>'));
    $single.show();
  };

  var changeCategory = function (next_category) {
    if (-1 < next_category && next_category < categories.length) {
      current_category = next_category;
    }
    $('.carousel-active').off('click',showGallery);
    $('.carousel-active').removeClass('carousel-active');
    $($carousel.children()[current_category]).addClass('carousel-active');
    $('.carousel-active').on('click',showGallery);
  };

  var createRadios = function () {
    categories.forEach(function(x,i) {
      $checkbox.append($('<div/>').addClass('checkbox-item')
                .html('<input class="checkbox-input" type="radio" name="category" value=' + i + ' />' + x)
      );
    });
    $('.checkbox-input').each( function(index, element) {
      $(element).click(function(){
        var $this = $(this);
        changeCategory(parseInt($this.val()));
        showGallery();
      });
    });
  };

  var showGallery = function () {
    var category = categories[current_category];
    var counter = 1;
    $single.hide();
    $collection.empty();
    for (var i = 0; i < NUM_ROW; i++) {
      var $row = $('<div/>').addClass('row');
      for(var j = 0; j < NUM_COL; j++) {
        var $col = $('<div/>').addClass('col-md-' + Math.floor(12 / NUM_COL))
                              .append(
                                $('<div/>').addClass('collection-item')
                                  .css({
                                    width: '100%',
                                    height: '100%'
                                  })
                                  .append(
                                    $('<img src="'+ IMGURL + category + '/' + counter + '"/>')
                                  )
                              );
        $row.append($col);
        counter++;
      }
      $collection.append($row);
    }
    $('.collection-item').each( function(index, element) {
      $(element).click(showSingle);
    });
  }

  createRadios();
  createCarousel();
  $prev_button.click(function() {
    changeCategory(current_category-1);
  });
  $next_button.click(function() {
    changeCategory(current_category+1);
  });
  showGallery();

});
