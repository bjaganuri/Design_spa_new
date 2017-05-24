var app = angular.module('myApp');
app.controller("designElementController" , ['$scope','restDataService' , function($scope,restDataService){
    $scope.htmlElements = [];
    $scope.cssProps = [];
    $scope.curElemAppliedStyles = new Object();
    $scope.curElemAttrs = new Object();
    $scope.showHelper = false;
    
    $scope.verticalSlider = {
        value: 0,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            vertical: true
        }
    };
    
    //To get the list elements
    $scope.getHTMLElemsList = function () {
        restDataService.getData("/users/htmlElements",'',function(response){
            $scope.htmlElements = response.data;
            $scope.selectedElem = $scope.htmlElements[2];
            $scope.createElement($scope.selectedElem);
            $scope.getCSSPropsList();
        });
    };
    
    //To get the list CSS properties that can be applied on to selected element
    $scope.getCSSPropsList = function () {
        restDataService.getData("/users/cssprops",'',function(response){
            $scope.cssProps = response.data;
            $scope.refreshCurElemAppliedStyles();
        });  
    };
    
    //To create selected element
    $scope.createElement = function (elemObj) {
        var element = document.createElement(elemObj.name);
        angular.element(document.querySelector(".element-wrapper"))[0].innerHTML = null;
        angular.element(document.querySelector(".element-wrapper"))[0].appendChild(element);
        if(elemObj.hasOwnProperty('attributes')){
            $scope.curElemAttrs = elemObj.attributes;
            $scope.setElemAttributes(element,$scope.curElemAttrs);
        }
        $scope.refreshCurElemAppliedStyles();
    };
    
    //Refresh the styles applied to currently selected element
    $scope.refreshCurElemAppliedStyles = function () {
        var tempAppliedStyleObj = $scope.getCurElemComputedStyles();
        $scope.curElemAppliedStyles = {};
        $scope.curElemAppliedStyles.height = tempAppliedStyleObj['height'];
        $scope.curElemAppliedStyles.width = tempAppliedStyleObj['width'];
        angular.forEach($scope.cssProps , function (style,index) {
            $scope.cssProps[index].value = tempAppliedStyleObj.getPropertyValue($scope.cssProps[index].name);
        });
    };
    
    //To get the computed styles of currently selelcted element
    $scope.getCurElemComputedStyles = function () {
        return window.getComputedStyle(angular.element(document.querySelector(".element-wrapper"))[0].childNodes[0]);
    };
    
    $scope.setElemAttributes = function (element,attrObj) {
        for(var key in attrObj){
            $(element).prop(key , attrObj[key]);
        }
    };
    
    $scope.updateCurElemStyles = function (node,styleObj) {
        node.removeAttribute('style');
        Object.assign(node.style,styleObj);
    };
    
    $scope.showHelperPopover = function (selectedStyle) {
        $scope.showHelper = true;
    };
    
    $scope.$watch(function () { return $scope.curElemAppliedStyles;},function (curVal,oldVal) {
        if(curVal != oldVal){
           $scope.updateCurElemStyles(angular.element(document.querySelector(".element-wrapper"))[0].childNodes[0],$scope.curElemAppliedStyles);
        }
    },true);
    
    $scope.$watch(function () { return $scope.curElemAttrs;},function (curVal,oldVal) {
        if(curVal != oldVal){
           //$scope.setElemAttributes(element,$scope.curElemAttrs);
        }
    },true);
    
    $scope.getHTMLElemsList();
}]);

app.directive("styleAdd" , function () {
    return{
        restrict:"EA",
        scope: false,
        replace: true,
        templateUrl: "/users/styleAdd",
        compile:function (tElement,tAttrs) {
            var linkFunction = function (scope,iElement,iAttrs) {
                
            };
            return linkFunction;
        },
        controller:function ($scope,$element,$attrs) {
            $scope.updateChangedStyleVal = function (styleVal) {
                if(styleVal == "" || styleVal == undefined || styleVal == " "){
                    delete $scope.curElemAppliedStyles[$scope.style.name];
                    return;
                }
                $scope.curElemAppliedStyles[$scope.style.name] = styleVal;
            };
            
            $scope.openSelectedStyleHelper = function () {
                if($scope.styleSelected){
                    $scope.showHelperPopover($scope.style);
                }
            };
            
            $scope.showSelectedStyleInfo = function ($event) {
                if($event.target.tagName == "SPAN"){
                    $($event.target).tooltip({
                        selector:$event.target,
                        placement:"bottom",
                        container: $element,
                        title:$scope.style.about
                    }).tooltip("show");   
                }
            };
        }
        
    };
});

app.directive("appliedStyle" , function () {
    return{
        restrict:"EA",
        scope: false,
        replace: true,
        template: "<div class='form-group pull-left col-sm-12'>"+
                "<label class='control-label col-sm-5' >{{key}}</label>"+
                "<span class='col-sm-1'>:</span>"+
                "<div class='col-sm-6'><input type='text' class='form-control' value={{value}} ng-model=value ng-change='updateStyle($event)' ng-blur='updateStyle($event)' ng-keyup='updateStyle($event)'></div>"+
                "</div>",
        compile:function (element,attrs) {
            var linkFunction = function (scope,element,attrs) {
               
            };
            return linkFunction;
        },
        controller:function ($scope,$element,$attrs) {
            $scope.updateStyle = function ($event) {
                if($event != undefined){
                    $event = $event || window.event;
                    if($event.type == "blur" && ($scope.value == "" || $scope.value == undefined || $scope.value == " ")){
                        $scope.curElemAppliedStyles[$scope.key] = $scope.getCurElemComputedStyles()[$scope.key];
                        return;
                    }
                    else if($event.type == "keyup" && ($scope.value == "" || $scope.value == undefined || $scope.value == " ") && $event.keyCode == 13){
                        delete $scope.curElemAppliedStyles[$scope.key];
                        return;
                    }
                }
                $scope.curElemAppliedStyles[$scope.key] = $scope.value;
            };
        }
    };
});