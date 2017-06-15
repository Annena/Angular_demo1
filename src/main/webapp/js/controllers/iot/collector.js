app.controller('CollectorCtrl', ['$scope','$state','$http','$stateParams','point', function($scope,$state,$http,$stateParams,point) {
	var url = window.location.protocol +"//" + window.location.host + "/config/api";
	
	var monitorpoint = point.getpoint();
	
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 20],
        pageSize: 10,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
    	if(!data){
    		return;
    	}
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
    	var para = {};
    	para.page = page - 1;
    	para.size = pageSize;
    	para.monitorPointId = monitorpoint.id;
    	
    	$http({method:"get",
			url:url + "/da-devices?page="+para.page+"&size="+para.size+"&monitorPointId="+para.monitorPointId,
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
	    	$scope.myData = data.entity;
		}).error(function(data){
    		alert(data.message);
    	})
    };
    
    $scope.mySelections = [];
    
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    
    $scope.deleteCollector = function(row){
    	
    	if(!confirm("确认要删除么？")){
    		return;
    	}
    	
    	$http({method:"delete",
			url:url + "/da-devices/"+row.entity.id, 	 	
			contentType: "application/json",
			dataType:"JSON",
            async: false})
	    .success(function(data){
//	    	alert("删除成功。");
	    	$state.reload();
		})
	    .error(function(data){
	        alert(data.message);
	    	$state.reload();
	    });
    };
    
    $scope.create = function(){
    	$state.go('app.point.view.collector.create');
    };
    
    $scope.modify = function(row){
    	$state.go('app.point.view.collector.modify',{id:row.entity.id,name:row.entity.template});
    };
    
    $scope.gotoVariable = function(row){
    	
    	var collecor = {};
    	collecor.id = row.entity.id;
    	collecor.name = row.entity.name;
    	collecor.template=row.entity.template;
    	collecor.daDevModelId=row.entity.daDevModelId;
    	point.setcollector(collecor);
    	$state.go("app.point.variable.list");
    };
    
    $scope.gotoVariableList = '<a  class="cmd-button" title="添加采集变量" ng-click="gotoVariable(row)" >{{row.entity.name}}</a>'
    $scope.buttonCell = '<a  class="cmd-button" ng-click="deleteCollector(row)" >删除</a> <a  class="cmd-button" ng-click="modify(row)" >修改</a>';
    $scope.gridOptions = {
    	showColumnMenu:true,
        data: 'myData',
        i18n:'zh-cn',
        enableSorting : true,
        enablePaging: true,
        showFooter: true,
        multiSelect: false, 
        selectedItems: $scope.mySelections,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs:[
                    {field: "name",displayName:"名字",cellTemplate:$scope.gotoVariableList,enableCellEdit: false},
                    {field: "daDevSeriesName",displayName:"产品系列",enableCellEdit: false},
                    {field: "physicalLink",displayName:"物理链路",enableCellEdit: false},
                    {field: "daDevModelName",displayName:"型号",enableCellEdit: false},
                    {displayName:"操作",cellTemplate:$scope.buttonCell,enableCellEdit: false}
                ],
    };

   

}]);
