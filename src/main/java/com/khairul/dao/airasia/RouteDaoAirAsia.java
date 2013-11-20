package com.khairul.dao.airasia;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Repository;

import com.khairul.dao.RouteDao;
import com.khairul.model.Route;

@Repository("routeDaoAirAsia")
public class RouteDaoAirAsia implements RouteDao {
	
	private List<Route> routes;

	@Override
	public Route getByCode(String code) {
		if(code==null) return null;
		if(routes==null) routes = routesAirAsia();
		
		for(Route r : routes){
			if(r.getCode().equals(code)) return r;
		}
		
		return null;
	}

	@Override
	public List<Route> getRoutes() {
		return routes;
	}

	private List<Route> routesAirAsia() {
		List<Station> stationList = getStationList();
		List<Route> routes = new ArrayList<Route>();
		
		if(stationList==null) return null;
		
		for(Station station : stationList){
			if("C".equals(station.getStationCategories())) continue;
			
			String code = station.getCode();// +","+station.getName();
			String name = station.getName() + " ("+station.getCode()+")";
			Route route = new Route(station.getCountryName(),code,name);
			
			routes.add(route);
		}
		return routes;
	}

	@Override
	public List<Route> getByGroup(String group) {
		// TODO Auto-generated method stub
		return null;
	}
	
	private List<Route> getDummy(){
		List<Route> routes = new ArrayList<Route>();
		routes.add(new Route(null, "CGK,Jakarta", "Jakarta (CGK)"));
		routes.add(new Route(null, "KNO,Medan - Kualanamu", "Medan - Kualanamu (KNO)"));
		
		return routes;
	}
	
	
	private List<Station> getStationList(){
		String url = "http://booking.airasia.com/Search.aspx";
		Document doc;
		try {
			doc = Jsoup.connect(url).get();
			
			Elements script = doc.select("script[xmlns:akformatterextension=urn:navitaire:formatters:mcc]");
			
			String html = script.get(5).html().trim();
			String stationInfo = html.substring(html.indexOf("stationInfo")+14, html.indexOf("countryInfo")-9);//.replace("StationList", "stationList");
//			System.out.println(stationInfo);
			
			ObjectMapper mapper = new ObjectMapper();
			StationInfo info = mapper.readValue(stationInfo, StationInfo.class);
			
//			System.out.println("getStationList : "+info.getStationList().size());
			
			String countryInfo = html.substring(html.indexOf("countryInfo")+14, html.indexOf("marketInfo")-8);
			
			for(Station st : info.getStationList()){
				String countryCode = st.getCountryCode();
				String name = getCountryName(countryInfo,countryCode);
				st.setCountryName(name);
			}
			
			return info.getStationList();

		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	/**
	 * 
	 * @param countryInfoJson from airasia search.aspx page
	 * @param search pattern to search code country (ex: ID)
	 * @return country name (ex: Indonesia)
	 */
	private String getCountryName(String countryInfoJson, String countryCode) {
		int idx = countryInfoJson.indexOf("\",\"code\":\""+countryCode+"\"");
		String name = null;
		
		
		for(int i=1; i<idx; i++){
			if(countryInfoJson.substring(idx-i,idx-i+1).equals("\"")){
				name = countryInfoJson.substring(idx-i,idx).replace("\"", "");
				return name;
			}
		}
		return null;
	}

	private List<Country> getCountryList(String json){
		String countryInfo = json.substring(json.indexOf("stationInfo")+14, json.indexOf("countryInfo")-8);
		
		ObjectMapper mapper = new ObjectMapper();
		CountryInfo info;
		
		try {
			info = mapper.readValue(countryInfo, CountryInfo.class);
			return info.getCountryList();
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	@PostConstruct
	public void init() throws Exception {
		routes = routesAirAsia();
		Collections.sort(routes);
	}
	
//	public static void main(String[] args){
//		RouteDaoAirAsia asia = new RouteDaoAirAsia();
//		asia.getPage();
//		
//		ObjectMapper mapper = new ObjectMapper();
//		//mapper.readv
//	}

}
