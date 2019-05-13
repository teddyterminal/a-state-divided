/*  The starter code for this visualization brought to you by Michelle Chandra */
var height = 500
var width = 960	
var scale = 1

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Define linear scale for output
var colorp = d3.scaleLinear()
			  .range(["rgb(255, 0, 0)", "rgb(0, 0, 255)"]);

// Define linear scale for output
var colorr = d3.scaleLinear()
			  .range(["rgb(20, 90, 0)", "rgb(230, 255, 230)"]);

//Create SVG element and append map to the SVG
var svg = d3.select("#map")
			.append("svg")
			.attr("height", height)
			.attr("width", width)

// Append Div for tooltip to SVG
var div = d3.select("#map")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

var de = []
var fe = []
for (i = 1; i < 101; i++)
{
	de.push("PA/" + i + "/districts.json")
	fe.push("PA/" + i + "/features.csv")
}

d2018 = "PA/d18/districts.json"
f2018 = "PA/d18/features.csv"
p2018 = "REMEDIAL_P"

d2011 = "PA/d11/districts.json"
f2011 = "PA/d11/features.csv"
p2011 = "DIST_2011"

dd538 = "PA/d538/districts.json"
fd538 = "PA/d538/features.csv"
pd538 = "DEM_538"

dr538 = "PA/r538/districts.json"
fr538 = "PA/r538/features.csv"
pr538 = "GOP_538"

dc538 = "PA/cs538/districts.json"
fc538 = "PA/cs538/features.csv"
pc538 = "CPCT_538"

dg8 = "PA/g8/districts.json"
fg8 = "PA/g8/features.csv"
pg8 = "GRADE_8"

dc = d2018
fc = f2018
pc = p2018

d3.select("#d2011").on("click", function() {dc = d2011; fc = f2011; pc = p2011; update(dc, fc, pc); }); 
d3.select("#d2018").on("click", function() {dc = d2018; fc = f2018; pc = p2018; update(dc, fc, pc); }); 
d3.select("#dd538").on("click", function() {dc = dd538; fc = fd538; pc = pd538; update(dc, fc, pc); }); 
d3.select("#dr538").on("click", function() {dc = dr538; fc = fr538; pc = pr538; update(dc, fc, pc); }); 
d3.select("#dc538").on("click", function() {dc = dc538; fc = fc538; pc = pc538; update(dc, fc, pc); }); 
d3.select("#dg8").on("click", function() {dc = dg8; fc = fg8; pc = pg8; update(dc, fc, pc); }); 
d3.select("#explore").on("click", function() 
{
	index = Math.floor(Math.random()*de.length)
	dc = de[index]; 
	fc = fe[index]; 
	pc = "CD"; 
	update(dc, fc, pc); 
}); 


var flag = "Politics"

