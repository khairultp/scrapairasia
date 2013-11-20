<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
	<head>
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
		<title>Spring MVC - jQuery Integration Tutorial</title>
	</head>
	
	<body>
		<h3>Spring MVC - jQuery Integration Tutorial</h3>
		<h4>Non-AJAX version</h4>
		
		<c:url var="addUrl" value="/nonajax/add" />
		
		<form action="${addUrl}" method="post">
			Demo 1
			<div style="border: 1px solid #ccc; width: 320px;">
				 Add Two Numbers: 
	 
				 <input id="inputNumber1" name="inputNumber1" type="text" size="5"> +
				 <input id="inputNumber2" name="inputNumber2" type="text" size="5">
				 <input type="submit" value="Add" /> 
				 
				 Sum: (Result will be shown on another page)
			</div>
		</form>
	</body>
</html> 