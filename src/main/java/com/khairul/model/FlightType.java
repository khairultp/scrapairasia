package com.khairul.model;

public enum FlightType {
	LOW,HIGH;
	
	public static FlightType getType(boolean type){
		if(type) return HIGH;
		return LOW;
	}
}
