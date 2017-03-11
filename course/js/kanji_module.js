/*
 * @author sk342
 */


define(['jquery','vivus'], function ($,vivus) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }
    // https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
    hexEncode = function(str){
      var hex, i;

      var result = "";
      for (i=0; i<str.length; i++) {
          hex = str.charCodeAt(i).toString(16);
          result += ("000"+hex).slice(-4);
      }
      return result
    }
    function addContent(data) {
      if (data.length > 0) {
        var $nav = $('.nav');
        var $main = $('#kanji-main');
        data.forEach(function(l,urli) {
          var chapter = l.chapter;
          var kanji = l.kanji;

          $nav.append(
            $('<div/>')
              .addClass('nav-item')
              .append(
                $('<a href=#'+chapter+'>'+chapter+'</a>')
              )
          );
          var $wrapper = $('<div/>').addClass('kanji-wrapper')
                                    .attr('id',chapter)
                                    .append(
                                      $('<div>'+chapter+'</div>')
                                        .addClass('kanji-block-header'));
          var $block = $('<div/>').addClass('kanji-block')
          $wrapper.append($block);
          kanji.forEach(function(k,idx) {
            var char = k.character;
            var seq = "0" + hexEncode(char);
            var $cont = $('<div/>').addClass('kanji-container').attr('id',seq);
            $cont.append($('<object id="kanji-'+seq+'" type="image/svg+xml" data="img/'+seq+'.svg"></object>'));
            $block.append($cont);
          });
          $main.append($wrapper);
        });
        $( document ).ready(function() {
          $('.kanji-container').each(function(i,el){
            var $el = $(el);
            var seq = $el.attr('id');
            var animation = new vivus('kanji-'+seq,{duration:100, start: 'manual', type: "oneByOne"});
            animation.finish();
            $el.hover(
              function() {animation.stop().reset().play()},
              function() {}
            );
          });
          // $('.hidden').fadeIn(500);
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
