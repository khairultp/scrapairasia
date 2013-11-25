package com.khairul.controller;

import java.util.List;

import javax.annotation.Resource;
 
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.ModelAndView;

import com.khairul.model.Flight;
import com.khairul.model.FlightSchedule;
import com.khairul.model.Route;
import com.khairul.model.ui.FlightUI;
import com.khairul.service.FlightService;
import com.khairul.service.RouteService;

@SessionAttributes
@Controller
@RequestMapping(value="/flight")
public class FlightController {

	@Resource(name = "flightService")
	private FlightService flightService;
	
	@Resource(name = "routeService")
	private RouteService routeService;
	
	@RequestMapping(value="", method=RequestMethod.GET)
	public ModelAndView index(){
		return new ModelAndView("flight/index");
	}
	
	@RequestMapping(value="/search", method=RequestMethod.GET)
	public ModelAndView initForm(){
		Flight flight = new Flight();
		
		FlightUI flightUI = new FlightUI();
		flightUI.setFlight(flight);
		flightUI.setRoundTrip(true);
	
		return new ModelAndView("flight/search","flightUI",flightUI);
	}
	
	@RequestMapping(value="/search",method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public FlightSchedule select(@ModelAttribute("flightUI") FlightUI flightUI, BindingResult result, SessionStatus session){
		
		System.out.println("Origin:" + flightUI.getFlight().getOrigin() + 
                           " | Destination: " + flightUI.getFlight().getDestination());
		
		
		FlightSchedule schedule = flightService.getSchedule(flightUI);
		System.out.println("done---------");
		return schedule;
	}
	
	@ModelAttribute("routes")
	public List<Route> routesList(){
		return routeService.getRoutes();
	}

	private Route getFormatRoute(Route route){
		String temp[] = route.getCode().split(",");
		route.setCode(temp[0]);
		route.setName(temp[1]);
		return route;
	}
}
