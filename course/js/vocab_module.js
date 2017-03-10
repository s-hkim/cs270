/*
 * @author sk342
 */


define(['jquery'], function ($) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function createBlock(data) {
      if (data.length > 0) {
        var $block = $('<div/>');
        data.forEach(function(l,idx) {
          var $row = $('<div/>').addClass('vocab-row')
                      .append($('<div/>').addClass('vocab-cell').text(l.kanji))
                      .append($('<div/>').addClass('vocab-cell').text(l.hiragana))
                      .append($('<div/>').addClass('vocab-cell').text(l.definition));
          if (idx % 2 == 1) {
            $row.addClass('dark');
          }
          $block.append($row);
        });
        return $block;

      } else {
        error('No data!');
      }
    }

    // return only public methods
    return {
        make: createBlock

    }
});
