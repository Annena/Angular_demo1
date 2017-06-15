app.controller('CollectorCreateCtrl', ['$scope','$state','$http','point',function($scope,$state,$http,point) {
	
	
    $scope.dev = {};
    $scope.opcData={};
    $scope.tcpData={};
    $scope.comData={};
    
    $scope.dev.daDevProtocolName='协议接口名称';
    $scope.dev.physicalLink="物理链路";
    $scope.isdisableok = false;
    
    $scope.isOpcShow=false;
    $scope.isTcpShow=false;
    
    $scope.collectorType_id='';
    $scope.company_id='';
    $scope.serie_id='';
    $scope.seriesModel_id='';
    
    $scope.edit=false;
    
    $scope.isPPI=false;
    $scope.isOPC=false;
    $scope.isTCP=false;
    $scope.bandRates = [];
    $scope.bandRate = "";
    $scope.luastrshow=false;
    
    $scope.addList=[];
	$scope.addObj={};
    
	$scope.dev.enableLua=false;
	
	$scope.isdisabled = false;
	
	var url = window.location.protocol +"//" + window.location.host + "/config/api";
	var monitorpoint = point.getpoint();
    $scope.dev.monitorPointId = monitorpoint.id;
    $scope.dev.monitorPointName = monitorpoint.name;
    
    $scope.cancel = function(){
    	$state.go('app.point.view.collector.list');
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
	
	
	
    //取类型对应的值
    $scope.getCollectorTypes=function(){
    	$http.get(url+'/da-device/types')
    	.success(function(data){  
    		$scope.collectorTypes=data.entity; 
    		$scope.selectType();
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    //取所选类型的id
    $scope.selectType=function(){
    	if($scope.collectorType != null){
    		$scope.dev.daDevTypeId=$scope.collectorType.id;
    		$scope.dev.daDevTypeName=$scope.collectorType.name;
    		$scope.getCompanies();
    	}else{
    		$scope.collectorType_id='';
    	}
    };
     
    
    //获取采集设备厂商列表
    $scope.getCompanies=function(){
    	$http.get(url+'/da-device/types/'+$scope.dev.daDevTypeId+'/companies')
    	.success(function(data){
    		$scope.companies=data.entity;
    		$scope.selectCompany();
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    //取所先厂商的id
    $scope.selectCompany=function(){
    	if($scope.companie != null){
    		$scope.dev.daDevCompanyId=$scope.companie.id;
    		$scope.dev.daDevCompanyName=$scope.companie.name;
    		$scope.getSeries();
    	}else{
    		$scope.dev.daDevCompanyId='';
    	}
    };
    
    
    //获取采集设备系列列表
    $scope.getSeries=function(){
    	$http.get(url+'/da-device/types/'+$scope.dev.daDevCompanyId+'/companies/'+$scope.dev.daDevCompanyId+'/series')
    	.success(function(data){
    		$scope.series=data.entity;
    		$scope.selectSeries();
    		
    	})
    };
    //获取采集设备配置的id
    $scope.selectSeries=function(){
    	if($scope.serie != null){
    		$scope.dev.daDevSeriesId=$scope.serie.id;
    		$scope.dev.daDevSeriesName=$scope.serie.name;
    		$scope.dev.template=$scope.serie.template;
    		$scope.getSeriesModel();
    		$scope.getphysicalLink();
    	}else{
    		$scope.dev.daDevSeriesId='';
    	}
    };
    
    
    //获取采集设备型号
    $scope.getSeriesModel=function(){
    	$http.get(url+'/da-device/series/'+$scope.dev.daDevSeriesId+'/models')
    	.success(function(data){
    		$scope.seriesModels=data.entity;
    		if($scope.seriesModels.length<=1){
        		$scope.edit=true;
        		$scope.dev.daDevModelId=$scope.seriesModels[0].daDevSeriesId;
        		$scope.dev.daDevModelName=$scope.seriesModels[0].daDevSeriesName;
        	}else{
        		$scope.edit=false;
        	}
    		
    	})
    	
    };
    //获取采集设备型号id
    $scope.selectSeriesModel=function(){   	
    	if($scope.seriesModel != null){
    		$scope.dev.daDevModelId=$scope.seriesModel.id;
    		$scope.dev.daDevModelName=$scope.seriesModel.name;
    	}else{
    		$scope.dev.daDevModelId='';
    	}
    };
    
    
    //获取协议接口以及物理链路
    $scope.getphysicalLink=function(){
    	$http.get(url+'/da-device/series/'+$scope.dev.daDevSeriesId)
    	.success(function(data){
    		$scope.dev.physicalLink=data.entity.physicalLink;
    		$scope.dev.daDevProtocolName=data.entity.daDevProtocolName;
    		$scope.dev.daDevProtocolId=data.entity.daDevProtocolId;
    		$scope.isShowPPI();    		
    	}).error(function(data){
    		alert(data.message);
    	})
    };
    
    $scope.change=function(){
    	console.log($scope.comData.baudRate);
    }
    
    //判断物理链路是否为第一种
    $scope.isShowPPI=function(){
    	if($scope.dev.template == 2 ){
    		$scope.isOPC=false
    		$scope.isTCP=false;
    		$scope.isPPI=true;
    		//获取波特率
    		$scope.baudRates = $scope.getmethod("/da-devices/com/baud-rates");
    		$scope.comData.baudRate = $scope.baudRates[0];
    		//获取串口名称
    		$scope.com_ports = $scope.getmethod("/da-devices/com/com-ports");
    		$scope.comData.comPort = $scope.com_ports[0];
    		//获取windows串口名称
    		$scope.win_com_ports = $scope.getmethod("/da-devices/com/win-com-ports");
    		$scope.comData.winComPort = $scope.win_com_ports[0];
    		//获取校验位:
    		$scope.parity_bits = $scope.getmethod("/da-devices/com/parity-bits");
    		$scope.comData.key = $scope.parity_bits[0];
    		//获取数据位 :
    		$scope.data_bits = $scope.getmethod("/da-devices/com/data-bits");
    		$scope.comData.dataBit = $scope.data_bits[0];
    		//获取停止位: 
    		$scope.stop_bits = $scope.getmethod("/da-devices/com/stop-bits");
    		$scope.comData.stopBit = $scope.stop_bits[0];
    		//数据传输模式 :
    		$scope.trans_types = $scope.getmethod("/da-devices/com/trans-types");
    		$scope.comData.transType = $scope.trans_types[0]
    	}else if($scope.dev.template == 3){
    		$scope.isPPI=false;
    		$scope.isTCP=false;
    		$scope.isOPC=true;
    	}else{
    		$scope.isPPI=false;
    		$scope.isOPC=false;
    		$scope.isTCP=true;
    	}
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
    
    
    //调用下拉框内容
    $scope.getCollectorTypes();
    
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
    
	//showLua
	$scope.luastrShow=function(){
		if($scope.dev.enableLua == true){
			$scope.luastrshow=true;
		}else{
			$scope.luastrshow=false;
		}
	}
        
    //确认添加
    $scope.ok = function(){
    	
//    	if(!confirm("确认要添加么？")){
//    	//	return true;
//    	}
    	
    	$scope.isdisableok = true;    	
    	
//PPI添加    	
    	if($scope.isPPI === true){
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.comData);
    		data.attrs=$scope.addList;
        	$.ajax({
        		url:url + "/da-devices",
        		type:"POST",
        		data:JSON.stringify(data),
        		dataType:"JSON",
        		contentType:"application/json",
        		async: false
        	}).success(function(data){
//        		alert("创建成功！！！！");
        		$scope.isdisabled = true;
        		$state.go('app.point.view.collector.list');
        	}).error(function(data){
        		alert(data.responseJSON.message);              
            });
    	}
//OPC添加    	
    	if($scope.isOPC === true){   		
    		if($scope.isOpcShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.opcData);
    		data.attrs=$scope.addList;
    		$.ajax({
    			url:url+"/da-devices",
    			type:"POST",
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			dataType:"JSON",
    			async:false
    		}).success(function(){
//    			alert('创建成功！！！');
    			$scope.isdisabled = true;
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
    			alert(data.responseJSON.message);
        	})
    	}
//TCP添加
    	if($scope.isTCP === true){
    		
    		if($scope.isTcpShow === true){
    			alert('请输入正确的ip地址');
    			return false;
    		}
    		
    		var data={};
    		data.dataAcquisitionDevice=angular.extend($scope.dev,$scope.tcpData);
    		data.attrs=$scope.addList;
    		$.ajax({
    			url:url+'/da-devices',
    			type:"POST",
    			data:JSON.stringify(data),
    			contentType:'application/json',
    			dataType:"JSON",
    			async:false
    		}).success(function(data){
//    			alert('创建成功!!!!');
    			$scope.isdisabled = true;
    			$state.go('app.point.view.collector.list');
    		}).error(function(data){
    			alert(data.responseJSON.message);
        	})
    	}
    };

}]);
