/*
 * @author sk342
 */


define(['jquery'], function ($) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    function addContent() {
      $( document ).on( 'click', '.nav-item', function() {
        window.location = $(this).find('a').attr('href');
        return false;
      });
    }
    // return only public methods
    return {
        init: addContent
    }
});
