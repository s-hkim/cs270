/*
 * @author sk342
 */


define(['jquery'], function ($,vivus) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    // add navigation elements to the page
    function addContent(data) {
      if (data.length > 0){
        data.forEach(function(l,urli) {
          var r = l.row;
          var c = l.col;
          var chars = l.name.split("")
          chars.forEach(function(ch,idx) {
            var $cell = $('.youshi-' + c + '-' + (r+idx));
            if (ch == '\u30FC') {
              // TODO: other characters
              ch = '|';
            }
            $cell.append($('<span>'+ch+'</span>').addClass('youshi-full'));
          });
          var $column = $('.youshi-col-' + c);
          var colori = urli % 6;
          $column.addClass('youshi-col-full');
          $column.hover(
            function() { $(this).addClass('youshi-hover-'+colori) },
            function() { $(this).removeClass('youshi-hover-'+colori) }
          );
          $column.data('location',l.url).click(function(e) {
            var $this = $(this);
            var loc = $this.data('location');
            if (loc.startsWith('#')){
              $('html,body').animate({ scrollTop: $(loc).offset().top }, 400);
            }
            else {
              window.location = loc;
            }
            return false;
          });

        });
        $( document ).ready(function() {
          $( ".youshi-full" ).fadeIn( 1000, function() {
            // Animation complete
          });
        });
      }

      else {
          error("No data!");
      }
    }

    // return only public methods
    return {
        init: addContent
    }
});
