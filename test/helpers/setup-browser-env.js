global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
global.NodeList = window.NodeList;
global.HTMLCollection = window.HTMLCollection;
