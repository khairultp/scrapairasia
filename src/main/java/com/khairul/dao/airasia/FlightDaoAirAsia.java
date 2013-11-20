package com.khairul.dao.airasia;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.khairul.dao.FlightDao;
import com.khairul.dao.RouteDao;
import com.khairul.model.Company;
import com.khairul.model.Fare;
import com.khairul.model.Flight;
import com.khairul.model.FlightPlan;
import com.khairul.model.FlightRequest;
import com.khairul.model.FlightSchedule;
import com.khairul.model.FlightType;
import com.khairul.model.PassengerType;
import com.khairul.model.Route;
import com.sun.management.VMOption.Origin;

@Repository("flightDaoAirAsia")
public class FlightDaoAirAsia implements FlightDao {
	
	@Autowired 
	@Qualifier("routeDaoAirAsia")
	RouteDao routeDao;

	@Override
	public FlightSchedule getSchedule(FlightRequest request) {
		return getAirAsia(request);
	}

	@Override
	public List<Flight> getSchedule(Route origin, Route destination, String depart, String arrive) {
		// TODO Auto-generated method stub
		return null;
	}
	
	private FlightSchedule getAirAsia(FlightRequest request){
		
		FlightSchedule schedule = new FlightSchedule();
		List<Flight> flights = new ArrayList<Flight>();
		List<Flight> departs = new ArrayList<Flight>();
		List<Flight> returns = new ArrayList<Flight>();
		
		Document selectPageDocument = getSelectDocument(request);
		Elements tables = selectPageDocument.getElementsByClass("rgMasterTable");
		
		if(tables==null || tables.size()==0) return null;
		
		flights.addAll(getFlights(tables.get(0),request,0));
		
		if(request.isRoundTrip() && tables.size()==2){
			flights.addAll(getFlights(tables.get(1),request,1));
		}
		
		for(Flight fl : flights){
			if(fl.getFlightPlan() == FlightPlan.departs) departs.add(fl);
			else if(fl.getFlightPlan() == FlightPlan.returns) returns.add(fl);
		}
		
		schedule.setDeparts(departs);
		schedule.setReturns(returns);
		
		return schedule;
	}
	
	/**
	 * 
	 * @param table (ex: <table>
	 * 						<tr class="rgRow">
	 * 							<td>
	 * 								<div class="segmentStation"></div>
	 * 								<div class="scheduleFlightNumber"></div>
	 * 							</td>
	 * 							<td class="resultFareCell2"></td>
	 * 							<td class="resultFareCell2"></td> 							
	 * 						</tr>
	 * 					 </table>)
	 *         request : form input
	 *         idx : flag for checking table source (0 (depart) or 1 (return))
	 * @param request
	 * @return
	 */
	private List<Flight> getFlights(Element table,FlightRequest request, int idx){
		List<Flight> flights = new ArrayList<Flight>();
		Elements rgRow = table.getElementsByClass("rgRow"); //<tr class="rgRow">
		
//		String departDate = request.getDepartDate();
//		String returnDate = request.getReturnDate();

//		boolean useIdx = departDate.equals(returnDate)==true?true:false;
		
		Route origin = request.getFlight().getOrigin();
		Route dest = request.getFlight().getDestination();
		
		for(Element tr : rgRow){
			Element segmentStation = tr.getElementsByClass("segmentStation").first();
			Element scheduleFlight = tr.getElementsByClass("scheduleFlight").first();
			Elements resultFareCell2 = tr.getElementsByClass("resultFareCell2");
			
			FlightPlan plan=null;
			String[] data = getData(scheduleFlight);
			Flight fInfo = getFlightInfo(segmentStation);
			fInfo.setFlightNumber(data[0]);
			fInfo.setEstimatedTime(data[2]);
			fInfo.setCompany(Company.airasia.name());
			
			if(origin.getCode().equals(fInfo.getOrigin().getCode())) plan = FlightPlan.departs;
			else if(dest.getCode().equals(fInfo.getOrigin().getCode())) plan = FlightPlan.returns;
			
//			if(useIdx){
//				if(idx==0) plan = FlightPlan.departs;
//				else plan = FlightPlan.returns;
//			}
//			else{
//				if(departDate.equals(formatAirasiaDate(fInfo.getDepartDate()))) plan = FlightPlan.departs;
//				else if(returnDate.equals(formatAirasiaDate(fInfo.getDepartDate()))) plan = FlightPlan.returns;
//			}
			
			fInfo.setFlightPlan(plan);
			
			List<Fare> faresLow = getFares(resultFareCell2.get(0));
			List<Fare> faresHight = getFares(resultFareCell2.get(1));
			
			Flight flightLow = new Flight();
			flightLow.copy(fInfo);
			flightLow.setFares(faresLow);
			flightLow.setTypeE(FlightType.LOW);
			
			Flight flightHight = new Flight();
			flightHight.copy(fInfo);
			flightHight.setFares(faresHight);
			flightHight.setTypeE(FlightType.HIGH);
			
			flights.add(flightLow);
			flights.add(flightHight);
		}
		
		return flights;
	}
	
