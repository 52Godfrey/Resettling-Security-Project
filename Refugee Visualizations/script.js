function init() {

  d3.csv("countries.csv").then(function (countries_data) {
    console.log(countries_data);
    createBubbleChart(countries_data, continentnames);
  });
}

function createBubbleChart(countries, continentNames) {
  var populations = countries.map(function (country) { return +country.Population; });
  var populationExtent = d3.extent(populations),
    populationScaleX,
    populationScaleY;
///Bubble Definition/Color
  var continents = d3.set(countries.map(function (country) { return country.ContinentCode; }));
  var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(continents.values());
  ///Define circle size
  var width = 1200,
    height = 800;
  var svg,
    circles,
    circleSize = { min: 10, max: 80 };
  var circleRadiusScale = d3.scaleSqrt()
    .domain(populationExtent)
    .range([circleSize.min, circleSize.max]);
  ///Define forces
  var forces,
    forceSimulation;
  ///Definitions
  createSVG();
  toggleContinentKey(!flagFill());
  createCircles();
  createForces();
  createForceSimulation();
  addFlagDefinitions();
  addFillListener();
  addGroupingListeners();
  ///Bubble Chart
  function createSVG() {
    svg = d3.select("#bubble-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  ///Continent Continent Key at bottom of chart
  function toggleContinentKey(showContinentKey) {
    var keyElementWidth = 150,
      keyElementHeight = 30;
    var onScreenYOffset = keyElementHeight * 1.5,
      offScreenYOffset = 100;

    if (d3.select(".continent-key").empty()) {
      createContinentKey();
    }
    var continentKey = d3.select(".continent-key");

    if (showContinentKey) {
      translateContinentKey("translate(0," + (height - onScreenYOffset) + ")");
    } else {
      translateContinentKey("translate(0," + (height + offScreenYOffset) + ")");
    }
    ///Legend that appears after continent box is checked
    function createContinentKey() {
      var keyWidth = keyElementWidth * continents.values().length;
      var continentKeyScale = d3.scaleBand()
        .domain(continents.values())
        .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

      svg.append("g")
        .attr("class", "continent-key")
        .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
        .selectAll("g")
        .data(continents.values())
        .enter()
        .append("g")
        .attr("class", "continent-key-element");

      d3.selectAll("g.continent-key-element")
        .append("rect")
        .attr("width", keyElementWidth)
        .attr("height", keyElementHeight)
        .attr("x", function (d) { return continentKeyScale(d); })
        .attr("fill", function (d) { return continentColorScale(d); });

      d3.selectAll("g.continent-key-element")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function (d) { return continentKeyScale(d) + keyElementWidth / 2; })
        .text(function (d) { return continentNames[d]; });

      // The text BBox has non-zero values only after rendering
      d3.selectAll("g.continent-key-element text")
        .attr("y", function (d) {
          var textHeight = this.getBBox().height;
          // The BBox.height property includes some extra height we need to remove
          var unneededTextHeight = 4;
          return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
        });
    }
    ///Continent check box transition speed
    function translateContinentKey(translation) {
      continentKey
        .transition()
        .duration(500)
        .attr("transform", translation);
    }
  }
  ///Flag Pic function
  function flagFill() {
    return isChecked("#flags");
  }
  ///Checkbox
  function isChecked(elementID) {
    return d3.select(elementID).property("checked");
  }
  ///Circle Info Generated on mouseover
  function createCircles() {
    var formatPopulation = d3.format(",");
    circles = svg.selectAll("circle")
      .data(countries)
      .enter()
      .append("circle")
      .attr("r", function (d) { return circleRadiusScale(d.Population); })
      .on("mouseover", function (d) {
        updateCountryInfo(d);
      })
      .on("mouseout", function (d) {
        updateCountryInfo();
      });
    updateCircles();
    ///Numbers from data assigned to circles
    function updateCountryInfo(country) {
      var info = "";
      if (country) {
        info = [country.CountryName, formatPopulation(country.Population)].join(": ");
      }
      d3.select("#country-info").html(info);
    }
  }

  ///Info like Country and Continent code assigned to circles
  function updateCircles() {
    circles
      .attr("fill", function (d) {
        return flagFill() ? "url(#" + d.CountryCode + ")" : continentColorScale(d.ContinentCode);
      });
  }
  ///Bubble movement with "weight"
  function createForces() {
    var forceStrength = 0.05;

    forces = {
      combine: createCombineForces(),
      countryCenters: createCountryCenterForces(),
      continent: createContinentForces(),
      population: createPopulationForces()
    };

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength)
      };
    }
    ///Country Coordinate Movement
    function createCountryCenterForces() {
      var projectionStretchY = 0.25,
        projectionMargin = circleSize.max,
        projection = d3.geoEquirectangular()
          .scale((width / 2 - projectionMargin) / Math.PI)
          .translate([width / 2, height * (1 - projectionStretchY) / 2]);
      return {
        x: d3.forceX(function (d) {
          return projection([d.CenterLongitude, d.CenterLatitude])[0];
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return projection([d.CenterLongitude, d.CenterLatitude])[1] * (1 + projectionStretchY);
        }).strength(forceStrength)
      };
    }
    ///Continent Movement
    function createContinentForces() {
      return {
        x: d3.forceX(continentForceX).strength(forceStrength),
        y: d3.forceY(continentForceY).strength(forceStrength)
      };
      ///Continent Movement along X axis
      function continentForceX(d) {
        if (d.ContinentCode === "EU") {
          return left(width);
        } else if (d.ContinentCode === "AF") {
          return left(width);
        } else if (d.ContinentCode === "AS") {
          return right(width);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return right(width);
        }
        return center(width);
      }
      ///Continent Movement along Y axis
      function continentForceY(d) {
        if (d.ContinentCode === "EU") {
          return top(height);
        } else if (d.ContinentCode === "AF") {
          return bottom(height);
        } else if (d.ContinentCode === "AS") {
          return top(height);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return bottom(height);
        }
        return center(height);
      }
      ///Final Placement
      function left(dimension) { return dimension / 4; }
      function center(dimension) { return dimension / 2; }
      function right(dimension) { return dimension / 4 * 3; }
      function top(dimension) { return dimension / 4; }
      function bottom(dimension) { return dimension / 4 * 3; }
    }
    ///Population 
    function createPopulationForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledPopulationMargin = circleSize.max;

      ///Population on Scale
      populationScaleX = d3.scaleBand()
        .domain(continentNamesDomain)
        .range([scaledPopulationMargin, width - scaledPopulationMargin * 2]);
      populationScaleY = d3.scaleBand()
        .domain(populationExtent)
        .range([height - scaledPopulationMargin, scaledPopulationMargin * 2]);

      var centerCirclesInScaleBandOffset = populationScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return populationScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return populationScaleY(d.Population);
        }).strength(forceStrength)
      };
    }

  }

  ///Force Simulation
  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
      .force("x", forces.combine.x)
      .force("y", forces.combine.y)
      .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(countries)
      .on("tick", function () {
        circles
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; });
      });
  }

  function forceCollide(d) {
    return countryCenterGrouping() || populationGrouping() ? 0 : circleRadiusScale(d.Population) + 1;
  }

  function countryCenterGrouping() {
    return isChecked("#country-centers");
  }

  function populationGrouping() {
    return isChecked("#population");
  }

  ///Flag Definition
  function addFlagDefinitions() {
    var defs = svg.append("defs");
    defs.selectAll(".flag")
      .data(countries)
      .enter()
      .append("pattern")
      .attr("id", function (d) { return d.CountryCode; })
      .attr("class", "flag")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("width", 1)
      .attr("height", 1)
/// Center the image in the circle
/// Slice: scale the image to fill the circle
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("xlink:href", function (d) {
        return "flags/" + d.CountryCode + ".svg";
      });
  }

  function addFillListener() {
    d3.selectAll('input[name="fill"]')
      .on("change", function () {
        toggleContinentKey(!flagFill() && !populationGrouping());
        updateCircles();
      });
  }
