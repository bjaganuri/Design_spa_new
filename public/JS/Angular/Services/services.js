//Services defined to use globally

//Service defined to observe idle state od user
app.provider("idleObserverService" , function () {
	var timeout = 15;
	var count = 15;
	var warning = false;
	var timedout = false;
	this.setTimeout = function (T) {
		timeout = T;
		count = T;
	};
	
	this.$get = ['Idle','$http','restDataService','$state','$interval' , function (Idle,$http,restDataService,$state,$interval) {
		return{
			checkUserLoggedStatus: function () {
		        restDataService.get("/users/sessionData" , '').then(function(response){
		        	if(response.data.status === "AUTHORIZED" && !$state.includes("authenticateUser") && !$state.includes("otherwise")){
		        	 	$("#warningModal").modal("show");
		        	 	warning = true;
		        	 	this.idletimer = $interval(function(){
				        	count--;
				        } , 1000);
		        	}
		        	else{
		        		Idle.unwatch();
		        	}
		        });
			},
			start:function() {
		        this.stop();
		        Idle.watch();
		    },
		    idleTimeout:function () {
				$("#timeOutModal").modal("show");
        		timedout = true;	
			},
			stop:function() {
		        if (warning) {
		          	$("#warningModal").modal("hide");
		          	warning = false;
		        }
		        if (timedout) {
			        $("#timeOutModal").modal("hide");
			        timedout = false;
		        }
		        $interval.cancel(this.idletimer);
		        count = timeout;
		    },
		    logout:function($event){
		    	this.stop();
		    	$http.get("/users/logout");
		    	$state.transitionTo('authenticateUser.login');
		    }
		};
	}];
});

//Service communicate with backend and get or post data
app.service("restDataService" , ['$http' , '$log' , function ($http,$log) {
	this.get = function (url,data) {
		return $http({
			url: url,
			method: "GET",
			params: data
		});
	};

	this.post = function (url,data) {
		return $http({
			url: url,
			method: "POST",
			data: data
		});
	};
	
	this.getData = function (url,data,callback) {
		this.get(url,data).then(function (response) {
			callback(response);
		},function (Error) {
			$log.error(Error);
		});
	};

	this.postData = function (url,data,callback) {
		this.post(url,data).then(function (response) {
			callback(response);
		},function (Error) {
			$log.error(Error);
		});
	};
}]);

app.service('restDataInterceptor' , ['$q','$injector',function ($q,$injector) {
	this.request = function (config) {
		console.log("Fetching "+ config.url+" .......");
		return config;
	};

	this.requestError = function (rejection) {
		console.log(rejection);
		return rejection;
	};

	this.response = function (response) {
		console.log("Fetching "+ response.config.url +" done...");
		return response;
	};

	this.responseError = function (rejection) {
		if(rejection.status == 401){
			var restDataService = $injector.get('restDataService');
			var $http = $injector.get('$http');
			var $window = $injector.get('$window');
			var deferred = $q.defer();
			if($window.sessionStorage.getItem("loggedInUser")){
				restDataService.post("users/login",$window.sessionStorage.getItem("loggedInUser")).then(deferred.resolve, deferred.reject);
				return deferred.promise.then(function () {
					return $http(rejection.config);
				});
			}
		}
		return $q.reject(rejection);
	};
}]);