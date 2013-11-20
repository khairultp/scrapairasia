package com.khairul.model;

import java.util.ArrayList;
import java.util.List;

import com.khairul.model.Company;

public class Flight {

	private String flightNumber;
	private Route origin;
	private Route destination;
	private String departDate;
	private String arriveDate;
	
	private String departTime;
	private String arriveTime;
	
	private List<Fare> fares;
	
	private String estimatedTime;
	
	private boolean type; //hight n low
	private String passengerType; //adults, kids n infants
	private String company;
	private FlightPlan flightPlan;
	
	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public Route getOrigin() {
		return origin;
	}

	public void setOrigin(Route origin) {
		this.origin = origin;
	}

	public Route getDestination() {
		return destination;
	}

	public void setDestination(Route destination) {
		this.destination = destination;
	}

	public String getDepartDate() {
		return departDate;
	}

	public void setDepartDate(String departDate) {
		this.departDate = departDate;
	}
	
	public String getArriveDate() {
		return arriveDate;
	}

	public void setArriveDate(String arriveDate) {
		this.arriveDate = arriveDate;
	}

	public String getDepartTime() {
		return departTime;
	}

	public void setDepartTime(String departTime) {
		this.departTime = departTime;
	}

	public String getArriveTime() {
		return arriveTime;
	}

	public void setArriveTime(String arriveTime) {
		this.arriveTime = arriveTime;
	}

	public List<Fare> getFares() {
		return fares;
	}

	public void setFares(List<Fare> fares) {
		this.fares = fares;
	}

	public String getEstimatedTime() {
		return estimatedTime;
	}

	public void setEstimatedTime(String estimatedTime) {
		this.estimatedTime = estimatedTime;
	}

	public boolean isType() {
		return type;
	}

	public void setType(boolean type) {
		this.type = type;
	}
	
	public void setTypeE(FlightType typeE) {
		if(typeE==FlightType.HIGH) this.type=true;
		else this.type=false;
	}
	
	public String getPassengerType() {
		return passengerType;
	}
	
	public void setPassengerType(String passengerType) {
		this.passengerType = passengerType;
	}

	public FlightType getTypeE(){
		return FlightType.getType(type);
	}
	
	public PassengerType getPassengerTypeE() {
		return PassengerType.getType(passengerType);
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}
	
	public Company getCompanyE() {
		return Company.getType(company);
	}
	
	public FlightPlan getFlightPlan() {
		return flightPlan;
	}

	public void setFlightPlan(FlightPlan flightPlan) {
		this.flightPlan = flightPlan;
	}

	public void copy(Flight flight){
		this.flightNumber=flight.flightNumber;
		this.origin=flight.origin;
		this.destination=flight.destination;
		this.departDate=flight.departDate;
		this.arriveDate=flight.arriveDate;
		this.departTime=flight.departTime;
		this.arriveTime=flight.arriveTime;
		this.estimatedTime=flight.estimatedTime;
		this.type=flight.type;
		this.passengerType=flight.passengerType;
		this.company=flight.company;
		this.flightPlan=flight.flightPlan;
		
		if(flight.fares!=null && flight.fares.size()!=0){
			this.fares=new ArrayList<Fare>(flight.fares);
		}
		
	}
}
