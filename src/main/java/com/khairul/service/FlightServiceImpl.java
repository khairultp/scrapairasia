package com.khairul.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.khairul.dao.FlightDao;
import com.khairul.model.Flight;
import com.khairul.model.FlightRequest;
import com.khairul.model.FlightSchedule;
import com.khairul.model.Route;

@Service("flightService")
public class FlightServiceImpl implements FlightService {
	
	@Autowired
	private FlightDao flightDaoAirAsia;

	@Override
	public List<Flight> getSchedule(Route origin, Route destination, String depart, String arrive) {
//		return flightDao.getSchedule(origin, destination, depart, arrive);
		return null;
	}

	@Override
	public FlightSchedule getSchedule(FlightRequest request) {
		return flightDaoAirAsia.getSchedule(request);
	}

}
