# A State, Divided

Rishabh Chandra 

The application is available at [https://github.mit.edu/pages/6894-sp19/A-State--Divided](https://github.mit.edu/pages/6894-sp19/A-State--Divided). 

The presentation video is available [here](https://youtu.be/SGclzpQB_AQ).

The final paper is available [here](final/Final_Paper.pdf). 

## Process of Development
The primary goal throughout was to develop a system that tackles the issue of gerrymandering in a way that combined the visual and research-minded approaches. On one end of the spectrum is a project like fivethirtyeight.com's [Atlas of Redistricting](https://projects.fivethirtyeight.com/redistricting-maps/). This is a project that offers a tremendous amount of insight into what a gerrymander is, how individual communities are affected, and how certain plans for states differ from each other. On the other end are projects like my UROP project currently, which focus on the mathematics of redistricting and indeed the graph theory and complex statistical knowledge needed to understand the data. These projects care little about individual plans, and instead are looking for summary statistics. 

The middle ground, then, is a project that shows off the art of a new districting map while simultaneously drawing heavily from the statistical gravitas associated with cutting edge research at MGGG. To this end my original target was to develop a module that could - live - communicate with a python engine, generate a new districting plan, and reupload. Unfortunately, in the current world this takes too much time. Loading a shapefile in and of itself often takes a minute, and it would be far worse to modify one. 

Instead, I decided to do the next best thing, and absolutely *drowned* the project in data. There are shapefiles for over 10 states, with reasonably accurate data for voting precincts, as well as electoral data for 2016 and earlier in most cases. *If we can't make the plans live, we will do them ahead of time.* 

MGGG generates its congressional districting plans using Markov Chain Monte Carlo, essentially intiating a random walk through the space of all possible redistricting plans. I ran 1000 steps of the Markov Chain for each state in this project (Iowa, Georgia, and Pennsylvania), and stored every tenth one as a shapefile. That is a total of more than 300 plans in the dataset, each of which can be analyzed for both political and racial data. 

It is a future goal of mine to implement the server-based system, but honestly the overhead is just too much right now. I want to be able to add more to this project in the summer, however. 

## Personal Commentary on the Project

This was a *tough* dataset. It is extremely unforgiving, since most of the data is new, uncleaned, and therefore prone to errors. A single mistake in a 10000-node plot destroys the entire file. There were multiple states that I would have loved to use in this study; Texas, North Carolina and Ohio come to mind. However, a few precincts were off in their shapefiles, so it became impossible to use them. 

There were many moments that I had to make judgement calls on what was the best path to take. Apart from actually connecting the visualization to a backend processor, I considered using data from multiple elections, having roads and maps underneath the districts, having the ability to zoom a la google maps, and showing the districts in order of partisanship on a chart. I rejected all of these ideas for time and complexity constraints, and eventually decided that a simple, clean, and correct aesthetic would be the winning one. 

It was not my original intention to be alone for the final project, and the data being complicated made it that much more difficult. That said, I essentially learned a new language in about two weeks doing this, and am really glad that I was able to put out something substantial and pretty, especially given that I started late. 

Special thanks should go to Daryl Deford, postdoc at MGGG and my UROP advisor. In addition, I did a lot of blo.cks tutorials and reused code snippets in development for this - credit should go to Michelle Chandra and her [map of states](http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922) which helped me get started. Also thanks to Mike Bostock and many of his visualizations which helped me with code snippets. A few pieces of code were derived from answers on Stack Overflow. 