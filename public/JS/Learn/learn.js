app.controller('learnController' , ['$scope','restDataService' , function ($scope,restDataService) {
	$scope.obj = {};
	$scope.obj.pageName = "HTMl";
	restDataService.getOrPostData("users/getIndexJson","POST",$scope.obj,function (response){
		$scope.indexObject = response.data;
	});
}]);