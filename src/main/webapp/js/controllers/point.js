app.controller('pointGrid', ['$scope', '$http','$state','point', function($scope, $http,$state,point) {
	
	var url = window.location.protocol+"//"+window.location.host +"/config/api"; 
	
	var obj1={};
	var obj2={};
	
	
	$scope.gateway_arg='';
	$scope.workgroup_arg='';
	$scope.dataArg='';
	
	
	
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
    
    //格式未分组群组
    $scope.formatWorkgroup = function(data){
    	angular.forEach(data,function(item,index){
    		if(item.workgroupId==0){
    			item.workgroupName = null;
    		}
    	})
    	return data;
    }
    
    $scope.setPagingData = function(data, page, pageSize){  
//        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = $scope.formatWorkgroup(data.entity);
//        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText,urlData) {
//    	console.log("1111");
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get(url+"/monitor-points?page="+(page - 1)+"&size="+pageSize+urlData).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("X-Total-Count");//返回记录的总数
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get(url+"/monitor-points?page="+(page - 1)+"&size="+pageSize+urlData).success(function (largeLoad,status,dx) {
                	$scope.totalServerItems = dx("X-Total-Count");
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.dataArg);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText,$scope.dataArg);
        }
    }, true);
   

    

    
    //删除
    $scope.deleteIngridTenant = function(row){
        //alert(row.entity.allowance);
        var isTrue=confirm("确定删除吗？");
        if(isTrue===true){
        //	console.log(row.entity.id);//返回当前记录的id
        	$http.delete(url+"/monitor-points/"+row.entity.id)
        	.success(function(){
 //       		alert("删除成功！");
        		$state.go("app.point.point",{},{reload:true});
        	}) 
        	.error(function(data){
        	 alert(data.message);
        	});
        }
    };
    
    
    
    //修改
    $scope.updataIngridTenant = function(row){
//    	console.log(row.entity.id);
    	$state.go('app.point.modifypoint',{modify_id:row.entity.id}); 
    }; 
    
    //详细信息
    $scope.getRowName = function(row){
  		//alert(row.entity.name);
    	point.setpoint(row.entity);
  		$state.go('app.point.view.collector.list');
  	};
    //下发
  	$scope.issued = function(row){
  		$http({
  			url:"/api/monitor-points/"+row.entity.id+"/apply",
  			method:"put"
  		}).success(function(){
  			if(row.entity.gatewayId != ""){
  				alert("请先指定监控点所在网关");
  				$state.go("app.point.point",{},{reload:true});
  			}else{
  				alert("下发成功");
  			}
  		}).error(function(data){
       	 alert(data.message);
       	});
  	}
    
  //筛选网关类型
    $scope.init = function(){
    	$http.get(url+"/gateways")
		.success(function(data){
//			console.log(data);
			obj1.name="未分组";
			obj1.id=0;
		    data.entity.unshift(obj1);
			$scope.gatewaytypes = data.entity;			
			$http.get(url+"/workgroups")
			.success(function(data){
				 obj2.name='未分组'	;
	                obj2.id=0;
//				console.log(data);
	                data.entity.unshift(obj2);
				$scope.workgroups = data.entity;				
			});
    });
  };   
 $scope.init();
 
 $scope.search_gateway_id="";
 $scope.search_workgroup_id="";
 //筛选中的下拉以及网关筛选
 $scope.selectGateway=function(data){
	 var value=data[0].name;
	 $scope.gateway_search=value;
	 $scope.search_gateway_id=data[0].id;
	 
	 $scope.dataArg='&gatewayId='+$scope.search_gateway_id;
	 if($scope.search_workgroup_id !=undefined && $scope.search_workgroup_id !=""){
		 $scope.dataArg += "&workgroupId=" + $scope.search_workgroup_id;
	 }
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
 
 $scope.selectWorkgroup=function(data){
	 var gateway=$scope.dataArg;
	 var value=data[0].name;
	 $scope.workgroup_search=value;
	 $scope.search_workgroup_id=data[0].id;
	 

	 $scope.dataArg ='&workgroupId='+$scope.search_workgroup_id;
	 if($scope.search_gateway_id !=undefined && $scope.search_gateway_id !=""){
		 $scope.dataArg += "&gatewayId=" + $scope.search_gateway_id;
	 }
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
//清空筛选条件
 $scope.clear=function(){
	 $scope.workgroup_search='';
	 $scope.gateway_search='';
	 
	 $scope.search_gateway_id='';
	 $scope.search_workgroup_id='';
	 
	 $scope.dataArg='';
	 
	 $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,undefined,$scope.dataArg);
 };
    
   
 	$scope.detailsPointReport=function(row){
 		$state.go('app.point.report.policy',{id:row.entity.id});
 	};
 
 
 	$scope.report_policy = '<a class="cmd-button" ng-click="detailsPointReport(row)" >策略详情</a>';
    $scope.nameTemplate = '<div class="ngCellText">'+'<a  class="cmd-button " title="添加采集设备" ng-click="getRowName(row)" >{{row.entity.name}}</a>'+'</div>';
    $scope.revise='<div class="ngCellText">'+'<a  class="cmd-button " ng-click="deleteIngridTenant(row)" >删除</a>'+
    '<a  class="cmd-button " ng-click="updataIngridTenant(row)" >修改</a>'+'<a class="cmd-button" ng-click="issued(row)">下发</a>'+'</div>';
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
            {displayName:"监控点名称",cellTemplate:$scope.nameTemplate,enableCellEdit: false,width:'10%'},
            {field: "gatewayName",displayName:"网关",enableCellEdit: false,width:'15%'},
            {field: "workgroupName",displayName:"群组 ",enableCellEdit: false,width:'25%'},
            {field: "description",displayName:"描述",enableCellEdit: false,width:'25%'}, 
//            {displayName:"上报策略",cellTemplate:$scope.report_policy,enableCellEdit:false,width:'10%'},
            {displayName:'操作',cellTemplate:$scope.revise,enableCellEdit: false,width:"20%",class:'ngCellText'}
        ]
    };
}]);