app.controller('VariableModifyCtrl', ['$scope','$state','$http','point','$stateParams', function($scope,$state,$http,point,$stateParams) {
	
    $scope.variable = {};
    $scope.isdisableok = false;
    $scope.className = true;
    
    $scope.isdisabled = false;
    $scope.luastrshow=false;
    
    $scope.addList=[];
	$scope.addObj={};
    
	var url = window.location.protocol +"//" + window.location.host + "/config/api";
    
	$scope.id = $stateParams.id;
    var monitorpoint = point.getpoint();
    $scope.variable.monitorPointId = monitorpoint.id;
    $scope.variable.monitorPointName = monitorpoint.name;
    
    var collector = point.getcollector();
    $scope.variable.dataAcquisitionDeviceId = collector.id;
    $scope.variable.dataAcquisitionDeviceName = collector.name; 	
    $scope.variable.daDevModelId=collector.daDevModelId;
    $scope.isCmdString = true;
    
    
    
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

//判断是否运行脚本
    $scope.luastrShow=function(){
    	if($scope.variable.enableLua == true){
    		$scope.luastrshow=true;
    	}else{
    		$scope.luastrshow=false;
    	}
    }    
    $scope.selectCmdString = function(data){
    	$scope.variable.cmdStr = data[0].cmdStr;	
    };	
	
//实际地址
    $scope.startAddr=function(){
    	$scope.variable.absoluteStartAddr=$scope.addrMap.addrPosOffset + $scope.variable.relativeStartAddr;
    };
    $scope.endAddr=function(){
    	$scope.variable.absoluteEndAddr = $scope.addrMap.addrMaxPos + $scope.variable.relativeEndAddr;
    };	
	
	
    $scope.getmethod = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
    	}).error(function(data){
    		alert(data.message);
    	})   	
    	return tmpdata;		
    };
    
    $scope.selectAddrCfgType=function(){
    	if($scope.variable.daAddrCfgType == 0 || $scope.variable.daAddrCfgType == undefined){
    		$scope.className=true;
    	}else{
    		$scope.className=false;
    	}
    }
    $scope.getTheDev = function(){
    	$http({method:"get",
			url:url + "/da-variables/"+$scope.id,
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'001'},
            async: false})
	    .success(function(data){
	    	$scope.variable = data.entity.dataAcquisitionVariable;
	    	$scope.variable.relativeStartAddr = $scope.variable.relativeStartAddr*1;
	    	$scope.variable.relativeEndAddr = $scope.variable.relativeEndAddr*1;
	    	$scope.addList=data.entity.attrs;
	        $scope.selectAddrCfgType();
	        $scope.addrMap($scope.variable.daAddrMapName)
	    	$scope.endAddr();
	        $scope.luastrShow();
		})
	    .error(function(data){
	        alert(data.message);
	    	//$state.go('app.point.variable.list');
	    });
    };
    
//判断地址区块号
    $scope.addrMap=function(name){
    	var deep=true;
    	angular.forEach($scope.addrMaps,function(data){
    		if(deep == true){
    			if(name == data.name){
        			$scope.addrMap=data;
        			deep=false;
        		}
    		}
    		
    	});
    }
    
    //获取数据类型
    $scope.dataTypes = $scope.getmethod("/da-variables/data-types/");
    //获取值类型
    $scope.valueTypes = $scope.getmethod("/da-variables/value-types/");
    //获取小数位
    $scope.dataBits = $scope.getmethod("/da-variables/data-bits/");
    //获取读写模式
    $scope.readWriteTypes = $scope.getmethod("/da-variables/read-write-types/");
    //获取字节顺序
    $scope.byteOrders = $scope.getmethod("/da-variables/byte-orders/");
    //获取地址设备类型
    $scope.daAddrCfgTypes = $scope.getmethod("/da-variables/com/addr-cfg-types/");
    //获取发送命令串类型
    $scope.cmdStrTypes = $scope.getmethod("/da-variables/com/cmd-str-types/");
    //获取功能码
    $scope.funcCodes = $scope.getmethod("/da-variables/tcp/func-codes/");
    //获取地址段区块号
    $scope.addrMaps = $scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/daaddrmaps");
    //获取发送命令串
    $scope.cmdstrings=$scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/dacmdstrings");
    $scope.getTheDev();
//    $scope.string = $scope.cmdstrings[0].cmdStr;
//取消    
    $scope.cancel = function(){
    	$state.go('app.point.variable.list');
    }
    
//输入字符串类型的正则验证
    $scope.verifyCmdString = function(data){
    	var reg = "";
    	if($scope.variable.cmdStrType==0){
    		//0是十六进制
    		reg = new RegExp("^[0-9a-fA-F]*$");
    	}else if($scope.variable.cmdStrType==1){
    		//1是ascii码
    		reg = new RegExp("^[\x00-\xff]*$");
    	}
    	$scope.isCmdString = reg.test($scope.variable.cmdStr)?true:false;
    	$scope.change = false;
    }
    
//修改
    $scope.ok = function(){
    	var data={};
    	if($scope.variable.daAddrCfgType == 0 && $scope.addrMap != null){
    		$scope.variable.daAddrMapId=$scope.addrMap.id;
        	$scope.variable.daAddrMapName=$scope.addrMap.name;
    	}
    	$scope.isdisableok = true;
    	
    	data.attrs=$scope.addList;
    	data.dataAcquisitionVariable=$scope.variable;
    	
    	$http({
    		method:"put",
			url:url + "/da-variables/",
			contentType: "application/json",
			dataType:"JSON",
			headers:{'appId':'001'},
			data:JSON.stringify(data),
            async: false
            })
	    .success(function(data){
//	    	alert("修改成功");
	    	$scope.isdisabled = true;
	    	$state.go('app.point.variable.list');
		})
	    .error(function(data){
	    	$scope.isdisableok = false;
	        alert(data.message);
	    });
    };
}]);
