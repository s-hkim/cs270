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
          var topic = l.topic;
          var v = l.vocab;
          var $chapter = $('<div/>').addClass('hw-chapter').text(cn);
          $chapter.append($('<div/>').addClass('hw-topic').text(topic));
          var $wrap = $('<div/>').addClass('hw-button-wrap');
          var $k = $('<div/>').addClass('hw-kanji').addClass('nav-item').addClass('hw-button')
                              .append($('<a href="kanji.html#'+cn+'">漢字</a>'));

          var $tan = $('<div/>').addClass('hw-tango').addClass('t-button').addClass('hw-button')
                              .text('単語');
          var $vo = vocab.make(v);
          $vo.hide();
          $wrap.append($k);
          $wrap.append($tan);
          $chapter.append($wrap);
          $chapter.append($vo);
          $tan.click(function(e) {
            $vo.slideToggle();
          })
          $homework.append($chapter);
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
