app.controller('VariableCreateCtrl', ['$scope','$state','$http','point', function($scope,$state,$http,point) {
	
    $scope.variable = {};
    $scope.isdisableok = false;
    
    $scope.addList=[];
	$scope.addObj={};
    
    $scope.className=true;
    $scope.luastrshow=false;
    
    $scope.isdisabled = false;
    
	var url = window.location.protocol +"//" + window.location.host + "/config/api";
    //获得对应的监控点id以及名称
    var monitorpoint = point.getpoint();
    $scope.variable.monitorPointId = monitorpoint.id;
    $scope.variable.monitorPointName = monitorpoint.name;
   //获得对就的监控点中的变量名称以及id
    var collector = point.getcollector();
    $scope.variable.dataAcquisitionDeviceId = collector.id;
    $scope.variable.dataAcquisitionDeviceName = collector.name;
    $scope.variable.template=collector.template;
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
    
    
    
    
    //调用
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
    
    $scope.dataBits=$scope.getmethod("/da-variables/data-bits");
    $scope.valueTypes=$scope.getmethod("/da-variables/value-types");
    $scope.byteOrders=$scope.getmethod("/da-variables/byte-orders");
    $scope.daAddrCfgTypes=$scope.getmethod("/da-variables/com/addr-cfg-types");
    $scope.cmdStrTypes=$scope.getmethod("/da-variables/com/cmd-str-types");
    $scope.funcCodes=$scope.getmethod("/da-variables/com/func-codes");
    $scope.dataTypes=$scope.getmethod("/da-variables/data-types");
    $scope.readWriteTypes=$scope.getmethod("/da-variables/read-write-types");
    $scope.addrMaps=$scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/daaddrmaps")
    $scope.cmdstrings=$scope.getmethod("/da-variables/"+$scope.variable.daDevModelId+"/dacmdstrings")
    
   //实际地址
    $scope.startAddr=function(){
    	$scope.variable.absoluteStartAddr=$scope.addrMap.addrPosOffset + $scope.variable.relativeStartAddr;
    };
    $scope.endAddr=function(){
    	$scope.variable.absoluteEndAddr = $scope.addrMap.addrMaxPos + $scope.variable.relativeEndAddr;
    };
    
   //判断地址设备类型 
    $scope.selectAddrCfgType=function(){
    	if($scope.variable.daAddrCfgType == 0 || $scope.variable.daAddrCfgType== undefined){
    		$scope.className=true;
    	}else{
    		$scope.className=false;
    	}
    }    
    $scope.selectAddrCfgType();
    
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
    }
    //输入字符串类型的正则验证
    $scope.verifyCmdString = function(data){
    	if($scope.variable.cmdStr==undefined){
    		$scope.variable.cmdStr = "";
    	}
    	var reg = null;
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
    
    $scope.cancel = function(){
    	$state.go('app.point.variable.list');
    }
    
    $scope.ok = function(){
//		if(!$scope.isCmdString || !confirm("确认要添加么？")){
//    		return;
//    	}
    	var data={};
    	$scope.isdisableok = true;
    	if($scope.variable.daAddrCfgType == 0 && $scope.addrMap != null){
    		$scope.variable.daAddrMapId=$scope.addrMap.id;
        	$scope.variable.daAddrMapName=$scope.addrMap.name;
    	}
    	
    	
    	data.dataAcquisitionVariable=$scope.variable;
    	data.attrs=$scope.addList;
    	
    	$http({method:"post",
			url:url + "/da-variables",
			contentType: "application/json",
			dataType:"JSON",
			data:JSON.stringify(data),
			 headers:{'appId':'001'},
            async: false})
	    .success(function(data){
//	    	alert("添加成功！");
	    	$scope.isdisabled = true;
	    	$state.go('app.point.variable.list');
//	    	console.log($scope.variable);
		})
	    .error(function(data){
	        alert(data.message);
	        $scope.isdisableok = false;
	    });
    };
    
}]);
