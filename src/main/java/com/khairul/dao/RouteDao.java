package com.khairul.dao;

import java.util.List;

import com.khairul.model.Route;

public interface RouteDao {

	Route getByCode(String code);
	List<Route> getRoutes();
	List<Route> getByGroup(String group);
}
