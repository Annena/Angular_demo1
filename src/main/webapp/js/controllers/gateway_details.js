app.controller("detailsModify",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	//路由传过来的ID、相关消息
	var details_id=$stateParams.details_id;     //获取id
	console.log(details_id)
	$scope.gateway = {};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
//workgroup	
	$scope.setWorkGroupById = function(id){
		var keepGoing = true;
		angular.forEach($scope.workgroups,function(data){
			if(keepGoing===true){
			 if(data.id===id){
				$scope.workgroup=data;
				//break;
				keepGoing=false;
			   }
			}
		});
	};


//gateway
	$scope.setGateWayTypeById = function(id){
		var keepGoing = true;
		angular.forEach($scope.gatewaytypes,function(data){
			if(keepGoing===true){
			 if(data.id == id){
				$scope.gatewaytype=data;
				//break;
				keepGoing=false;
			   }
			}
		});
	};
	
	
//data	
	$scope.getTheGateway = function(){
		$http.get(url+"/gateways/"+details_id)
		.success(function(data){						
			//默认选中传过来的值
//			console.log(data);
			$scope.gateway = data.entity.gateway;
			$scope.attrs=data.entity.attrs;
//			console.log($scope.gateway);
//			console.log($scope.attrs);
			$scope.setWorkGroupById($scope.gateway.workgroupId);
			$scope.setGateWayTypeById($scope.gateway.gatewayTypeId);
//			console.log(data.gatewayTypeId);
		})
		.error(function(data){
           alert(data.message);
        });
	};
	
	
		
	
	

//取下拉框中的所以信息以及调用	
	$scope.initPage = function(){
		$http.get(url+"/workgroups")
		.success(function(data){
//			console.log(data);
			$scope.workgroups = data.entity;
			
			$http.get(url+"/gateway-types")
			.success(function(data){
//				console.log(data);
				$scope.gatewaytypes = data.entity;				
				$scope.getTheGateway();
			}).error(function(data){
				alert(data.message);
			});
		});
	};
	$scope.initPage();
	
	//返回事件
	$scope.Clear=function(){
		$state.go('app.gateway.gateway');
	};
	$scope.Ok=function(){
		$state.go('app.gateway.modifygate',{modify_id:details_id});
	};
}]);