// Load GeoJSON data and merge with states data
d3.json(dc).then(async function(json) 
{
		
	var center = d3.geoCentroid(json)
	var scale  = 150;
	var offset = [width/2, height/2];
	var projection = d3.geoMercator().scale(scale).center(center)
		.translate(offset);

	// create the path
	var path = d3.geoPath().projection(projection);

	// using the path determine the bounds of the current map and use 
	// these to determine better values for the scale and translation
	var bounds  = path.bounds(json);
	var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
	var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
	var scale   = (hscale < vscale) ? hscale : vscale;
	var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
	                height - (bounds[0][1] + bounds[1][1])/2];

	// new projection
	projection = d3.geoMercator().center(center)
		.scale(scale).translate(offset);
	path = path.projection(projection);

	var feat = await d3.csv(fc)

	// Bind the data to the SVG and create one path per GeoJSON feature
	var map = svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.style("fill", function(d) 
		{
			return getRandomColor(); 
		})
		.on("mouseover", function(d) 
		{
			var district = d.properties[pc];
			div.transition()
				.duration(200)
				.style("opacity", 0.95); 
			div.html("<br/> Pop: " + Math.round(feat[district-1]["Population"]))	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
		})
		.on("mouseout", function(d) 
		{       
	        div.transition()        
	           .duration(500)      
	           .style("opacity", 0);   
	    });
	
	await d3.csv("pacities.csv").then(function(data) {

		svg.selectAll("circle")
		  .data(data)
		  .enter()
		  .append("circle")
		  .attr("cx", function(d) {
		    return projection([d.lon, d.lat])[0];
		  })
		  .attr("cy", function(d) 
		  {
		    return projection([d.lon, d.lat])[1];
		  })
		  .attr("r", 3)
		  .style("fill", "#000000")
		  .text(function(d){return d.place;});


		svg.selectAll("text")
		       .data(data)
		       .enter()
		       .append("text")
		       // Add your code below this line
		       .text((d) => d.place)
		       .attr("x", function(d) {
		          q = projection([d.lon, d.lat])[0];
		          return q + 5
		        })
		       .style("fill", "#000000")
		       .style("font-size", "12px")
		       .style("stroke", "#FFFFFF")
		       .style("stroke-width", "1px")
		       .attr("y",   function(d){
		    return projection([d.lon, d.lat])[1]+10;
		  });

	d3.select("#text-explainer")
		.html(function(d)
		{
			str = "<font size = '5px'> Pennsylvania has <strong> 18 </strong> congressional districts and <strong> 20 </strong> electoral votes. Click the" + 
				  "<font color = 'purple'> <strong> politics </strong> </font> button to see the political breakdown of the districts " +
				  "according to the result of the 2016 election. Click the <font color = '#009900'> <strong> race </strong> </font>" + 
				  "button to see the racial breakdown of each congressional district. The middle buttons reflect district lines, " + 
				  "both potential and actual, for Pennsylvania prior to the 2018 PA Supreme Court decision to overturn the 2011 lines. The Generate Random Map button will create" + 
				  " a random 18-district cut of the state of Pennsylvania and analyze it."

			return str 
		})
		   })
	function politics() 
	{
		flag = "Politics";
		// Bind the data to the SVG and create one path per GeoJSON feature
		map.transition()
			.delay(500).duration(1000)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) 
			{
				var district = d.properties[pc]
				var demShare = parseInt(feat[district-1]["Democratic"], 10)/
							  (parseInt(feat[district-1]["Democratic"], 10) + 
							   parseInt(feat[district-1]["Republican"], 10))

				if (demShare) {
					//If value exists…
					return colorp(demShare);
				} 
				else {
					//If value is undefined…
					return "rgb(213,222,217)";}
			}); 
		map.on("mouseover", function(d) 
		{
			var district = d.properties[pc]; 

			var demShare = parseInt(feat[district-1]["Democratic"], 10)/
						  (parseInt(feat[district-1]["Democratic"], 10) + 
						   parseInt(feat[district-1]["Republican"], 10) + 
						   parseInt(feat[district-1]["Other"], 10)); 

			var repShare = parseInt(feat[district-1]["Republican"], 10)/
			  			  (parseInt(feat[district-1]["Democratic"], 10) + 
			  			   parseInt(feat[district-1]["Republican"], 10) + 
			   		       parseInt(feat[district-1]["Other"], 10)); 

			var color = ""; 
			var win = ""; 
			var margin = 0; 

			if (repShare > demShare)
			{
				color = "#FF0000";
				win = "R";
				margin = repShare - demShare;
			}
			else
			{
				color = "#0000FF";
				win = "D";
				margin = demShare - repShare;
			}

			div.transition()
				.duration(200)
				.style("opacity", 0.95); 
			div.html("Clinton: " +  Math.round(demShare*10000)/100 + "<br/> Trump: " + 
					(Math.round(repShare*10000)/100) + 
						"<br/> <font color = '" + color + "'> <strong>" + 
						win + " +" + (Math.round(margin*100)))
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
		})
			.on("mouseout", function(d) 
			{       
		        div.transition()        
		           .duration(500)      
		           .style("opacity", 0);   
		    });
		    d3.select("#text-explainer").html(function(d)
		{
			demdist = 0;
			repdist = 0;
			repwv = 0;
			demwv = 0;
			totv = 0;
			for (i = 0; i < 18; i++)
			{
				r = parseInt(feat[i]["Republican"], 10)
				d = parseInt(feat[i]["Democratic"], 10)
				o = parseInt(feat[i]["Other"], 10)

				totv += d + r + o
				if (d < r)
				{
					repdist += 1; 
					demwv += d
					repwv += r - d
				}
				else 
				{
					demdist += 1
					demwv += d - r
					repwv += r
				}

			}

			effgap = Math.round((demwv - repwv)/totv*10000)/100
			r = "#FF0000"
			d = "#0000FF"
			ec = ""
			fav = ""

			if (effgap < 0)
			{
				ec = d
				fav = "Democrats"
			}
			else 
			{
				ec = r
				fav = "Republicans"
			}
			str = "<font size = '5px'> There are <strong> 18 </strong> congressional districts in Pennsylvania. <strong> <font color = " + r + "> " + 
				  repdist + " </font> </strong> of them are held by Republicans,  "; 
			str = str + "and <strong> <font color = " + d + "> " + demdist + " </font> </strong> of them are held by "; 
			str = str + " Democrats under this plan. The efficiency gap is <strong> <font color = " + ec + "> "; 
			str = str + Math.abs(effgap) + "% towards the " + fav + ". ";

			return str 
		})
		return map
	}

	function race() 
	{
		flag = "Race";
		// Bind the data to the SVG and create one path per GeoJSON feature
		map.transition()
			.delay(500).duration(1000)
			.style("stroke", "#000")
			.style("stroke-width", "1")
			.style("fill", function(d) 
			{
				var district = d.properties[pc]
				var whiteShare = parseInt(feat[district-1]["White"], 10)/
								 parseInt(feat[district-1]["Population"], 10)

				if (whiteShare) {
					//If value exists…
					return colorr(whiteShare);
				} 
				else {
					//If value is undefined…
					return "rgb(213,222,217)";
				}
			}); 
		
		map.on("mouseover", function(d) 
		{

			var district = d.properties[pc]; 

			var whiteShare = parseInt(feat[district-1]["White"], 10)/
							 parseInt(feat[district-1]["Population"], 10); 

			var color = "";
			var str = "";

			if (whiteShare > 0.5)
			{
				color = "#000000"; 
				str = "White";
			}
			else
			{
				color = "#009900";
				str = "Minority";
			}

			div.transition()
				.duration(200)
				.style("opacity", 0.95); 
			div.html(Math.round(whiteShare*10000)/100 + "% White" + 
						"<br/> Pop: " + Math.round(feat[district-1]["Population"]) +  
						"<br/> <font color = '" + color + "'> <strong>" + 
						"Majority " + str)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
		})
			.on("mouseout", function(d) 
			{       
		        div.transition()        
		           .duration(500)      
		           .style("opacity", 0);   
			});

			d3.select("#text-explainer")
		.html(function(d)
		{
			white = 0 
			tot = 0
			majmin = 0
			for (i = 0; i < 18; i++)
			{
				t = parseInt(feat[i]["Population"], 10)
				w = parseInt(feat[i]["White"], 10)

				tot += t
				white += w
				if (w/t < 0.5)
					majmin += 1

			}

			c1 = "#000000"
			r = "#009900"
			w1 = ""
			w2 = ""

			if (majmin == 1)
			{
				w1 = "is"
				w2 = "district"
			}
			else 
			{
				w1 = "are"
				w2 = "districts"
			}
			str = "<font size = '5px'> Pennsylbania is <strong> " + Math.round(white/tot*10000)/100 + "</strong>% White. "; 
			str = str + "There " + w1 + " <strong> <font color = " + r + ">" + majmin + " majority-minority " + w2; 
			str = str + " under this plan.";

			return str 
		})	
	}


	d3.select("#Politics").on("click", function() {politics(); }); 
	d3.select("#Race").on("click", function() {race(); }); 

});