	/**
	 * 
	 * @param airasiaDate yyyy/MM/dd (ex: 2013/11/20)
	 * @return dd/MM/yyyy (ex:20/11/2013)
	 */
	private String formatAirasiaDate(String airasiaDate) {
		String[] temp = airasiaDate.split("/");
		
		if(temp==null || temp.length<3) return "";
		
		return temp[2]+"/"+temp[1]+"/"+temp[0];
	}

	/**
	 * 
	 * @param td (ex: <div class="paxTypeDisplay">Adult</div>
                      <div class="price"><span>1,774,900 IDR<div></div></span></div>
                      <div class="clearAll"></div>
                      <div class="paxTypeDisplay">Kid</div>
                      <div class="price"><span>1,774,900 IDR<div></div></span></div>
                      <div class="clearAll"></div>
                      <div class="bold">Infant</div>
                      <div class="price"><span>150,000 IDR</span></div>
                      <div class="clearAll"></div>
                  )
	 * @return
	 */
	private List<Fare> getFares(Element td) {
		List<Fare> fares = new ArrayList<Fare>();
		
		Elements prices = td.getElementsByClass("price");
		Elements paxTypeDisplay = td.getElementsByClass("paxTypeDisplay");
		Elements bold = td.getElementsByClass("bold");
		
		int countType = paxTypeDisplay.size();
		
		for(int i=0; i<countType; i++){
			
			String[] priceCurr = getPriceCurrency(prices.get(i).text());
			PassengerType type = PassengerType.getType(paxTypeDisplay.get(i).text()); 
			double price = Double.valueOf(priceCurr[0]);
			
			Fare fare = new Fare();
			fare.setPrice(price);
			fare.setCurrency(priceCurr[1]);
			fare.setType(type);
			
			fares.add(fare);
		}
		
		if(prices.size()-paxTypeDisplay.size()==1){ //check if passenger have infant
			int lastIdx = prices.size()-1;
			PassengerType type = PassengerType.getType(bold.get(0).text());
			String[] priceCurr = getPriceCurrency(prices.get(lastIdx).text());
			double price = Double.valueOf(priceCurr[0]);
			
			Fare fare = new Fare();
			fare.setPrice(price);
			fare.setCurrency(priceCurr[1]);
			fare.setType(type);
			
			fares.add(fare);
		}
		
		return fares;
	}

	/**
	 * 
	 * @param div (ex:  <p>
							<span class="hidden" id="UTCTIME">0340</span>
							<span class="hidden" id="UTCDATE">2013/11/18</span>
							1040 (CGK)
						</p>
						<p>
							<span class="hidden" id="UTCTIME">0605</span>
							<span class="hidden" id="UTCDATE">2013/11/18</span>
							1305 (KNO)
						</p>
				)
	 * @return Flight
	 */
	private Flight getFlightInfo(Element div) {
		Elements pTag = div.getElementsByTag("p");
		
		Flight flight = new Flight();
		
		Element p = pTag.get(0);
		String text = null;
		String[] data = null;
		Route origin = null;
		Route destination = null;
		
		flight.setDepartDate(p.getElementById("UTCDATE").text());
		p.select("span").remove();
		text = p.text();
		text = text.replace("(", "").replace(")", "");
		data = text.split(" ");
		origin = routeDao.getByCode(data[1]);
		
		flight.setDepartTime(data[0]);
		flight.setOrigin(origin);
		
		p = pTag.get(1);
		flight.setArriveDate(p.getElementById("UTCDATE").text());
		p.select("span").remove();
		text = p.text();
		text = text.replace("(", "").replace(")", "");
		data = text.split(" ");
		destination = routeDao.getByCode(data[1]);
		
		flight.setArriveTime(data[0]);
		flight.setDestination(destination);
		
		return flight;
	}


	/**
	 * 
	 * @param content (ex: <span>663,900 IDR<div></div></span>)
	 * @return String[] (ex: String temp = {"900000","IDR"}
	 */
	private String[] getPriceCurrency(String content) {
		String temp = content.replace("<span>","").replace("</span>", "").replace("<div></div>","").replace(",","");
		return temp.split(" ");
	}

