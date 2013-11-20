<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script type="text/javascript" src="<c:url value='/resources/js/jquery.min.js' />"></script>
		
		<script type="text/javascript">
			var jq = jQuery.noConflict();
		</script>
		
		<title>Spring MVC - jQuery Integration Tutorial</title>
	</head>
	
	<body>
		<h3>Spring MVC - jQuery Integration Tutorial</h3>
		<h4>AJAX version</h4>
		

		Demo 1
		<div>
			Add Two Numbers: <input id="inputNumber1" name="inputNumber1"
				type="text" size="5"> + <input id="inputNumber2"
				name="inputNumber2" type="text" size="5"> <input
				type="submit" value="Add" onclick="add()" /> Sum: <span id="sum">(Result will be shown here)</span>
		</div>
		
		<script type="text/javascript">
			function add() {
				jq(function() {
				  jq.post("/cwp/ajax/add",
				     {  inputNumber1:  jq("#inputNumber1").val(),
				        inputNumber2:  jq("#inputNumber2").val() },
				      function(data){
				        jq("#sum").replaceWith('<span id="sum">'+ data + '</span>');
				      });
				 });
			}
		</script>
	</body>
	
</html>