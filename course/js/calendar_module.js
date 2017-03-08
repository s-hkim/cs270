/*
 * @author sk342
 */


define(['jquery'], function ($,vivus) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function addContent(data) {
      if (data.length > 0){
        var $cal = $('.cal');
        data.forEach(function(l,urli) {
          var $row = $('<div/>').addClass('cal-row')
                    .append(
                      $('<div/>').addClass('cal-cell-1').text(l.month)
                    ).append(
                      $('<div/>').addClass('cal-cell-1').text(l.day)
                    ).append(
                      $('<div/>').addClass('cal-cell-3').text(l.activities)
                    ).append(
                      $('<div/>').addClass('cal-cell-3').text(l.quizzes)
                    ).append(
                      $('<div/>').addClass('cal-cell-3').text(l.homework)
                    );

          if (urli % 2 == 1) {
            $row.addClass('dark');
          }

          $cal.append($row);
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
