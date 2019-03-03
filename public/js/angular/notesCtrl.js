//notesCtrl.js
(function (angular) {
    
    angular
    .module('notesMod', ['ui.bootstrap'])
    .controller('notesCtrl', 
        ['$scope', '$window', '$http',
            function ($scope, $window, $http) {
            
            $scope.notes = [];
            $scope.newNote = createBlankNote();
            
            //Get the category name
            var urlParts = $window.location.pathname.split('/');
            var categoryName = urlParts.pop();
            var notesUrl = "/api/notes/" + categoryName;
            
            $http.get(notesUrl)
            .then(function (results) {
                $scope.notes = results.data;
            }, function (err) {
                alert(err);
            });
            //Socket.io
            var socket = io.connect();
            socket.emit('join_category', categoryName);
            socket.on('broadcast_note', function (note) {
                $scope.notes.push(note);
                $scope.$apply();
            });

            $scope.save = function () {
                $http.post(notesUrl, $scope.newNote)
                .then(function (results) {
                    $scope.notes.push(results.data);
                    $scope.newNote = createBlankNote();
                    //Socket.io
                    socket.emit('addNote', { category: categoryName, note: results.data });
                }, function (err) {
                    alert(err);
                });
            };
                      
            function createBlankNote() {
                return {
                    note: "", 
                    color: "yellow", 
                    author: ""
                };
            }

        }]);

})(window.angular);