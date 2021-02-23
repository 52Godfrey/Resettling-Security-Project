// Read json file
d3.json("files/countryList.json").then((countryList) => {
    // console.log(countryList);
    var countryName = countryList.map(d => d.country_names);
    // console.log(countryName);

    var selectOption = d3.select("#selDataset");
                        // .append("div")
                        // .append("select");

    countryName.forEach((x) => {
        selectOption.append("option")
                    .text(x)
                    .property("value", x);
    });


});
d3.select('#selDataset')
  .on('change', function() {
    console.log(d3.select(this).property("value"));
    optionChange(d3.select(this).property("value"));
});

function optionChange(country_name){
    d3.json("files/terrorismAttacks.json").then((data) => {
        data = data.filter(d => d.country===country_name);
        // console.log(data);

        if (data.find(d => d.year===1990)=== undefined ){
            data.unshift({year: 1990, attacksCount: null});
        }
        if (data.find(d => d.year===2018)=== undefined ){
            data.push({year: 2018, attacksCount: null});
        }

        document.getElementById("plot").innerHTML = "";
        var trace1 = {
            x: data.map(d=>d.year),
            y: data.map(d=>d.attacksCount),
            // mode: 'markers',
            type: "line"
            // name: "Terrorism Attacks per Year"
        };
    
        var layout = {
            title: "Terrorism Attacks per Year",
            xaxis: {title: "Year"},
            yaxis: {title: "Number of Attacks"}
        };
    
        Plotly.newPlot("plot", [trace1], layout);
    });
/////////////////////////////////////////////////////////

d3.json("files/comparisondata.json").then((data) => {
    data = data.filter(d => d.country===country_name);
    var counts = {
        domestic: 0,
        international: 0
    }
    data.forEach((x) => {
        if (x.equal){
            counts.domestic = x.countDomvsInt;
        }
        if (! x.equal){
            counts.international = x.countDomvsInt;
        }
    })
    console.log(counts);

    var data = [{
        values: [counts.domestic, counts.international],
        labels: ['Domestic', 'International'],
        type: 'pie'
      }];
      
      var layout = {
        height: 400,
        width: 500
      };
      
      Plotly.newPlot('pie', data, layout);


    });

}









