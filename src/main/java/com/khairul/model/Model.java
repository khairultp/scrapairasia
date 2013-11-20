package com.khairul.model;

import java.io.Serializable;

public class Model implements Serializable {
	
	private static final long serialVersionUID = 12325123L;
	
	private int id;
	private String text;
	
	public Model(int id, String text){
		this.id=id;
		this.text=text;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	
	
}
