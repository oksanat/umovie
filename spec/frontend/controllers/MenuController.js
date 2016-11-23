describe("MenuController", function () {
    var $rootScope,
        $scope,
        $controller,
        $sideController,
        $mdSidenav,
        $mdDialog,
        $q,
        mapService,
        movieService,
        geoLocationService,
        sideNavCloseMock = jasmine.createSpy(),
        sideNavIsOpenMock = jasmine.createSpy(),
        sideNavToggleMock = jasmine.createSpy();


    beforeEach(function() {
        module("MenuController");
    });

    describe("MenuController", function() {
        beforeEach(function() {
            $mdSidenav = jasmine.createSpy().and.callFake(function() {
                return {
                    close: sideNavCloseMock,
                    isOpen: sideNavIsOpenMock,
                    toggle: sideNavToggleMock
                };
            });

            inject(function($injector) {
                $rootScope = $injector.get("$rootScope");
                $scope = $rootScope.$new();
                $controller = $injector.get("$controller")("MenuController", {
                    $scope: $scope,
                    $mdSidenav: $mdSidenav
                });
            });
        });

        it("Should close sideNav", function () {
            $scope.close();
            expect(sideNavCloseMock).toHaveBeenCalled();
        });

        it("Should call sideNave isOpen", function () {
            $scope.isOpen();
            expect(sideNavIsOpenMock).toHaveBeenCalled();
        });

        it("Should call toggle on toggleSideNav", function () {
            $scope.toggleSidenav();
            expect(sideNavToggleMock).toHaveBeenCalled();
        });
    });

    describe("SideController", function() {
        beforeEach(function() {
            inject(function($injector) {
                $rootScope = $injector.get("$rootScope");
                $scope = $rootScope.$new();
                $q = $injector.get("$q");
                $mdDialog = $injector.get("$mdDialog");
                mapService = $injector.get("MapService");
                movieService = $injector.get("MovieService");
                geoLocationService = $injector.get("GeoLocationService");
                $sideController = $injector.get("$controller")("SideController", {
                    $scope: $scope,
                    GeoLocationService: geoLocationService
                });
            });
        });

        it("Should emit closeSideNav and showSpinner events when findNearMe is called", function () {
            spyOn($scope, "$emit");
            spyOn($rootScope, "$emit");
            $scope.findNearMe();
            expect($scope.$emit).toHaveBeenCalledWith("closeSideNav");
            expect($rootScope.$emit).toHaveBeenCalledWith("showSpinner");
        });

        it("Should obtain position, refresh map and finally emit hideSpinner event", function () {
            spyOn($rootScope, "$emit");
            spyOn(geoLocationService, "getCurrentLocation").and.callFake(function() {
                var deferred = $q.defer();
                deferred.resolve({
                    address: "Lewisham"
                });
                return deferred.promise;
            });

            spyOn(mapService, "refresh").and.callFake(function() {
                return true;
            });

            $scope.findNearMe();
            $scope.$digest();
            expect(geoLocationService.getCurrentLocation).toHaveBeenCalled();
            expect(mapService.refresh).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith("hideSpinner");
        });

        it("Should show alert and not refresh map if failed to obtain position", function () {
            spyOn($rootScope, "$emit");
            spyOn(geoLocationService, "getCurrentLocation").and.callFake(function() {
                var deferred = $q.defer();
                deferred.reject("Error");
                return deferred.promise;
            });
            $mdDialog.show = jasmine.createSpy().and.callFake(function() {
                return true;
            });

            spyOn(mapService, "refresh");
            $scope.findNearMe();
            $scope.$digest();
            expect(geoLocationService.getCurrentLocation).toHaveBeenCalled();
            expect(mapService.refresh).not.toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith("hideSpinner");
        });
    });
});