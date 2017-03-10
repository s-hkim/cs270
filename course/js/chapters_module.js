/*
 * @author sk342
 */


define(['jquery','vocab_module'], function ($,vocab) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function addContent(data) {
      if (data.length > 0) {
        var $homework = $('#hw');
        data.forEach(function(l,idx) {
          var ci = l.chapter;
          var cn = l.name;
          var v = l.vocab;
          var $k = $('<div/>').addClass('hw-kanji').addClass('nav-item')
                              .append($('<a href="kanji.html#'+cn+'">漢字</a>'));

          var $tan = $('<div/>').addClass('hw-tango').addClass('nav-item')
                              .text('単語');
          var $vo = vocab.make(v);
          $homework.append($k);
          $homework.append($vo);
          $tan.click(function(e) {
            $vo.slideToggle();
          })
          // https://codepen.io/giana/pen/yYBpVY/ TODO
        });
      } else {
        error('No data!');
      }

    }
    // return only public methods
    return {
        init: addContent
    }
});