function update(dc, fc, pc)
{
	// Load GeoJSON data and merge with states data
	d3.json(dc).then(async function(json) 
	{
		var center = d3.geoCentroid(json)
		var scale  = 150;
		var offset = [width/2, height/2];
		var projection = d3.geoMercator().scale(scale).center(center)
			.translate(offset);

		// create the path
		var path = d3.geoPath().projection(projection);

		// using the path determine the bounds of the current map and use 
		// these to determine better values for the scale and translation
		var bounds  = path.bounds(json);
		var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
		var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
		var scale   = (hscale < vscale) ? hscale : vscale;
		var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
		                height - (bounds[0][1] + bounds[1][1])/2];

		// new projection
		projection = d3.geoMercator().center(center)
			.scale(scale).translate(offset);
		path = path.projection(projection);

		var feat = await d3.csv(fc)
		svg.attr("d", path)
		// Bind the data to the SVG and create one path per GeoJSON feature

		var map = svg.selectAll("path").data(json.features); 
		if (flag == "Politics")
			politics();
		else
			race(); 
		
		function politics() 
		{
			flag = "Politics"; 
			// Bind the data to the SVG and create one path per GeoJSON feature
			map.transition()
				.delay(500).duration(1000)
				.attr("d", path)
				.style("stroke", "#fff")
				.style("stroke-width", "1")
				.style("fill", function(d) 
				{
					var district = d.properties[pc]

					var demShare = parseInt(feat[district-1]["Democratic"], 10)/
								  (parseInt(feat[district-1]["Democratic"], 10) + 
								   parseInt(feat[district-1]["Republican"], 10))

					if (demShare) {
						//If value exists…
						return colorp(demShare);
					} 
					else {
						//If value is undefined…
						return "rgb(213,222,217)";}
				}); 
			map.on("mouseover", function(d) 
			{
				var district = d.properties[pc]; 

				var demShare = parseInt(feat[district-1]["Democratic"], 10)/
							  (parseInt(feat[district-1]["Democratic"], 10) + 
							   parseInt(feat[district-1]["Republican"], 10) + 
							   parseInt(feat[district-1]["Other"], 10)); 

				var repShare = parseInt(feat[district-1]["Republican"], 10)/
				  			  (parseInt(feat[district-1]["Democratic"], 10) + 
				  			   parseInt(feat[district-1]["Republican"], 10) + 
				   		       parseInt(feat[district-1]["Other"], 10)); 

				var color = ""; 
				var win = ""; 
				var margin = 0; 

				if (repShare > demShare)
				{
					color = "#FF0000";
					win = "R";
					margin = repShare - demShare;
				}
				else
				{
					color = "#0000FF";
					win = "D";
					margin = demShare - repShare;
				}

				div.transition()
					.duration(200)
					.style("opacity", 0.95); 
				div.html("Clinton: " +  Math.round(demShare*10000)/100 + "<br/> Trump: " + 
						(Math.round(repShare*10000)/100 + 
							"<br/> <font color = '" + color + "'> <strong>" + 
							win + " +" + (Math.round(margin*100))))	
	                .style("left", (d3.event.pageX) + "px")		
	                .style("top", (d3.event.pageY - 28) + "px");	
			})
				.on("mouseout", function(d) 
				{       
			        div.transition()        
			           .duration(500)      
			           .style("opacity", 0);   
			    });

				    d3.select("#text-explainer").html(function(d)
		{
			demdist = 0;
			repdist = 0;
			repwv = 0;
			demwv = 0;
			totv = 0;
			for (i = 0; i < 18; i++)
			{
				r = parseInt(feat[i]["Republican"], 10)
				d = parseInt(feat[i]["Democratic"], 10)
				o = parseInt(feat[i]["Other"], 10)

				totv += d + r + o
				if (d < r)
				{
					repdist += 1; 
					demwv += d
					repwv += r - d
				}
				else 
				{
					demdist += 1
					demwv += d - r
					repwv += r
				}

			}

			effgap = Math.round((demwv - repwv)/totv*10000)/100
			r = "#FF0000"
			d = "#0000FF"
			ec = ""
			fav = ""

			if (effgap < 0)
			{
				ec = d
				fav = "Democrats"
			}
			else 
			{
				ec = r
				fav = "Republicans"
			}
			str = "<font size = '5px'> There are <strong> 18 </strong> congressional districts in Pennsylvania. <strong> <font color = " + r + "> " + 
				  repdist + " </font> </strong> of them are held by Republicans,  "; 
			str = str + "and <strong> <font color = " + d + "> " + demdist + " </font> </strong> of them are held by "; 
			str = str + " Democrats under this plan. The efficiency gap is <strong> <font color = " + ec + "> "; 
			str = str + Math.abs(effgap) + "% towards the " + fav + ". ";

			return str 
		})
			return map
		}

		function race() 
		{
			flag = "Race"; 
			// Bind the data to the SVG and create one path per GeoJSON feature
			map.transition()
				.delay(500).duration(1000)
				.attr("d", path)
				.style("stroke", "#000")
				.style("stroke-width", "1")
				.style("fill", function(d) 
				{
					
					var district = d.properties[pc]
					var whiteShare = parseInt(feat[district-1]["White"], 10)/
									 parseInt(feat[district-1]["Population"], 10)

					if (whiteShare) {
						//If value exists…
						return colorr(whiteShare);
					} 
					else {
						//If value is undefined…
						return "rgb(213,222,217)";
					}
				}); 
			
			map.on("mouseover", function(d) 
			{

				var district = d.properties[pc]; 

				var whiteShare = parseInt(feat[district-1]["White"], 10)/
								 parseInt(feat[district-1]["Population"], 10); 

				var color = "";
				var str = "";

				if (whiteShare > 0.5)
				{
					color = "#000000"; 
					str = "White";
				}
				else
				{
					color = "#009900";
					str = "Minority";
				}

				div.transition()
					.duration(200)
					.style("opacity", 0.95); 
				div.html(Math.round(whiteShare*10000)/100 + "% White" +
							"<br/> Pop: " + Math.round(feat[district-1]["Population"]) +  
							"<br/> <font color = '" + color + "'> <strong>" + 
							"Majority " + str)	
	                .style("left", (d3.event.pageX) + "px")		
	                .style("top", (d3.event.pageY - 28) + "px");	
			})
				.on("mouseout", function(d) 
				{       
			        div.transition()        
			           .duration(500)      
			           .style("opacity", 0);   
				});
		d3.select("#text-explainer")
		.html(function(d)
		{
			white = 0 
			tot = 0
			majmin = 0
			for (i = 0; i < 18; i++)
			{
				t = parseInt(feat[i]["Population"], 10)
				w = parseInt(feat[i]["White"], 10)

				tot += t
				white += w
				if (w/t < 0.5)
					majmin += 1

			}

			c1 = "#000000"
			r = "#009900"
			w1 = ""
			w2 = ""

			if (majmin == 1)
			{
				w1 = "is"
				w2 = "district"
			}
			else 
			{
				w1 = "are"
				w2 = "districts"
			}
			str = "<font size = '5px'> Pennsylbania is <strong> " + Math.round(white/tot*10000)/100 + "</strong>% White. "; 
			str = str + "There " + w1 + " <strong> <font color = " + r + ">" + majmin + " majority-minority " + w2; 
			str = str + " under this plan.";

			return str 
		})
			
		}


		d3.select("#Politics").on("click", function() {politics(); }); 
		d3.select("#Race").on("click", function() {race(); }); 

	});
}