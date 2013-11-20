package com.khairul.model;

public enum PassengerType {
	Adult("Adult"),
	Kid("Kid"),
	Infant("Infant");
	
	private String type;
	
	PassengerType(String type){
		this.type=type;
	}
	
	public static PassengerType getType(String type){
		PassengerType[] temp = values();
		
		for(PassengerType t : temp){
			if(t.type.equals(type)) return t;
		}
		
		return null;
	}
}
