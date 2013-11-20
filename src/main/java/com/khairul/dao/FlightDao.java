package com.khairul.dao;

import java.util.List;

import com.khairul.model.Flight;
import com.khairul.model.FlightRequest;
import com.khairul.model.FlightSchedule;
import com.khairul.model.Route;

public interface FlightDao {
	
	FlightSchedule getSchedule(FlightRequest request);
	List<Flight> getSchedule(Route origin, Route destination, String depart, String arrive);
	
}
