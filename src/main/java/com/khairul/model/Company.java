package com.khairul.model;

public enum Company {
	airasia("airasia");
	
	private String name;
	
	private Company(String name){
		this.name=name;
	}
	
	public static Company getType(String name){
		Company[] values = values();
		for(Company com : values){
			if(com.name.equals(name)) return com;
		}
		
		return null;
	}
}
