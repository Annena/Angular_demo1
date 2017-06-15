app.controller("Modify",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	//路由传过来的ID、相关消息
	var modify_id=$stateParams.modify_id;     //获取id
	
	$scope.gateway = {};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	$scope.addList=[];
	$scope.addObj={};
	
	$scope.isdisabled=false;
	
	//判断所输入的IP地址
	$scope.gatewayIp = function(){
		var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test($scope.gateway.ip)){
        	$scope.isIpShow=false;
        }else if($scope.gateway.ip == undefined || $scope.gateway.ip == ""){
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
        }else if($scope.gateway.mac == undefined || $scope.gateway.mac == ""){
        	$scope.isMacShow=false;
        }else{
        	$scope.isMacShow=true;
        }
	};
	
	
	
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
//		console.log($scope.workgroup);
//		for(var i=0; i<$scope.workgroups.length;i++){
//			var workgroupTmp = $scope.workgroups[i];
//			if(workgroupTmp.id == id){
//				$scope.workgroup = workgroupTmp;
//				break;
//			}
//		}
//	};

	
	$scope.setGateWayTypeById = function(id){
		var keepGoing = true;
		angular.forEach($scope.gatewaytypes,function(data){
			if(keepGoing===true){
			 if(data.id===id){
				$scope.gatewaytype=data;
				//break;
				keepGoing=false;
			   }
			}
		});
	};
//	$scope.setGateWayTypeById = function(id){
//		for(var i=0; i<$scope.gatewaytypes.length;i++){
//			var gatewaytypeTmp = $scope.gatewaytypes[i];
//			if(gatewaytypeTmp.id == id){
//				$scope.gatewaytype = gatewaytypeTmp;
//				break;
//			}
//		}
//	};
	
//取网关的对应值	
	
	$scope.getTheGateway = function(){
		$http.get(url+"/gateways/"+modify_id)
		.success(function(data){
			//默认选中传过来的值
//			console.log(data);
			$scope.gateway = data.entity.gateway;
			$scope.addList=data.entity.attrs;
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
			});
		});
	};
	$scope.initPage();
//show模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
		$scope.isShow=!$scope.isShow;
	};
	
//add事件
	$scope.Add=function(){
		var keepGoing=true;
		var blag=true;
		$scope.addObj={
			name:$scope.add_name,
			value:$scope.add_attr,
			applyToGateway:$scope.applyToGateway,
			priority:0
		};
//		angular.forEach($scope.addList,function(data){			
//			if(data.name===$scope.addObj.name){
//				blag=false;
//			}
//		});
		if($scope.addList.length>0){
			angular.forEach($scope.addList,function(data){
				if(data.name===$scope.addObj.name){
					blag=false;
				}
			});
			if(blag!=false ){
				$scope.addList.push($scope.addObj);
			}else{
				alert("属性名重复，请重样输入！");
			}
		}else{
			$scope.addList.push($scope.addObj);
		}
		
		
	};

//删除动态添加属性
	$scope.Remove=function(index){
		$scope.addList.splice(index,1);
	};
	
	
	
//确认修改按钮	
	$scope.OK = function(){		
		
		$scope.gateway.workgroupId = $scope.workgroup.id;
		$scope.gateway.gatewayTypeId = $scope.gatewaytype.id;
		
		var data={};
		//新添加的属性和已有属性的合并
		data.gateway=$scope.gateway;
		data.attrs=$scope.addList;
		console.log(JSON.stringify(data));
		$http({method:"put",
			url:url + "/gateways",
			contentType: "application/json",
			dataType:"JSON",
            data:JSON.stringify(data),
            async: false})
	    .success(function(data){
//	          alert("修改成功!");
	    	$scope.isdisabled = true;
	    	$state.go("app.gateway.gateway");
		})
	    .error(function(data){
	        alert(data.message);
	        return;
	    });

	};

	
//取消修改按钮
	$scope.Clear=function(){
		$state.go('app.gateway.gateway');
	};
	
}]);