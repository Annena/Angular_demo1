app.controller('groupGrid', ['$scope', '$http','$state', function($scope, $http,$state) {
	
	var url = window.location.protocol+"//"+window.location.host +"/config/api"; 
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [15, 30, 50],
        pageSize: 15,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
//        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = data.entity;
//        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
//    	console.log("1111");
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get(url+"/workgroups?page="+(page - 1)+"&size="+pageSize).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("X-Total-Count");//返回记录的总数
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get(url+"/workgroups?page="+(page - 1)+"&size="+pageSize).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("X-Total-Count");
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
   
    

    
    //删除
    $scope.deleteIngridTenant = function(row){
        //alert(row.entity.allowance);
        var isTrue=confirm("确定删除吗？");
        if(isTrue===true){
        	console.log(row.entity.id);//返回当前记录的id
        	$http.delete(url+"/workgroups/"+row.entity.id)
        	.success(function(){
//        		alert("删除成功！");
        		$state.go("app.workgroup.workgroup",{},{reload:true});
        	}).error(function(data){
        		alert(data.message);
        	});
        }
    };
    
    
    
    //修改
    $scope.updataIngridTenant = function(row){
    	$state.go('app.workgroup.modifygroup',{modify_id:row.entity.id}); 
    };
    //详细信息
    $scope.getRowName=function(row){
    	$state.go('app.workgroup.detailsgroup',{details_id:row.entity.id});
    };
    
    
    
    $scope.nameTemplate='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="getRowName(row)" >{{row.entity.name}}</a>'+'</div>';
    $scope.revise='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteIngridTenant(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="updataIngridTenant(row)" >修改</a>'+'</div>';
    $scope.gridOptions = {
        showColumnMenu:true,
        i18n:'zh-cn',
        data: 'myData',
        enableSorting : true,//是否支持排序(列)
        enablePaging: true,
        showFooter: true,
        multiSelect: false,
        groups:["gate_name"],
        groupsCollapsedByDefault:false,
        selectedItems: $scope.mySelections,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        columnDefs:[
         //   {field:"id",displayName:"群组ID",enableCellEdit:false},
            {displayName:"群组名称",cellTemplate:$scope.nameTemplate,enableCellEdit: false,width:'28%'},
            {field: "description",displayName:"描述",enableCellEdit: false,width:'40%'}, 
            {displayName:'操作',cellTemplate:$scope.revise,enableCellEdit: false,width:"30%",class:'ngCellText'}
        ]
    };
}]);