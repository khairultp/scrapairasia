package com.khairul.model;

public class Route implements Comparable<Route> {
	
	private String group;
	private String code;
	private String name;
	
	public Route(){}
	
	public Route(String code){
		this.code = code;
	}
	
	public Route(String group, String code, String name){
		this.group = group;
		this.code = code;
		this.name = name;
	}
	
	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public int compareTo(Route o) {
		return this.name.compareToIgnoreCase(o.name);
	}
	
	
}
