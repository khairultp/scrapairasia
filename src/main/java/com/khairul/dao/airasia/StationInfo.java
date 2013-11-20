package com.khairul.dao.airasia;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class StationInfo {
	
	private List<Station> stationList;

	public List<Station> getStationList() {
		return stationList;
	}

	@JsonProperty("StationList")
	public void setStationList(List<Station> stationList) {
		this.stationList = stationList;
	}

	
}
