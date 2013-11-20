<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<link rel="stylesheet" type="text/css" href="<c:url value='/resources/easyui/themes/default/easyui.css' />">
		<link rel="stylesheet" type="text/css" href="<c:url value='/resources/easyui/themes/icon.css' />">
		
		<script type="text/javascript" src="<c:url value='/resources/js/jquery.min.js' />"></script>
		<script type="text/javascript" src="<c:url value='/resources/easyui/jquery.easyui.min.js' />"></script>
		
		<title>Spring MVC - jQuery Integration Tutorial</title>
	</head>
	
	<body>
		<div id="p" class="easyui-panel" style="width:500px;height:200px;padding:10px;"
		        title="My Panel" data-options="iconCls:'icon-save',collapsible:true">
		    The panel content
		</div>
		
		<input class="easyui-combobox" name="language"
        data-options="
            url:'/cwp/dashboard/data',
            method:'GET',
            valueField:'id',
            textField:'text',
            panelHeight:'auto',
            onSelect:function(record){
                alert(record.text)
            }">
	</body>
	
</html>