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
        /*
         * variables to configure where to specify JSON data and how to process it
         * YOU MAY NEED TO MODIFY THESE
         */
        // JSON data files to load
        const folderPrefix = 'data_'
        const folderTheme = $('#script').attr('theme')
        //const themeFile = $('#script').attr('theme');
        const gridFile = folderPrefix + folderTheme + '/grid.json';
        const contentFile = folderPrefix + folderTheme + '/content.json';
        const navFile = folderPrefix + folderTheme + '/chapters.json';
        const hwFile = folderPrefix + folderTheme + '/calendar.json';
        const resourcesFile = folderPrefix + folderTheme + '/resources.json';
        // actions to apply to JSON files
        //const lessAction = less.modifyVars;
        const gridModuleAction = grid.init;
        const contentModuleAction = content.init;
        const navModuleAction = chapters.init;
        const hwModuleAction = calendar.init;
        const resourcesModuleAction = resources.init;
        /*
         * actually load JSON data and how to process it
         * YOU HOPEFULLY WILL NOT NEED TO MODIFY THIS
         */
        // given a JSON data file, apply the given action to it after it is loaded and parsed
        function loadJSON(jsonFile, actionOnLoad) {
            $.getJSON(jsonFile, function (data) {
                try {
                    actionOnLoad(data);
                } catch (err) {
                    alert(err);
                }
            });
        }


        // reset default LESS variable values if theme is succcessfully loaded
        //loadJSON(themeFile, lessAction);
        // call module's main function if data is succcessfully loaded
        // order matters here
        loadJSON(gridFile, gridModuleAction);
        loadJSON(contentFile, contentModuleAction);
        loadJSON(navFile, navModuleAction);
        loadJSON(hwFile, hwModuleAction);
        loadJSON(resourcesFile, resourcesModuleAction);
        events.init();
    }
);
