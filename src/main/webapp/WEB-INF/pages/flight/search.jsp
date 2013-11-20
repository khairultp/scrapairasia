<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<link rel="stylesheet" type="text/css" href="<c:url value='/resources/easyui/themes/default/easyui.css' />">
		<link rel="stylesheet" type="text/css" href="<c:url value='/resources/easyui/themes/icon.css' />">
		<link rel="stylesheet" type="text/css" href="<c:url value='/resources/easyui/demo/demo.css' />">
		
		<script type="text/javascript" src="<c:url value='/resources/js/jquery.min.js' />"></script>
		<script type="text/javascript" src="<c:url value='/resources/easyui/jquery.easyui.min.js' />"></script>
		
		<title>Spring MVC - jQuery Integration Tutorial</title>
	</head>
	
	<body>
	    <div id="cc" class="easyui-layout" style="width:100%;height:550px;">
		    <div class="easyui-panel" style="width:370px; ;padding:10px;" 
				 data-options="region:'west'">
				 
				<div class="easyui-panel" title="Search Flight" style="width:350px; ;padding:10px;" 
					 data-options="iconCls:'icon-plane'">
					<form:form method="post" commandName="flightUI">
						<table>
							<tr>
								<td>Jenis Perjalanan</td>
								<td>
									<form:radiobutton path="roundTrip" value="1"/> PP 
									<form:radiobutton path="roundTrip" value="0"/> Sekali Jalan
								</td>
								<td><form:errors path="roundTrip" cssClass="error" /></td>
							</tr>
							<tr>
								<td>Asal</td>
								<td>
									<form:select path="flight.origin.code" id="origin">
								   		<form:option value="" label="--- Select ---" />
								    	<form:options items="${routes}" itemValue="code" itemLabel="name" />
									</form:select>
								</td>
								<td><form:errors path="flight.origin" cssClass="error" />
								</td>
							</tr>
							<tr id="tujuan">
								<td>Tujuan</td>
								<td>
									<form:select path="flight.destination.code" id="destination">
								   		<form:option value="" label="--- Select ---" />
								    	<form:options items="${routes}" itemValue="code" itemLabel="name" />
									</form:select>
								</td>
								<td><form:errors path="flight.destination" cssClass="error" />
								</td>
							</tr>
							<tr>
								<td>Keberangkatan</td>
								<td><form:input path="departDate" id="departsDate" class="easyui-datebox" data-options="required:true"/></td>
								<td><form:errors path="departDate" cssClass="error" /></td>
							</tr>
							<tr id="kembali">
								<td>Kembali</td>
								<td><form:input path="returnDate" id="returnsDate" class="easyui-datebox" data-options="required:true"/></td>
								<td><form:errors path="returnDate" cssClass="error" /></td>
							</tr>
							<tr>
								<td>Penumpang</td>
								<td>
									<form:select path="adult" id="adult">
								   		<form:option value="1" label="1 Dewasa" />
								   		<form:option value="2" label="2 Dewasa" />
								   		<form:option value="3" label="3 Dewasa" />
								   		<form:option value="4" label="4 Dewasa" />
								   		<form:option value="5" label="5 Dewasa" />
								   		<form:option value="6" label="6 Dewasa" />
								   		<form:option value="7" label="7 Dewasa" />
								   		<form:option value="8" label="8 Dewasa" />
								   		<form:option value="9" label="9 Dewasa" />
									</form:select>
									<form:select path="child" id="child">
										<form:option value="0" label="0 Anak" />
								   		<form:option value="1" label="1 Anak" />
								   		<form:option value="2" label="2 Anak" />
								   		<form:option value="3" label="3 Anak" />
								   		<form:option value="4" label="4 Anak" />
								   		<form:option value="5" label="5 Anak" />
								   		<form:option value="6" label="6 Anak" />
								   		<form:option value="7" label="7 Anak" />
								   		<form:option value="8" label="8 Anak" />
								   		<form:option value="9" label="9 Anak" />
									</form:select>
									<form:select path="infant" id="infant">
										<form:option value="0" label="0 Bayi" />
								   		<form:option value="1" label="1 Bayi" />
								   		<form:option value="2" label="2 Bayi" />
								   		<form:option value="3" label="3 Bayi" />
								   		<form:option value="4" label="4 Bayi" />
								   		<form:option value="5" label="5 Bayi" />
								   		<form:option value="6" label="6 Bayi" />
								   		<form:option value="7" label="7 Bayi" />
								   		<form:option value="8" label="8 Bayi" />
								   		<form:option value="9" label="9 Bayi" />
									</form:select>
								</td>
								<td><form:errors path="adult" cssClass="error" /></td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td><a id="btnSearch" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">Cari</a></td>
							</tr>
						</table>
					</form:form>
					
				</div>
				<br/>
				<table id="biayaDepart" style="width:350px"></table>
				<br/>
				<table id="biayaReturn" style="width:350px"></table>
			</div>
		    <div style="width:600px; padding:5px;" data-options="region:'center'">
		    	<div id="departsDiv">
		    		<b>DEPART</b>
			    	<div id="headerDeparts" class="demo-info">&nbsp;</div>
			    	<table id="departs"></table>
		    	</div>
		    	<div id="returnsDiv">
		    		<br/><br/>
			    	<b>RETURN</b>
			    	<div id="headerReturns" class="demo-info">&nbsp;</div>
			    	<table id="returns"></table>			    	
		    	</div>
		    	<div class='icon-airasia' style="visibility: hidden;">&nbsp;</div>
		    </div>
	    </div>
	    
		<script type="text/javascript">
			
			$.fn.datebox.defaults.formatter = formatDate;
			$.fn.datebox.defaults.value = formatDate(new Date());
			
			
			$(function(){
				$('#destination').validatebox({
				    required: true,
				});
				
				$('#origin').validatebox({
				    required: true,
				});
				
			    $('#btnSearch').bind('click', function(){
			    	$('#flightUI').submit();
			    });
			    
			    $("input[name='roundTrip']").on("change", function () {
				    if(this.value==0){
				    	$("#kembali").hide();
				    }
				    else{
				    	$("#kembali").show();
				    }
				});
			    
			    $('#flightUI').form({
			    	url: "/cwp/flight/search",
			    	onSubmit: function(){
			    		var isValid = $(this).form('validate');
						var departs = $('#departsDate').val();
						var returns = $('#returnsDate').val();
						
						if (isValid){
							progress();
			    			$('#departsDiv').hide();
							$('#returnsDiv').hide();
			    		}
			    		return isValid;	// return false will stop the form submission
			    	},
			    	success: function(data){
			    		if(data=="") {
			    			$.messager.alert('Info','Penerbangan tidak tersedia','info');
			    		}
			    		else{
			    			data = eval('('+data+')');
				    		var departs = data.departs;
				    		var returns = data.returns;
				    		var radioDeparts = '';
				    		var radioReturns = '';
				    		
				    		if(departs!=null){
				    			$('#departsDiv').show();
				    			var depart0 = departs[0];
				    			radioDeparts = depart0.flightPlan;
				    			
					    		$('#headerDeparts').html(depart0.origin.name + ' to '+depart0.destination.name + ' ' + formatStrDate(depart0.departDate));
					    		$('#departs').datagrid({
					    		    columns:[[
					    		        //{field:'origin',title:'Asal',width:150,halign:'center',align:'center',formatter:formatOri},
					    		        {field:'flightNumber',title:'Nomor Penerbangan',width:144,halign:'center',align:'center'},
					    		        {field:'departDate',title:'Berangkat - Tiba',width:150,halign:'center',align:'center',formatter: formatDepart},
					    		        {field:'fares',title:'Harga',width:150,halign:'center',align:'center',formatter: formatPrice},
					    		        {field:'estimatedTime',title:'Perkiraan Lama Penerbangan',width:180,halign:'center',align:'center'},
					    		        {field:'company',title:'Maskapai',width:150,halign:'center',align:'center', 
					    		        	styler: function(value,row,index){return {class:'icon-'+value}},
					    		        	formatter: function(value,row,index){return "";}
					    		        },
					    		        {field:'typeE',title:'Keterangan',width:100,halign:'center',align:'center',formatter: formatKeterangan},
					    		    ]],
					    		    data: departs
								});
				    		}

				    		if(returns!=null && returns!=""){
				    			$('#returnsDiv').show();
				    			var return0 = returns[0];
				    			radioReturns = return0.flightPlan;				    			
					    		$('#headerReturns').html(return0.origin.name + ' to '+return0.destination.name+ ' ' + formatStrDate(return0.departDate));
					    		
					    		$('#returns').datagrid({
				    		    	columns:[[
					    		        {field:'flightNumber',title:'Nomor Penerbangan',width:144,halign:'center',align:'center'},
					    		        {field:'departDate',title:'Berangkat - Tiba',width:150,halign:'center',align:'center',formatter: formatDepart},
					    		        {field:'fares',title:'Harga',width:150,halign:'center',align:'center',formatter: formatPrice},
					    		        {field:'estimatedTime',title:'Perkiraan Lama Penerbangan',width:180,halign:'center',align:'center'},
					    		        {field:'company',title:'Maskapai',width:150,halign:'center',align:'center', 
					    		        	styler: function(value,row,index){return {class:'icon-'+value}},
					    		        	formatter: function(value,row,index){return "";}
					    		        },
					    		        {field:'typeE',title:'Keterangan',width:100,halign:'center',align:'center',formatter: formatKeterangan},
					    		    ]],
					    		    data: returns 
								});
				    		}
				    		
				    		var adult = $('#adult').find('option:selected').val();
			    			var child = $('#child').find('option:selected').val();
			    			var infant = $('#infant').find('option:selected').val();
			    			
				    		$("input[name='"+radioDeparts+"']").on("change", function () {
				    			var radVal = $(this).val().split(',');
				    			var valAdult = adult +' x '+number_format(radVal[0],2,',','.');
				    			var valChild = child +' x '+number_format(radVal[1],2,',','.');
				    			var valInfant = infant +' x '+number_format(radVal[2],2,',','.');
				    			var total = 0;
				    			
				    			total = getNumber(radVal[0]) * getNumber(adult);
				    			total += getNumber(radVal[1]) * getNumber(child);
				    			total += getNumber(radVal[2]) * getNumber(infant);
				    			total = number_format(total,2,',','.');
				    			
				    			
				    			$('#biayaDepart').propertygrid({
							        showGroup: true,
							        scrollbarSize: 0,
							        data:[
							              {"name":'Dewasa',"value":valAdult,"group":"Depart"},
							              {"name":'Anak',"value":valChild,"group":"Depart"},
							              {"name":'Bayi',"value":valInfant,"group":"Depart"},
							              {"name":"Total (IDR)", "value":total,"group":"Depart"},
							          ]
							    });
							});
				    		
				    		$("input[name='"+radioReturns+"']").on("change", function () {
				    			var radVal = $(this).val().split(',');
				    			var valAdult = adult +' x '+ number_format(radVal[0],2,',','.');
				    			var valChild = child +' x '+number_format(radVal[1],2,',','.');
				    			var valInfant = infant +' x '+number_format(radVal[2],2,',','.');
								var total = 0;
				    			
								total  = getNumber(radVal[0]) * getNumber(adult);
				    			total += getNumber(radVal[1]) * getNumber(child);
				    			total += getNumber(radVal[2]) * getNumber(infant);
				    			total = number_format(total,2,',','.');
				    			
				    			$('#biayaReturn').propertygrid({
							        showGroup: true,
							        scrollbarSize: 0,
							        data:[
											{"name":'Dewasa',"value":valAdult,"group":"Return"},
											{"name":'Anak',"value":valChild,"group":"Return"},
											{"name":'Bayi',"value":valInfant,"group":"Return"},
											{"name":"Total (IDR)", "value":total,"group":"Return"},
							          	]
							    });
							});
			    		}
			    		$.messager.progress('close');
			    	},
			    	onLoadError:function(){
			    		alert('error');
			    	}
			    });
			});
			
			function getNumber(strNumber){
				if(strNumber==null || strNumber=='') return 0;
				
				return parseInt(strNumber);
			}
			
			function progress(){
	            var win = $.messager.progress({
	                title:'Please waiting',
	                msg:'Loading data...',
	                interval:900
	            });
	            setTimeout(function(){
	                $.messager.progress('close');
	            },5000)
	        }
			
			function formatDate(date){
				var y = date.getFullYear();
				var m = date.getMonth()+1;
				var d = date.getDate();
				return (d<10?('0'+d):d)+'/'+(m<10?('0'+m):m)+'/'+y;
			}
		
			function formatStrDate(strDate){
				var dt = strDate.split('/');
				var y = dt[0];
				var m = dt[1];
				var d = dt[2];
				return (d<10?('0'+d):d)+'/'+(m<10?('0'+m):m)+'/'+y;
			}
			
			function formatDepart(value,row,index){
				if(value==null) return "";
				
				var text = row.departTime +' ('+row.origin.code+') <br />'+ row.arriveTime +' ('+row.destination.code+')';
				return text;
			}
			
			function formatKeterangan(value,row,index){
				if(value=='LOW') return 'Low Fare';
				else if(value=='HIGH') return 'Hi-Flyer';
				
				return "";
			}
			
			function formatOri(value,row,index){
				
				if (row.origin){
					return row.origin.name;
				} 
				return value;
			}
			
			function formatDest(value,row,index){
				
				if (row.destination){
					return row.destination.name;
				} 
				return value;
			}
			
			function formatPrice(value,row,index){
				if (row.fares){
					var text = "";
					//var radioId = index+'-'+row.flightNumber+'-'+row.typeE;
					var total = '';
					for(var i=0; i<row.fares.length; i++){
						var price = number_format(row.fares[i].price,2,',','.');
						total += row.fares[i].price;
						
						if(i<row.fares.length-1) total+=',';
						
						text +=  row.fares[i].type+' <br />' + price + ' '+row.fares[i].currency+' <br />';
					}
					var radio = '<input name="'+row.flightPlan+'" type="radio" value="'+total+'"/>';
					text = radio + '<br />' + text;
					return text;
				} 
				
				return "";
			}
			
			function number_format(num,dig,dec,sep) {
				if(num==null || num=='') return 0;
				x = new Array();
			  	s = (num<0?"-":"");
			  	num = Math.abs(num).toFixed(dig).split(".");
			  	r = num[0].split("").reverse();
			  	for(var i=1;i<=r.length;i++){
			  		x.unshift(r[i-1]);
			  		if(i%3==0&&i!=r.length) x.unshift(sep);
			  	}
			  	return s+x.join("")+(num[1]?dec+num[1]:"");
			}
		</script>
	</body>
	
</html>