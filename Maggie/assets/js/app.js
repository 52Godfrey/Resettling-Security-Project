// Read json file
d3.json("../assets/js/CountryList.json").then((countryList) => {
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
    d3.json("terrorismAttacks.json").then((data) => {
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
            mode: 'lines+markers',
            marker: {
                color: 'rgb(128, 0, 128)',
                size: 10
              },
              line: {
                color: 'rgb(128, 0, 128)',
                width: 2
              }
        };
    
        var layout = {
            title: "Terrorism Attacks per Year",
            height: 600,
            width: 1800,
            xaxis: {title: "Year",
                    autotick: false,
                    },
            yaxis: {title: "Number of Attacks",
                    rangemode: 'tozero',
                    showline: true
                    // autotick: false
                    }
        };
    
        Plotly.newPlot("plot", [trace1], layout);
    });
/////////////////////////////////////////////////////////

d3.json("comparisondata.json").then((data) => {
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

    var ultimateColors = [
        ['rgb(33, 75, 99)', 'rgb(128, 0, 128)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 'rgb(6, 4, 4)'],
        ['rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 'rgb(129, 180, 179)', 'rgb(124, 103, 37)'],
        ['rgb(33, 75, 99)', 'rgb(79, 129, 102)', 'rgb(151, 179, 100)', 'rgb(175, 49, 35)', 'rgb(36, 73, 147)'],
        ['rgb(146, 123, 21)', 'rgb(177, 180, 34)', 'rgb(206, 206, 40)', 'rgb(175, 51, 21)', 'rgb(35, 36, 21)']
      ];

    var data = [{
        values: [counts.domestic, counts.international],
        labels: ['Domestic', 'International'],
        type: 'pie',
        margin: {"t": 0, "b": 0, "l": 100, "r": 100},
        marker: {
            colors: ultimateColors[0]
          },
      }];
      
      var layout = {
        title: "Domestic vs. International",
        autosize: false,
        height: 600,
        width: 700
      };
      
      Plotly.newPlot('pie', data, layout);


    });

}









