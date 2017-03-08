

/*
 * @author sk342
 */


define(['jquery','vivus'], function ($,vivus) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function addGrid(data) {
      if (data) {
        data = data[0]
        var columns = data.columns;
        var rows = data.rows;
        var w = data.colwidth;
        var h = data.rowheight;
        var rg = data.rowgap;
        var cg = data.colgap;
        var p = data.hpadding;
        var maxw = columns * (w + cg) - cg + p;
        var fullw = maxw + p;
        var maxh = rows * (h + rg) - rg;
        var rat = fullw/maxh;
        var $youshi = $('#youshi');
        var $main = $('#main');
        $youshi.attr('viewBox',"0 0 "+fullw + " "+maxh)
        $main.css({
          'width' : 95 + 'vw',
          'height' : (95 / rat) + 'vw',
          'max-height' : 95 + 'vh',
          'max-width' : rat * 95 + 'vh'
        });

        //
        $youshi.append($('<path class="grid" d="M 0 0 h '+fullw+' M 0 '+maxh+' h '+fullw+' fill="none" stroke="gray" stroke-width="1"/>'))
        //bottom
        // $youshi.append($('<path d="M 0 '+maxh+' h '+fullw+' fill="none" stroke="gray" stroke-width="1"/>'))
        //right
        // $youshi.append($('<path d="M '+fullw+' 0 v '+maxh+' fill="none" stroke="gray" stroke-width="1"/>'))
        for (var i = 0; i < columns; i++) {
          var path = '<path class="grid" d="';
          path += 'M '+ (maxw - (i*(w+cg))) +' 0 v ' + maxh + ' ';
          // $youshi.append($('<path d="M '+ (maxw - (i*(w+cg))) +' 0 v ' + maxh + '" fill="none" stroke="gray" stroke-width="1"/>'))
          if (cg > 0) {
            path += 'M '+ (maxw - w - (i*(w + cg))) +' 0 v ' + maxh + ' '
            // $youshi.append($('<path d="M '+ (maxw - w - (i*(w + cg))) +' 0 v ' + maxh + '" fill="none" stroke="gray" stroke-width="1"/>'))
          }
          for (var j = 0; j < rows + 1; j++) {
            path += 'M ' + (maxw - (i*(w+cg))) +' '+ (j * h) + ' h ' + (-1 * w) + ' '
            // $youshi.append($('<path d="M ' + (maxw - (i*(w+cg))) +' '+ (j * h) + ' h ' + (-1 * w) + ' fill="none" stroke="gray" stroke-width="1"/>'))
          }
          path += ' fill="none" stroke="gray" stroke-width="1"/>'
          $youshi.append($(path));
        }
        // have to refresh the div
        var $cont = $('#svgcont');
        $cont.html($cont.html());

        // set up divs
        var $box = $('#content');
        for (var i = 0; i < columns; i++) {
          var $col = $("<div/>").addClass('youshi-col').addClass('youshi-col-'+i);
          for (var j = 0; j < rows; j++) {
            var $cell = $('<div/>').addClass('youshi-cell').addClass('youshi-' + i + '-' + j);
            $col.append($cell);
          }
          $box.append($col);
          if (i < columns -1) {
            $box.append($("<div/>").addClass('youshi-spacer'));
          }
        }
        var $footer = $('#foot')
        $footer.append('<span>'+rows +'ｘ'+ columns+'</span>');
        new vivus('youshi', {duration: 200, type: 'delayed'},function() {
          $('.youshi-col-full').each(function(i,el) {
            setTimeout(function() {
              $(el).mouseenter();
            },200 * i);
            setTimeout(function() {
              $(el).mouseleave();
            },200 * i + 400);
          });
        });
      }
      else {
          error("No data!");
      }
    }
    // return only public methods
    return {
        init: addGrid
    }
});
