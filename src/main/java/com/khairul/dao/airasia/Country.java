package com.khairul.dao.airasia;

import org.codehaus.jackson.annotate.JsonProperty;

public class Country {
//	{"currency":"AFN","InternationalDialCode":"93","name":"Afghanistan","code":"AF"}
	
	private String currency;
	private String internationalDialCode;
	private String name;
	private String code;
	
	
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public String getInternationalDialCode() {
		return internationalDialCode;
	}
	
	@JsonProperty("InternationalDialCode")
	public void setInternationalDialCode(String internationalDialCode) {
		this.internationalDialCode = internationalDialCode;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	
}