///Update and change chart depending on toggles
  function addGroupingListeners() {
    addListener("#combine", forces.combine);
    addListener("#country-centers", forces.countryCenters);
    addListener("#continents", forces.continent);
    addListener("#population", forces.population);

    function updateForces(forces) {
      forceSimulation
        .force("x", forces.x)
        .force("y", forces.y)
        .force("collide", d3.forceCollide(forceCollide))
        .alphaTarget(1)
        .restart();
    }

    function addListener(selector, forces) {
      d3.select(selector).on("click", function () {
        updateForces(forces);
        toggleContinentKey(!flagFill() && !populationGrouping());
        togglePopulationAxes(!populationGrouping());
      });
    }


///Population axes on Population Toggle
    function togglePopulationAxes(showAxes) {
      var onScreenXOffset = 40,
        offScreenXOffset = 5;
      var onScreenYOffset = 40,
        offScreenYOffset = 100;

      if (d3.select(".x-axis").empty()) {
        createAxes();
      }
      var xAxis = d3.select(".x-axis"),
        yAxis = d3.select(".y-axis");
///Letting scale come in or out depending on whether or not present
      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

///Defining Axes if appearing
      function createAxes() {
        var numberOfTicks = 10,
          tickFormat = ".0s";

        var xAxis = d3.axisBottom(populationScaleX)
          .ticks(numberOfTicks, tickFormat);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
          .call(xAxis)
          .selectAll(".tick text")
          .attr("font-size", "16px");

        var yAxis = d3.axisLeft(populationScaleY)
          .ticks(numberOfTicks, tickFormat);

        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(" + offScreenXOffset + ",0)")
          .call(yAxis)
          .selectAll(".tick text")
          .attr("font-size", "16px");
      }

      function translateAxis(axis, translation) {
        axis
          .transition()
          .duration(500)
          .attr("transform", translation);
      }
    }
  }

}