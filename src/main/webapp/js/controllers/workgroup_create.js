app.controller("groupEdit",["$scope","$http","$state",function($scope,$http,$state){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	
	$scope.workgroup={};
	
	$scope.addObj={};
	$scope.addList=[];
	
	$scope.isdisabled=false;
	
//clear清空数据事件
      $scope.Clear=function(){
    	  $state.go("app.workgroup.workgroup");
	};
	
//创建事件
	$scope.Ok=function(){

		$http({
            url:url+"/workgroups",
            method: 'POST',   
            contentType: "application/json",
            data: JSON.stringify($scope.workgroup)   
        }).success(function(){
//            alert("创建成功！");
        	$scope.isdisabled=true;
            $state.go("app.workgroup.workgroup");
        }).error(function(data){
    		alert(data.message);
    	});
	};
//add模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
		$scope.isShow=!$scope.isShow;
	};
	
//add事件
	
	$scope.Add=function(){
		console.log('1')
		$scope.addObj={name:$scope.add_name,
					   value:$scope.add_attr
		}; 
		$scope.addList.push($scope.addObj);
	};	
	
		
}]);