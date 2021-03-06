(function(angular) {
  "use strict";

    // Default environment variables
    var __env = {};
    if (window) {
        Object.assign(__env, window.__env);
    }

    angular
        .module("App", ["MapController", "MenuController", "ToolbarController",
            "AddressService", "MapService", "MovieService", "GeoLocationService", "SpinnerService", "UtilsService",
            "ngMaterial"])
        .config(config)
        .run(run)
        .constant("__env", __env);

    function config($mdThemingProvider, $mdProgressCircularProvider, $httpProvider, $logProvider, __env) {
        // Configure look & feel
        $mdThemingProvider.theme("ucine")
            .primaryPalette("blue");
        $mdThemingProvider.theme("grey")
            .primaryPalette("grey");
        $mdThemingProvider.setDefaultTheme("ucine");
        $mdProgressCircularProvider.configure({
            progressSize: 120,
            strokeWidth: 5
        });

        // Enable http caching
        $httpProvider.defaults.cache = true;
        $httpProvider.defaults.headers.get = {
            "Accept": "application/json"
        };

        // Enable/disable debug
        $logProvider.debugEnabled(__env.enableDebug);
    }

    function run($rootScope, SpinnerService) {
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        $rootScope.$on("showSpinner", function() {
            SpinnerService.showSpinner();
        });

        $rootScope.$on("hideSpinner", function() {
            SpinnerService.hideSpinner();
        });
    }
})(window.angular);
