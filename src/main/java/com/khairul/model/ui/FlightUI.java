package com.khairul.model.ui;

import com.khairul.model.Flight;
import com.khairul.model.FlightRequest;

public class FlightUI implements FlightRequest {

	private Flight flight;
	private boolean roundTrip;
	
	private int adult;
	private int child;
	private int infant;
	private String currency;
	private String departDate;
	private String returnDate;
	
	@Override
	public Flight getFlight() {
		return flight;
	}
	
	@Override
	public boolean isRoundTrip() {
		return roundTrip;
	}
	
	@Override
	public int getAdult() {
		return adult;
	}
	
	@Override
	public int getChild() {
		return child;
	}

	@Override
	public int getInfant() {
		return infant;
	}

	@Override
	public String getCurrency() {
		return currency;
	}
	
	@Override
	public String getDepartDate() {
		return departDate;
	}

	@Override
	public String getReturnDate() {
		return returnDate;
	}
	
	public void setFlight(Flight flight) {
		this.flight = flight;
	}
	
	public void setRoundTrip(boolean roundTrip) {
		this.roundTrip = roundTrip;
	}

	public void setAdult(int adult) {
		this.adult = adult;
	}

	public void setChild(int child) {
		this.child = child;
	}

	public void setInfant(int infant) {
		this.infant = infant;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public void setDepartDate(String departDate) {
		this.departDate = departDate;
	}

	public void setReturnDate(String returnDate) {
		this.returnDate = returnDate;
	}	
}
