package com.khairul.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.khairul.dao.RouteDao;
import com.khairul.model.Route;

@Service("routeService")
public class RouteServiceImpl implements RouteService {
	
	@Autowired RouteDao routeDaoAirAsia;

	@Override
	public Route getByCode(String code) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Route> getRoutes() {
		return routeDaoAirAsia.getRoutes();
	}

	@Override
	public List<Route> getByGroup(String group) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
}
