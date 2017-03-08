/*
 * @author sk342
 */


define(['jquery'], function ($) {
    // throw a generic error
    function error(msg) {
        throw "Error: " + msg;
    }

    // add navigation elements to the page
    function addLinks(links) {

    }

    // return only public methods
    return {
        init: addLinks
    }
});