	/**
	 * 
	 * @param div (ex: " <p></p> 
	 *					<div onmouseout="javascript:SKYSALES.tooltip.hide();" <br/>
							 onmouseover="javascript:SKYSALES.tooltip.show('<b>QZ 8095</b><br/>1450(CGK) - 1715(KNO)<br/>Estimated flight time: 2 hours 25 minutes','250');"
							 class="hotspot">
							 <span class="QZ-icon iconml50"></span>
					    </div>"
					    <p></p> 
 				  )
	 * @return String[] (ex: String[] str = {"QZ 8095","1040(CGK) - 1305(KNO)","2 hours 25 minutes}")
	 */
	private String[] getData(Element div) {
		Elements hotspot = div.getElementsByClass("hotspot");
		Element hotspot1 = hotspot.get(0);
		
		String onmouseover = hotspot1.attr("onmouseover");
		String replace = null;
		
		if(onmouseover.split("Estimated flight time").length == 2){
			replace = onmouseover.replace("javascript:SKYSALES.tooltip.show('<b>", "")
								 .replace("</b><br/>", ",")
								 .replace("<br/>Estimated flight time: ", ",")
								 .replace("','250');","");
		}
		else replace="";
		
		return  replace.split(",");
	}

	private Document getSelectDocument(FlightRequest request){
		String url = "http://booking.airasia.com/Search.aspx";
		Document doc = null;
		try {

			Flight flight = request.getFlight();
			String structure = request.isRoundTrip()==true?"RoundTrip":"OneWay";
			String origin = flight.getOrigin().getCode();
			String destination = flight.getDestination().getCode();
			String currency = "default";
			String day1 = getDay(request.getDepartDate());
			String month1 = getYearMonth(request.getDepartDate());
			
			String day2="";
			String month2="";
			
			if(request.isRoundTrip()){
				day2 = getDay(request.getReturnDate());
				month2 = getYearMonth(request.getReturnDate());
			}
			
			String adt = request.getAdult()+"";
			String chd = request.getChild()+"";
			String infant = request.getInfant()+"";
			String searchBy = "columnView";
			String viewState = getViewState();
			String timeZone = getTimeZone();
			
			Map<String, String> data = new HashMap<String, String>();
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$RadioButtonMarketStructure",structure);
			data.put("ControlGroupSearchView_AvailabilitySearchInputSearchVieworiginStation1",origin);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketOrigin1",origin);
			data.put("ControlGroupSearchView_AvailabilitySearchInputSearchViewdestinationStation1",destination);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketDestination1",destination);
			data.put("ControlGroupSearchView$MultiCurrencyConversionViewSearchView$DropDownListCurrency",currency);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListMarketDay1",day1);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListMarketMonth1",month1);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListMarketDay2",day2);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListMarketMonth2",month2);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_ADT",adt);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_CHD",chd);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_INFANT",infant);
			data.put("ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListSearchBy",searchBy);
			data.put("ControlGroupSearchView$ButtonSubmit","Search");
			data.put("pageToken","");
			data.put("MemberLoginSearchView$HFTimeZone",timeZone);
			data.put("__VIEWSTATE",viewState);
			
			if(request.isRoundTrip()){
				data.put("oneWayOnly","1");
			}
			
			doc = Jsoup.connect(url).data(data).post();
			
			return doc;
		
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	private String getTimeZone() {
		return "420";
	}

	private String getViewState() {
		return "/wEPDwUBMGRktapVDbdzjtpmxtfJuRZPDMU9XYk=";
	}

	private String getYearMonth(String departDate) {
		String[] str = departDate.split("/");
		
		return str[2]+"-"+str[1];
	}

	private String getDay(String strDate){
		String[] str = strDate.split("/");
		return str[0];
	}
		
	private FlightSchedule getDummy(FlightRequest request){
		FlightSchedule schedule = new FlightSchedule();
		List<Flight> flights = new ArrayList<Flight>();

		Flight req = request.getFlight();
		Route origin = req.getOrigin();
		Route destination = req.getDestination();
		
		
		Fare fare = new Fare(509900, PassengerType.Adult);
		List<Fare> fares = new ArrayList<Fare>();
		fares.add(fare);
		
		origin.setName("Jakarta");
		destination.setName("Medan");
		
		Flight flight = new Flight();
		flight.setOrigin(origin);
		flight.setDestination(destination);
		flight.setDepartDate(req.getDepartDate());
		flight.setArriveDate(req.getArriveDate());
		flight.setFares(fares);
		flight.setEstimatedTime("2 jam 15 menit");
		flight.setCompany(Company.airasia.name());
		
		Flight flight2 = new Flight();
		flight2.setOrigin(origin);
		flight2.setDestination(destination);
		flight2.setDepartDate(req.getDepartDate());
		flight2.setArriveDate(req.getArriveDate());
		flight2.setFares(fares);
		flight2.setEstimatedTime("2 jam 25 menit");
		flight2.setCompany(Company.airasia.name());
		
		flights.add(flight);
		flights.add(flight2);
		
		schedule.setDeparts(flights);
		
		return schedule;
	}

}
