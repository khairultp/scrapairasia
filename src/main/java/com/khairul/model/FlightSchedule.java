package com.khairul.model;

import java.util.List;

public class FlightSchedule {

	private List<Flight> departs;
	private List<Flight> returns;
	
	public FlightSchedule(){}
	
	public FlightSchedule(List<Flight> departs, List<Flight> returns){
		this.departs=departs;
		this.returns=returns;
	}

	public boolean isRoundTrip() {
		if(returns!=null && returns.size()>0) return true;
		
		return false;
	}

	public List<Flight> getDeparts() {
		return departs;
	}

	public void setDeparts(List<Flight> departs) {
		this.departs = departs;
	}

	public List<Flight> getReturns() {
		return returns;
	}

	public void setReturns(List<Flight> returns) {
		this.returns = returns;
	}
}
