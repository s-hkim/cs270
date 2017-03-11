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
        var $block = $('#resources');
        data.forEach(function(l,idx) {
          var $row = $('<div/>').addClass('resources-row')
                      .append($('<div/>').addClass('resources-bg-cell'))
                      .append($('<div/>').addClass('resources-cell')
                                          .append($('<a href="'+l.link+'">'+l.link+'</a>')))
                      .append($('<div/>').addClass('resources-cell').text(l.name))
                      .append($('<div/>').addClass('resources-bg-cell'));
          if (idx % 2 == 1) {
            $row.addClass('dark');
          }
          $block.append($row);
        });

      } else {
        error('No data!');
      }
    }

    // return only public methods
    return {
        init: createBlock

    }
});
