app.controller("pointEdit",["$scope","$http","$state",function($scope,$http,$state){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	
	$scope.point={};

	$scope.point.enableCustomReport = false;
	$scope.point.enableLua = false;
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	$scope.gatewaytype.id=null;
	$scope.gatewaytype.name='';
	$scope.workgroup.name='';
	$scope.workgroup.id=null;
	$scope.description='';
	
	$scope.addObj={};
	$scope.addList=[];
	$scope.luastrshow=false;
	
	$scope.workgroupData=[];
	
	$scope.isdisabled=false;
	
//获取数据下拉框的id
		$scope.initPage = function(){
			$http.get(url+"/workgroups")
			.success(function(data){
//				console.log(data);
				$scope.workgroupData.push(data.entity);
				$scope.workgroups = data.entity;				
				$http.get(url+"/gateways")
				.success(function(data){
//					console.log(data);
					$scope.gatewaytypes = data.entity;
				}).error(function(data){
					alert(data.message);
				});
			});
		};
		$scope.initPage();
		//
//	console.log($scope.workgroupData);
//clear返回数据事件
      $scope.Clear=function(){
    	 $state.go('app.point.point');
	};
	
//show模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
		$scope.isShow=!$scope.isShow;
	};
	
//add事件
	
	$scope.Add=function(){
		var blag=true;
		$scope.addObj={
			name:$scope.add_name,
			value:$scope.add_attr,
			priority:0,
			appId:"111",
			applyToGateway:$scope.applyToGateway
		}
		if($scope.addList.length>0){
			angular.forEach($scope.addList,function(data){
				if(data.name===$scope.addObj.name){
					blag=false;
				}				
			});
			if(blag!=false){
				$scope.addList.push($scope.addObj);
			}else{
				alert("属性名重复，请重新输入！")
			}
		}else{
			$scope.addList.push($scope.addObj);
		}
		console.log($scope.addList)
	};
//删除事件
	$scope.Remove=function(index){
//       console.log(index);
		$scope.addList.splice(index,1); 
		//删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
	};
//监听网关与群组绑定的验证
$scope.Change=function(){
//	console.log("1111");
	if($scope.gatewaytype!=null){
		$scope.flag=true;
		var keepGoing = true;
		angular.forEach($scope.workgroups,function(data){
			if(keepGoing===true){
				if(data.id===$scope.gatewaytype.workgroupId){
					$scope.workgroup=data;
					keepGoing=false; 
				}
			}
			
		});	
	}else{
		$scope.flag=false;
		$scope.workgroups=$scope.workgroupData[0];
	}
};
	// showLua
	$scope.luastrShow=function(){
		if($scope.point.enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
		}
	}
	

//创建事件
	$scope.Ok=function(){
	
		$scope.point.gatewayId=$scope.gatewaytype.id;
		$scope.point.workgroupId = $scope.workgroup.id == null?0:$scope.workgroup.id;
				
		var data={};
		
		data.monitorPoint=$scope.point;
		data.attrs=$scope.addList;
		console.log(data)
		data=JSON.stringify(data);
		
		$http({
            url:url+"/monitor-points",
            method: 'POST',
            headers:{'appId':'001'},
            data: data      
        }).success(function(){
//           alert("创建成功！！！");
        	$scope.isdisabled=true;
        	$state.go("app.point.point");
            //$scope.Clear();
        }).error(function(data){
           alert(data.message);
           
        });
	};
	
}]);