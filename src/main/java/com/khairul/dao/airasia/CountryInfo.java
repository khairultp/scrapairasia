package com.khairul.dao.airasia;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class CountryInfo {

	private List<Country> countryList;

	public List<Country> getCountryList() {
		return countryList;
	}

	@JsonProperty("CountryList")
	public void setCountryList(List<Country> countryList) {
		this.countryList = countryList;
	}
	
	
}
