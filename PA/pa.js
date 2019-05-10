/*  The starter code for this visualization brought to you by Michelle Chandra */
var height = 500
var width = 960	
var scale = 1


// Define linear scale for output
var colorp = d3.scaleLinear()
			  .range(["rgb(255, 0, 0)", "rgb(0, 0, 255)"]);

// Define linear scale for output
var colorr = d3.scaleLinear()
			  .range(["rgb(50, 30, 0)", "rgb(255, 255, 230)"]);

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("height", height)
			.attr("width", width)
        
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);


// Load GeoJSON data and merge with states data
d3.json("PA/d18/districts.json").then(async function(json) 
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


	var feat = await d3.csv("PA/d18/features.csv")

	function politics() 
	{

		// Bind the data to the SVG and create one path per GeoJSON feature
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) 
			{
				var district = d.properties.REMEDIAL_P

				var demShare = parseInt(feat[district-1]["Democratic"], 10)/
							  (parseInt(feat[district-1]["Democratic"], 10) + 
							   parseInt(feat[district-1]["Republican"], 10))
				console.log(district)
				console.log(demShare)

				if (demShare) {
					//If value exists…
					return colorp(demShare);
				} 
				else {
					//If value is undefined…
					return "rgb(213,222,217)";}
			})
			.on("mouseover", function(d) 
			{
				var district = d.properties.REMEDIAL_P

				var demShare = parseInt(feat[district-1]["Democratic"], 10)/
							  (parseInt(feat[district-1]["Democratic"], 10) + 
							   parseInt(feat[district-1]["Republican"], 10))

				div.transition()
					.duration(200)
					.style("opacity", 0.95); 
				div.text("Clinton 2-Party Share, 2016: " +  Math.round(demShare*10000)/100);
			})
			.on("mouseout", function(d) 
			{       
		        div.transition()        
		           .duration(500)      
		           .style("opacity", 0);   
		    });
	}

	function race() 
	{
		// Bind the data to the SVG and create one path per GeoJSON feature
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#000")
			.style("stroke-width", "1")
			.style("fill", function(d) {
			var district = d.properties.REMEDIAL_P

			var whiteShare = parseInt(feat[district-1]["White"], 10)/
							 parseInt(feat[district-1]["Population"], 10)
			console.log(district)
			console.log(whiteShare)

			if (whiteShare) {
			//If value exists…
			return colorr(whiteShare);

			} else {
			//If value is undefined…
			return "rgb(213,222,217)";
			}})
			.on("mouseover", function(d) {

				var district = d.properties.REMEDIAL_P

				var whiteShare = parseInt(feat[district-1]["White"], 10)/
								 parseInt(feat[district-1]["Population"], 10)


				div.transition()
					.duration(200)
					.style("opacity", 0.95); 
				div.text("White Population, 2016: " +  Math.round(whiteShare*10000)/100);
			})
			.on("mouseout", function(d) {       
		        div.transition()        
		           .duration(500)      
		           .style("opacity", 0);   
		    });

		
	}
	politics()
});



