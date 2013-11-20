package com.khairul.model;

public class Fare {
	
	private double price;
	private PassengerType type;
	private String currency;
	
	public Fare(){}
	
	public Fare(double price, PassengerType type){
		this.price=price;
		this.type=type;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public PassengerType getType() {
		return type;
	}

	public void setType(PassengerType type) {
		this.type = type;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}	
}
