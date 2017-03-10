

/*
 * @author sk342
 */


define(['jquery','vivus'], function ($,vivus) {

    const OUTLINE_DUR = 100;
    const COL_DUR = 500;
    const ROW_DUR = 50;
    const COL_DELAY = 10;
    const ROW_DELAY = 20;
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
        var rg = data.rowgap;
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
        //
        $youshi.append($('<path class="grid-outline" data-delay="7" data-async="" d="M'+(fullw)+',0 h'+(-1*fullw)+'" />').attr('data-duration',OUTLINE_DUR));
        // bottom
        $youshi.append($('<path class="grid-outline" data-async="" d="M0,'+maxh+' h'+fullw+'" />').attr('data-duration',OUTLINE_DUR))
        // right
        $youshi.append($('<path class="grid-outline" data-async="" d="M'+(fullw)+','+maxh+' v'+(-1*maxh)+'" />').attr('data-duration',OUTLINE_DUR))
        // left
        $youshi.append($('<path class="grid-outline" d="M 0,0 v'+maxh+'" />').attr('data-duration',OUTLINE_DUR))
        var pathstart = '<path class="grid" d=" ';
        var pathend = '" />';
        var allcol = []
        var allrow = []

        for (var i = 0; i < columns; i++) {

          var colpath = pathstart;
          colpath += 'M'+ (maxw - (i*(w+cg))) +',0 v' + maxh + ' ';
          // $youshi.append($('<path d="M '+ (maxw - (i*(w+cg))) +' 0 v ' + maxh + '" fill="none" stroke="gray" stroke-width="1"/>'))
          if (cg > 0) {
            colpath += 'M'+ (maxw - w - (i*(w + cg))) +',0 v' + maxh + ' '
            // $youshi.append($('<path d="M '+ (maxw - w - (i*(w + cg))) +' 0 v ' + maxh + '" fill="none" stroke="gray" stroke-width="1"/>'))
          }

          colpath += pathend;
          // allcol.push(colpath);

          $youshi.append($(colpath).addClass('.grid-vertical')
            .attr({
              'data-async':'',
              'data-delay':COL_DELAY,
              'data-duration':COL_DUR
            })
          );
        }
        for (var j = 0; j < rows + 1; j++) {
          var rowpath = pathstart;
          rowpath += 'M' + (maxw - (i*(w+cg))) +','+ (j * h) + ' h' + (-1 * w) + ' '
          // $youshi.append($('<path d="M ' + (maxw - (i*(w+cg))) +' '+ (j * h) + ' h ' + (-1 * w) + '" fill="none" stroke="gray" stroke-width="1"/>'))

          rowpath += pathend;
          // allrow.push(rowpath);
        }

        $youshi.append($(rowpath).addClass('.grid-horizontal')
          .attr({
            'data-async':'',
            'data-delay':ROW_DELAY,
            'data-duration':ROW_DUR
          })
        );
        // allcol.forEach(function(colpath) {
        //   $youshi.append($(colpath).attr('data-async','').attr('data-delay',1).attr('data-duration',50));
        // });
        // allrow.forEach(function(rowpath) {
        //   $youshi.append($(rowpath));
        // })


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

        $('.loading').removeClass('loading');
        new vivus('youshi', {delay: 0, duration: 5, type: 'scenario-sync'},function() {
          $('.grid-horizontal').animate({
            'stroke-dasharray' : w+','+cg
          })
          $('.youshi-col-full').each(function(i,el) {
            setTimeout(function() {
              $(el).mouseenter();
            },COLOR_DELAY * i);
            setTimeout(function() {
              $(el).mouseleave();
            },COLOR_DELAY * i + COLOR_DUR);
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
