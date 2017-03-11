

/*
 * @author sk342
 */


define(['jquery','vivus'], function ($,vivus) {

    const OUTLINE_DUR = 20;
    const COL_DUR = 20;
    const ROW_DUR = 20;
    const OUTLINE_DELAY = 7;
    const COL_DELAY = 0;
    const ROW_DELAY = 0;
    const COLOR_DUR = 400;
    const COLOR_DELAY = 100;
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function addGrid(data) {
      if (data) {
        data = data[0];
        var columns = data.columns;
        var rows = data.rows;
        var w = data.colwidth;
        var h = data.rowheight;
        var rg = data.rowgap;   // TODO
        var cg = data.colgap;
        var p = data.hpadding;
        var innerw = columns * (w + cg) - cg;
        var maxw = innerw + p;
        var fullw = maxw + p;
        var maxh = rows * (h + rg) - rg;
        var rat = fullw/maxh;
        var $youshi = $('#youshi');
        var $main = $('#main');
        $youshi.attr('viewBox',"0 0 "+fullw + " "+maxh);
        $('#content').css('width',(100*innerw/fullw)+'%');
        $main.css({
          'width' : 95 + 'vw',
          'height' : (95 / rat) + 'vw',
          'max-height' : 95 + 'vh',
          'max-width' : rat * 95 + 'vh'
        });
        // top
        $youshi.append($('<path d="M'+(fullw)+',0 h'+(-1*fullw)+'" />').addClass('grid-outline')
          .attr({
            'data-async' : '',
            'data-delay' : OUTLINE_DELAY,
            'data-duration' : OUTLINE_DUR
          })
        );
        // bottom
        $youshi.append($('<path d="M0,'+maxh+' h'+fullw+'" />').addClass('grid-outline')
          .attr({
            'data-async' : '',
            'data-duration' : OUTLINE_DUR
          })
        );
        // right
        $youshi.append($('<path d="M'+(fullw)+','+maxh+' v'+(-1*maxh)+'" />').addClass('grid-outline')
          .attr({
            'data-async' : '',
            'data-duration' : OUTLINE_DUR
          })
        );
        // left
        $youshi.append($('<path d="M 0,0 v'+maxh+'" />').addClass('grid-outline')
          .attr({
            'data-async' : '',
            'data-duration' : OUTLINE_DUR
          })
        );
        var pathstart = '<path class="grid" d=" ';
        var pathend = '" />';

        for (var i = 0; i < columns; i++) {
          var colpath = pathstart;
          var pill = [];
          var x = (maxw - (i*(w+cg)));
          var y,dy;
          if (i%2==0) {
            y = 0;
            dy = maxh;
          } else {
            y = maxh;
            dy = -1 * maxh;
          }
          colpath += 'M'+ x +','+y+' v' + dy + ' ';
          colpath += pathend;
          pill.push(colpath);
          if (cg > 0) {
            colpath = pathstart;
            colpath += 'M'+ (x-w) +','+y+' v' + dy + ' ';
            colpath += pathend;
            pill.push(colpath);
          }
          pill.forEach(function(temppath) {
            $youshi.append($(temppath).addClass('grid-vertical')
              .attr({
                'data-async':'',
                'data-delay':COL_DELAY,
                'data-duration':COL_DUR
              })
            );
          })
        }
        for (var j = 1; j < rows; j++) {
          for (var i = 0; i < columns; i++) {
            var rowpath = pathstart;
            // rowpath += 'M' + (maxw) +','+ (j * h) + ' h' + (-1 * innerw) + ' ';
            rowpath += 'M' + (maxw - (i*(w+cg))) +','+ (j * h) + ' h' + (-1 * w) + ' ';
            rowpath += pathend;
            $youshi.append($(rowpath).addClass('grid-horizontal')
              .attr({
                'data-async':'',
                'data-delay':ROW_DELAY,
                'data-duration':ROW_DUR
              })
            );
          }
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
          if (cg > 0) {
            if (i < columns -1) {
              $box.append($("<div/>").addClass('youshi-spacer').css('flex-grow',cg/w));
            }
          }
        }
        var $footer = $('#foot')
        $footer.append('<span>'+rows +'ｘ'+ columns+'</span>');

        $( document ).ready(function() {
          $('.loading').removeClass('loading');
          new vivus('youshi', {delay: 0, duration: 5, type: 'scenario-sync'},function() {
            $('.youshi-col-full').each(function(i,el) {
              setTimeout(function() {
                $(el).mouseenter();
              },COLOR_DELAY * i);
              setTimeout(function() {
                $(el).mouseleave();
              },COLOR_DELAY * i + COLOR_DUR);
            });
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
