var app = angular.module('TMDB', ['ngResource','ngDialog']);

app.controller('mainController', ['$scope', '$http','$sce','AuthFactory', function ($scope, $http,$sce,AuthFactory) {
      $scope.rating1 = 5;
    $scope.rating2 = 2;
    $scope.isReadonly = true;
     $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    $scope.rateFunction = function(rating) {
      console.log('Rating selected: ' + rating);
    };
    $scope.page = 1;
     $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
    $scope.movieget = function (page) {
        $scope.page = page;
        console.log($scope.page);
        console.log($scope.page);
         return $http({
         method: 'POST',
         url: '/upcoming/' + page,
         data: {"data":{}},
         headers: {'Content-Type': 'application/json'}
        }).then(function(response){
            $scope.data = JSON.parse(response.data);
            console.log($scope.data,$scope.data.page);
        
        });
    };
    if($scope.page == 1){
        $scope.movieget(1);
    };
    $scope.movData = function (id) {
         $http({
         method: 'GET',
         url: 'rating/'+$scope.rating1+'/:'+$scope.username ,
         headers: {'Content-Type': 'application/json'}
        }).then(function(response){
            $scope.ratingModel = JSON.parse(response.data); 
             $scope.rating1 = $scope.ratingModel.rating;
            console.log(response.data);
        
        });
         console.log('enter');
              $http({
         method: 'POST',
         url: "/movie/" + id,
         data: {},
         headers: {'Content-Type': 'application/json'}
        }).then(function(response){
        $scope.movie = JSON.parse(response.data);
        console.log($scope.data);
        getUrl = '/trailer/'+id;
        console.log(getUrl);
        $http({
          method: 'POST',
          url: getUrl
        }).then(function successCallback(response) {
            $scope.trailer = JSON.parse(response.data);
            console.log($scope.trailer);
          if (response.data.error=== undefined){
            $scope.videoUrl = "https://www.youtube.com/embed/" + $scope.trailer.results[0].key;
              console.log($scope.videoUrl);
//            $http({
//             method: 'POST',
//             url: '/videoStream/' + $scope.videoUrl,
//             data: {},
//             headers: {'Content-Type': 'application/json'}
//            }).then(function(response){
//                $scope.videoStream = JSON.parse(response.data);
//                console.log($scope.data,$scope.data.page);
//                
//
//            });  
          } 
        }, function errorCallback(response) {
          console.log('error' + response);
        });  
        
        });
      
    };
    $scope.movieRating = function(title,rating1,user){
        $http({
         method: 'POST',
         url: 'rating/:'+rating1+'/:'+title+'/:'+user ,
         headers: {'Content-Type': 'application/json'}
        }).then(function(response){
            console.log(response.data);
        
        });
    }
    $scope.getTimes = function (n) {
        return new Array(n);
    };

}])
.controller('HeaderController', ['$scope', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
//    
//    $scope.stateis = function(curstate) {
//       return $state.is(curstate);  
//    };
//    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;
app.directive('youtubeHelp', function($sce) {
  return {
    restrict: 'AE',
    scope: { header:'@' },
    transclude: true,
    replace: true,
    template: '<div style="padding-top:20px;" class="well"><h2>{{header}}</h2><span data-ng-transclude></span><iframe style="overflow:hidden;height:100%;width:100%;margin-top: 10px;" width="100%" height="100%" src="{{video}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope, element, attrs) {
        scope.header = attrs.header;
        attrs.$observe('video', function(value) {
          scope.video = $sce.trustAsResourceUrl(value);
        })
    }
  };
});
  app.directive('starRating',  function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  });

 
 


