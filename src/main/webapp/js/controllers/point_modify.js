app.controller("pointModify",["$state","$scope","$http","$stateParams",function($state,$scope,$http,$stateParams){
	var url = window.location.protocol+"//"+window.location.host +"/config/api" ;
	//路由传过来的ID、相关消息
	var modify_id=$stateParams.modify_id;     //获取id
	
	$scope.point = {};
	
	$scope.workgroups = [];
	$scope.gatewaytypes = [];
	
	$scope.workgroup = {};
	$scope.gatewaytype={};
	
	$scope.addObj={};
	$scope.addList=[];
	
	$scope.addNull={};
	
	$scope.isdisabled=false;
	
	//lua事件
	$scope.luastrShow=function(){
		if($scope.point.enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
		}
	}
	
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
//		for(var i=0; i<$scope.workgroups.length;i++){
//			var workgroupTmp = $scope.workgroups[i];
//			if(workgroupTmp.id == id){
//				$scope.workgroup = workgroupTmp;
//				break;
//			}
//		}
//	};

	
	$scope.setGateWayById = function(id){
		var keepGoing = true;
		angular.forEach($scope.gateways,function(data){
			if(keepGoing===true){
			 if(data.id===id){
				$scope.gateway=data;
				//break;
				keepGoing=false;
			   }
			}
			
		});
//		console.log($scope.gatewaytype);
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
	
	
	
	$scope.getThePoint = function(){
		var header = {'appId':'001'};
		$http.get(url+"/monitor-points/"+modify_id,{headers:header})
		.success(function(data){
			//默认选中传过来的值
			$scope.point = data.entity.monitorPoint;
			$scope.addList=data.entity.attrs;
			$scope.setWorkGroupById($scope.point.workgroupId);
			$scope.setGateWayById($scope.point.gatewayId);
			$scope.luastrShow();
		}).error(function(data){
           alert(data.message);
        });
	};

//取下拉框中的所以信息以及调用	
	$scope.initPage = function(){
		$scope.addNull.id=null;
		$scope.addNull.name="请选择";
		$http.get(url+"/workgroups")
		.success(function(data){
			$scope.workgroups = data.entity;
			$scope.workgroups.unshift($scope.addNull);
			$http.get(url+"/gateways")
			.success(function(data){
//				console.log(data);
				$scope.gateways = data.entity;
				$scope.gateways.unshift($scope.addNull);
				$scope.getThePoint();
			});
		});
	};

	
//add模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
//		console.log('q')
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
		angular.forEach($scope.attrs,function(data){			
			if(data.name===$scope.addObj.name){
				blag=false;
			}
		});
//		console.log(blag)
		if($scope.addList.length>0 || $scope.attrs.length>0){
			angular.forEach($scope.addList,function(data){
				if(data.name===$scope.addObj.name){
					blag=false;
				}
				
			});
			if(blag!=false ){
				$scope.addList.push($scope.addObj);
			}else{
				alert("属性名重复，请重样输入！")
			}
		}else{
			$scope.addList.push($scope.addObj);
		}		
	};
//删除事件
	$scope.Remove=function(index){
//       console.log(index);
		$scope.addList.splice(index,1); 
		//删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
	};
	
	
//监听网关与群组绑定的验证
	$scope.flag=true;
	$scope.Change=function(){
		if($scope.gateway.id!=null){	
			$scope.flag=true;
			var keepGoing = true;
//			console.log($scope.gateway)
			angular.forEach($scope.workgroups,function(data){
				if(keepGoing===true){
					if(data.id===$scope.gateway.workgroupId){
						$scope.workgroup=data;
						keepGoing=false;
					}
				}
			})
//			console.log($scope.workgroup.id)
		}else{
			$scope.flag=false;			
		}
	};	
	
	
//确认修改按钮	
	$scope.OK = function(){		
		var data={};

		if($scope.gateway != undefined){
			$scope.point.gatewayId=$scope.gateway.id;
		}
		
        if($scope.workgroup != undefined){
        	$scope.point.workgroupId=$scope.workgroup.id;
        }
		
		data.monitorPoint=$scope.point;
		data.attrs=$scope.addList;
		console.log(data)
		$http({method:"put",
			url:url + "/monitor-points",
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'001'},
            data:JSON.stringify(data),
            async: false})
	    .success(function(data){
//	          alert("修改成功!")
	    	$scope.isdisabled=true;
	    	$state.go("app.point.point");
		}).error(function(data){
           alert(data.message);
           return;
        });

	};

	
//取消修改按钮
	$scope.Clear=function(){
		$state.go('app.point.point');
	};
	$scope.initPage();
}])