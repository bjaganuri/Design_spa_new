var app = angular.module("myApp");

app.controller("designLayoutController" , ['$scope','fileUpload','restDataService' ,function($scope,fileUpload,restDataService){
    $scope.psdTotemplate = true;
    $scope.fileName = 'Choose a file...';
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var uploadUrl = "users/parsePSD";
        restDataService.getData('users/fileExists' ,{fileName:file.name,type:file.type} ,function (response) {
            if(response.data.status){
                if (confirm("File Already exists do you want to overwrite") == true)
                    fileUpload.uploadFileToUrl(file, uploadUrl,true);
                else
                    fileUpload.uploadFileToUrl(file, uploadUrl,false);
                return;
            }
            fileUpload.uploadFileToUrl(file, uploadUrl,false);
        });
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl,overwrite){
        var fd = new FormData();
        fd.append('psdFile', file);
        fd.append('comments', "No comment");
        fd.append('overwrite', overwrite);
        fd.append('fileName', file.name);
        fd.append('type', file.type);
        $http({
            url:uploadUrl,
            method:"POST",
            data:fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
        .then(function(response){
            console.log(response);
        },function(error){
            console.log(error);
        });
    };
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);