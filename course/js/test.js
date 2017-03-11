
 /*
  * @author sk342
  */

 require.config({
     "baseUrl": "js",
     "paths": {
         "jquery": "https://code.jquery.com/jquery-3.1.1.min",
         "less": "https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min",
         "vivus": "https://cdnjs.cloudflare.com/ajax/libs/vivus/0.4.0/vivus.min",
     }
 });


 require([
     "less",
     "jquery",
     "vivus",
     "grid_module",
     "content_module",
     "chapters_module",
     "calendar_module",
     "resources_module",
     "events_module"
   ],

     function (less, $, vivus, grid, content, chapters, calendar, resources, events) {

         const folderPrefix = 'data_';
         const folderTheme = $('#script').attr('theme');
         const gridFile = folderPrefix + folderTheme + '/grid.json';
         const contentFile = folderPrefix + folderTheme + '/content.json';
         const navFile = folderPrefix + folderTheme + '/chapters.json';
         const hwFile = folderPrefix + folderTheme + '/calendar.json';
         const resourcesFile = folderPrefix + folderTheme + '/resources.json';

         const gridModuleAction = grid.init;
         const contentModuleAction = content.init;
         const navModuleAction = chapters.init;
         const hwModuleAction = calendar.init;
         const resourcesModuleAction = resources.init;

         function loadJSON(jsonFile, actionOnLoad, callback) {
             $.getJSON(jsonFile, function (data) {
                 try {
                     actionOnLoad(data);
                     typeof callback === 'function' && callback();
                 } catch (err) {
                     alert(err);
                 }
             });
         }
         $(function() {
            QUnit.test('test', function (assert) {
              assert.expect(0);
              loadJSON(gridFile, gridModuleAction, function() {
                 loadJSON(contentFile, contentModuleAction, function() {
                   var $content = $('#content');
                   var $svg = $('#svgcont');
                   assert.notStrictEqual($content.width(), $svg.width(), 'content width scaled');
                   assert.notStrictEqual($content.height(), $svg.height(), 'content height scaled');
                   assert.strictEqual($('.youshi-col').length, 20, 'grid cols loaded');
                   assert.strictEqual($('.youshi-spacer').length, 19, 'grid spacers loaded');
                   assert.strictEqual(parseFloat($('.youshi-spacer').css('flex-grow')),$('.youshi-col').css('flex-grow') / 2, 'col spacer ratio correct');
                   assert.strictEqual($('.youshi-col-full').length, 9, 'nav cols loaded');
                   assert.strictEqual($('.youshi-full').length, 38, 'nav cells loaded');

                   assert.strictEqual($('#foot').text().trim(), '20ｘ20', 'grid dimensions');
                 });
              });
              loadJSON(hwFile, hwModuleAction, function() {
                assert.strictEqual($('#calendar').children().length, 51, 'calendar loaded');
                assert.strictEqual($($('.cal-row')[0]).children().length, 4, 'cal row size');

              });
              loadJSON(navFile, navModuleAction, function() {
                 assert.strictEqual($('#hw').children().length, 7, 'chapters loaded');
                 assert.strictEqual($($('.hw-topic')[0]).text(), '日本の便利な店', 'first topic correct');
                 assert.strictEqual($($('.hw-topic')[1]).text(), '日本の歴史', 'second topic correct');
                 assert.strictEqual($($('.hw-topic')[2]).text(), '日本の伝統工芸', 'third topic correct');
                 assert.strictEqual($($('.hw-topic')[3]).text(), '日本人と自然', 'fourth topic correct');
                 assert.strictEqual($($('.hw-topic')[4]).text(), '日本の政治', 'fifth topic correct');

                 assert.strictEqual($('.vocab-block').css('display'), 'none', 'vocab hidden');
                 $('.hw-button').trigger('click');
                 assert.strictEqual($('.vocab-block').css('display'), 'block', 'show vocab');
                 assert.strictEqual($('.vocab-row').length,364, 'vocab items');
                 assert.strictEqual($($('.vocab-row')[0]).children().length, 3, 'vocab row size');
                 assert.strictEqual($('.vocab-cell').length, 1092, 'vocab cells loaded');
              });
              loadJSON(resourcesFile, resourcesModuleAction, function() {
                assert.strictEqual($('#resources').children().length, 9, 'resources loaded');
                assert.strictEqual($($('.resources-row')[0]).children().length, 4, 'resources row size');
                assert.strictEqual($('.resources-cell').length, 16, 'resources cells loaded');
                events.init();
              });
              $('.nav-item').first().trigger('click');
              // assert.strictEqual(window.location.href, "file:///C:/Users/Sung-Hoon/Documents/COMPSCI/portfolio/course/test.html#", 'nav-item click');


            });
        });
    }
);
