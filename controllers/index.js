(function (ctrls) {
    ctrls.init = function (app, auth, data) {
        var homeCtrl = require('./homeCtrl');
        var notesCtrl = require('./notesCtrl');        

        homeCtrl.init(app, auth, data);
        notesCtrl.init(app, auth, data);
    };

})(module.exports);