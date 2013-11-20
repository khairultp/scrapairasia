package com.khairul.service;

import java.util.Date;
import java.util.List;

import com.khairul.model.Flight;
import com.khairul.model.FlightRequest;
import com.khairul.model.FlightSchedule;
import com.khairul.model.Route;

public interface FlightService {
	
	List<Flight> getSchedule(Route origin, Route destination, String depart, String arrive);
	FlightSchedule getSchedule(FlightRequest request);

}
