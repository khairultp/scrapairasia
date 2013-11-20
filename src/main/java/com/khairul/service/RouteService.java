package com.khairul.service;

import java.util.List;

import com.khairul.model.Route;

public interface RouteService {
	Route getByCode(String code);
	List<Route> getRoutes();
	List<Route> getByGroup(String group);
}
