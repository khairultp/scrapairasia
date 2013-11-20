package com.khairul.model;


public interface FlightRequest {
	public Flight getFlight();
	public boolean isRoundTrip();
	public int getAdult();
	public int getChild();
	public int getInfant();
	public String getCurrency();
	public String getDepartDate();
	public String getReturnDate();
}
