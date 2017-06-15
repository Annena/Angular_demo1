app.controller("Edit",["$scope","$http","$state",function($scope,$http,$state){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	$scope.gateway={};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	
	$scope.addList=[];
	$scope.addObj={};

	$scope.isdisabled = false;
	
//判断所输入的IP地址
	$scope.gatewayIp = function(){
		var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test($scope.gateway.ip)){
        	$scope.isIpShow=false;
        }else if($scope.gateway.ip === undefined || $scope.gateway.ip === ""){
        	$scope.isIpShow=false;
        }else{
        	$scope.isIpShow=true;
        }
	};
//判断所输入的Mac地址	
	$scope.getewayMac = function(){
		var strRegex=new RegExp("^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$");
        if(strRegex.test($scope.gateway.mac)){
        	$scope.isMacShow=false;
        }else if($scope.gateway.mac === undefined || $scope.gateway.mac === ""){
        	$scope.isMacShow=false;
        }else{
        	$scope.isMacShow=true;
        }
	};
	
	
//获取数据下拉框的id
		$scope.initPage = function(){
			$http.get(url+"/workgroups")
			.success(function(data){
				//console.log(data);
				$scope.workgroups = data.entity;
				
				$http.get(url+"/gateway-types")
				.success(function(data){
					//console.log(data);
					$scope.gatewaytypes = data.entity;
				});
			});
		};
		$scope.initPage();
	
//clear返回数据事件
      $scope.Clear=function(){
    	 $state.go('app.gateway.gateway');
	};
//	
	
	
	
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
			applyToGateway:$scope.applyToGateway,
			priority:0
		};
		if($scope.addList.length>0){
			angular.forEach($scope.addList,function(data){
				if(data.name===$scope.addObj.name){
					blag=false;
				}
			});
			if(blag!=false){
				$scope.addList.push($scope.addObj);
			}else{
				alert("属性名重复，请重样输入！");
			}
		}else{
			$scope.addList.push($scope.addObj);
		}
		
		
	};
//删除事件
	$scope.Remove=function(index){
//		console.log(index);
		$scope.addList.splice(index,1); 
		//删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
	};
	
	
	

//创建事件
	$scope.Ok=function(){
		
//		console.log('1111');
     
//		console.log($scope.gatewaytype.name);
//		console.log($scope.workgroup.name);
		var data={};
		 
		$scope.gateway.workgroupId = $scope.workgroup.id==undefined?0:$scope.workgroup.id;
		$scope.gateway.gatewayTypeId = $scope.gatewaytype.id;
		$scope.gateway.priority=0;
		$scope.gateway.status="INIT";
		
		data.gateway=$scope.gateway;
		data.attrs=$scope.addList;
		
		var data=JSON.stringify(data);
//		console.log(data);
		$http({
            url:url+"/gateways",
            contentType: "application/json",
			dataType:"JSON",
            method: 'POST',
            headers:{'appId':'001'},
            data: data      
        }).success(function(){
        	$scope.isdisabled = true;
//           alert("创建成功！！！");
        	$state.go("app.gateway.gateway");
            //$scope.Clear();
        }).error(function(data){
    		alert(data.message);
    	});
	};
	
}]);