app.controller('CollectorModifyCtrl', ['$scope','$state','$http','point','$stateParams', function($scope,$state,$http,point,$stateParams) {
	
    $scope.dev = {};
    $scope.isdisableok = false;
	var url = window.location.protocol +"//" + window.location.host + "/config/api";
    
	$scope.id = $stateParams.id;
	$scope.template=$stateParams.name;
	
    var monitorpoint = point.getpoint();
    $scope.dev.monitorPointId = monitorpoint.id;
    $scope.dev.monitorPointName = monitorpoint.name;
    
    $scope.tcpShow=false;
    $scope.opcShow=false;
    $scope.comShow=false;
   
	$scope.addObj={};
    
	$scope.isdisabled = false;
	
//show模块显示
	$scope.isShow=false;
	$scope.showAddAttr=function(){
		$scope.isShow=!$scope.isShow;
	};
	
//add事件
	$scope.Add=function(addList){
		console.log(addList);
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
		if(addList.length>0){
			angular.forEach(addList,function(data){
				if(data.name===$scope.addObj.name){
					blag=false;
				}
			});
			if(blag!=false ){
				addList.push($scope.addObj);
			}else{
				alert("属性名重复，请重样输入！");
			}
		}else{
			addList.push($scope.addObj);
		}
		return addList;
	};

//删除动态添加属性
	$scope.Remove=function(index,addList){
		addList.splice(index,1);
	};
    
	$scope.luastrShow=function(type){
		if($scope[type].enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
		}
	}
    
    //获得对应的接口
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
    
   //获得数据 
    $scope.getdata = function(methodurl){
    	var tmpdata = [];
    	$.ajax({
        	method: "GET",
        	url:url+methodurl,
        	async: false
    	})
    	.success(function(data){
    		tmpdata =  data.entity;
//    		console.log(tmpdata);
    	}).error(function(data){
            alert(data.message);
            $state.go('app.monitorpoint.collector');
        })  	
    	return tmpdata;
    };
  //判断OpcIP中的IP是否正确   
    $scope.verifyOpcIP=function(){
        var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test($scope.opcData.tcpIp)){
        	$scope.isOpcShow=false;
        }else if($scope.opcData.tcpIp === undefined || $scope.opcData.tcpIp === ""){
        	$scope.isOpcShow=false;
        }else{
        	$scope.isOpcShow=true;
        }
    };
    
    //判断TCPIP中的IP是否正确   
    $scope.verifyTcpIP=function(){
        var strRegex=new RegExp("^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\."
        		+"(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$");
        if(strRegex.test($scope.tcpData.tcpIp)){
        	$scope.isTcpShow=false;
        }else if($scope.tcpData.tcpIp === undefined || $scope.tcpData.tcpIp === ""){
        	$scope.isTcpShow=false;
        }else{
        		$scope.isTcpShow=true;
        }
    };
    
    if($scope.template == 1){
    	$scope.tcpShow=true;
    	$scope.opcShow=false;
        $scope.comShow=false;
    	$scope.tcpData=$scope.getdata("/da-devices/"+$scope.id).dataAcquisitionDevice;
    	$scope.tcpAttrs=$scope.getdata("/da-devices/"+$scope.id).attrs;
    	$scope.luastrShow('tcpData');
    }else if($scope.template == 3){
    	$scope.tcpShow=false;
    	$scope.opcShow=true;
        $scope.comShow=false;
    	$scope.opcData=$scope.getdata("/da-devices/"+$scope.id).dataAcquisitionDevice;
    	$scope.opcAttrs=$scope.getdata("/da-devices/"+$scope.id).attrs;
    	console.log()
    	$scope.luastrShow('opcData');
    }else{
    	$scope.tcpShow=false;
    	$scope.opcShow=false;
        $scope.comShow=true;
        //调用数据接口
    	$scope.comData=$scope.getdata("/da-devices/"+$scope.id).dataAcquisitionDevice;
    	$scope.comAttrs=$scope.getdata("/da-devices/"+$scope.id).attrs;
       	console.log($scope.comData);
    	console.log($scope.getdata("/da-devices/"+$scope.id))
       	$scope.luastrShow('comData');
    	//获取波特率
		$scope.baudRates = $scope.getmethod("/da-devices/com/baud-rates");
		//获取串口名称
		$scope.com_ports = $scope.getmethod("/da-devices/com/com-ports");
		//获取windows串口名称
		$scope.win_com_ports = $scope.getmethod("/da-devices/com/win-com-ports");
		//获取校验位:
		$scope.parity_bits = $scope.getmethod("/da-devices/com/parity-bits");
		//获取数据位 :
		$scope.data_bits = $scope.getmethod("/da-devices/com/data-bits");
		//获取停止位: 
		$scope.stop_bits = $scope.getmethod("/da-devices/com/stop-bits");
		//数据传输模式 :
		$scope.trans_types = $scope.getmethod("/da-devices/com/trans-types");
    }
  
    $scope.cancel = function(){
    	$state.go('app.point.view.collector.list');
    }
    
    $scope.ok = function(){    	
//    	if(!confirm("确认要修改么？")){
//    		return;
//    	}
//    	console.log($scope.tcpData)
    	$scope.isdisableok = true;
    	
    	if($scope.tcpShow === true){
    		var data={};
    		if($scope.isTcpShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		data.dataAcquisitionDevice=$scope.tcpData;
    		data.attrs=$scope.tcpAttrs;
    		console.log(data);
    		$.ajax({
    			url:url+'/da-devices',
    			type:"PUT",
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			async:false
    		}).success(function(data){
//    			alert('修改成功!!!!');
    			$scope.isdisabled = true;
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}else if($scope.opcShow === true){
    		var data={};
    		if($scope.isOpcShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		data.dataAcquisitionDevice=$scope.opcData;
    		data.attrs=$scope.opcAttrs;
    		$.ajax({
    			url:url+'/da-devices',
    			type:"PUT",
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			async:false
    		}).success(function(data){
//    			alert('修改成功!!!!');
    			$scope.isdisabled = true;
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}else{
    		var data={};
    		data.dataAcquisitionDevice=$scope.comData;
    		data.attrs=$scope.comAttrs;
    		$.ajax({
        		url:url + "/da-devices",
        		type:"PUT",
        		data:JSON.stringify(data),
        		contentType:"application/json",
        		async: false
        	}).success(function(data){
//        		alert("修改成功！！！！");
        		$scope.isdisabled = true;
        		$state.go('app.point.view.collector.list');
        	}).error(function(data){
                alert(data.responseJSON.message);                
            })
    	}    	
    };

}]);
