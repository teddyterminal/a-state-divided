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

var text = d3.select("#map")
		    .append("div")   
    		.attr("class", "text")               
    		.style("opacity", 0);

var de = []
var fe = []
for (i = 1; i < 101; i++)
{
	de.push("IA/" + i + "/districts.json")
	fe.push("IA/" + i + "/features.csv")
}

d16 = "IA/dc/districts.json"
f16 = "IA/dc/features.csv"
p16 = "CD"

dc = d16
fc = f16
pc = p16

d3.select("#dc").on("click", function() {dc = d16; fc = f16; pc = p16; update(dc, fc, pc); }); 
d3.select("#explore").on("click", function() 
{
	index = Math.floor(Math.random()*de.length)
	dc = de[index]; 
	fc = fe[index]; 
	pc = "CD"; 
	console.log(dc, fc, pc)
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

	 d3.select("text-explainer")
		.text(function(d)
		{
			demdist = 0;
			repdist = 0;
			repwv = 0;
			demwv = 0;
			totv = 0
			console.log("hi"); 
			for (i = 0; i < 4; i++)
			{
				totv += feat[i]["Republican"] + feat[i]["Democratic"] + feat[i]["Other"]
				if (feat[i]["Democratic"] < feat[i]["Republican"])
				{
					repdist += 1; 
					demwv += feat[i]["Democratic"]
					repwv += feat[i]["Republican"] - feat[i]["Democratic"]
				}
				else 
				{
					demwv += feat[i]["Democratic"] - feat[i]["Republican"]
					repwv += feat[i]["Republican"] 
				}

			}

			effgap = Math.round((demwv - repwv)/totv*10000/100)

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
			str = "There are <strong> <font color = " + r + "> " + repdist + " </font> </strong> Republican "; 
			str = str + "and <strong <font color = " + d + "> " + demdist + " </font> </strong> Democratic "; 
			str = str + " districts under this plan. The efficiency gap is <strong> <font color = " + ec + "> "; 
			str = str + effgap + " towards the " + fav + ". ";

			return str 
		})

	await d3.csv("iacities.csv").then(function(data) {

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
		    return projection([d.lon, d.lat])[1];
		  });
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
		console.log(feat)
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

			
		}


		d3.select("#Politics").on("click", function() {politics(); }); 
		d3.select("#Race").on("click", function() {race(); }); 

	});
}