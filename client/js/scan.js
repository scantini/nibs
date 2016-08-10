angular.module('nibs.scan', ['ionic', 'ngCordova', 'nibs.coupon'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.scan', {
                url: "/scan",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/scan.html",
                        controller: "ScanCtrl"
                    }
                }
            })

    })

    // Services
    .factory('Scan', function ($http, $rootScope) {
        return {
            scan: function(pictureId) {
                return $http.post($rootScope.server.url + '/scan');
            }
        };
    })

     //Controllers
    .controller('ScanCtrl', function ($scope, $rootScope, $ionicPopup, $cordovaBarcodeScanner, Coupon) {

        $scope.takePicture = function () {

            if (!navigator.camera) {
                $ionicPopup.alert({title: 'Sorry', content: "This device does not support Camera"});
                return;
            }



            $cordovaBarcodeScanner.scan().then(function(imageData) {

                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
                console.log(JSON.stringify(imageData));

                if(!imageData.cancelled && imageData.format == 'QR_CODE') {
                    var couponInfo = JSON.parse(imageData.text);
                    Coupon.check(couponInfo).then(function(result) {
                      console.log("result: " + JSON.stringify(result));
                      var data = result.data;
                      if(data.valid) {
                        var confirmPopup = $ionicPopup.confirm({
                         title: 'Valid coupon',
                         template: data.name + ": " + data.description
                       });
                       confirmPopup.then(function(choice) {
                         if(choice) {
                           console.log("yes");
                         } else {
                           console.log("no");
                         }
                       });
                     } else {
                       var alertPopup = $ionicPopup.confirm({
                        title: 'Invalid coupon',
                        template: data.cause
                      });
                      
                     }
                    });
                }

            }, function(error) {
                console.log("An error happened -> " + error);
            });
        };

    });
