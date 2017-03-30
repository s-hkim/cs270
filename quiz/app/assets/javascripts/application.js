/*
 * This is a manifest file that'll be compiled into application.js, which will include all the files
 * listed below.
 * 
 * Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
 * or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
 *
 * It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
 * compiled file.
 * 
 * Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
 * about supported directives.
 */
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

// make JSLint happy
/* global $ */

// check if user's response is correct or not
function checkResponse() {
    var choice = $('input[name="answer"]:checked');
    if (choice.length === 0) {
        alert('Please make a selection!');
    } else {
        var answer = $('input[name="correct"]');
        // visit this "page" (i.e., activate a route within Rails)
        window.location = (choice.val() === answer.val()) ? '/submit/correct' : '/submit/wrong';
    }
}
function startResponse() {
    var choice = $('input[name="answer"]:checked');
    if (choice.length === 0) {
        alert('Please make a selection!');
    } else {
        window.location = '/create/' + choice.val();
    }
}


// since entire site is "loaded" as a single page, listen for LOAD events
window.addEventListener('turbolinks:load', function () {
    // check for null since we may not be on the page we expect to be
    var element = $('#submit');
    if (element !== null) {
        element.on('click', checkResponse);
    }
    var previous = $('#previous');
    if (previous !== null) {
        previous.on('click', function() {
            window.location = '/previous';
        })
    }
    var retake = $('#restart');
    if (retake !== null) {
        retake.on('click', function() {
            window.location = '/restart';
        });
    }
    var index = $('#return');
    if (index !== null) {
        index.on('click', function() {
            window.location = '/';
        })
    }
    var start = $('#start');
    if (start !== null) {
        start.on('click', startResponse)
    }
});
