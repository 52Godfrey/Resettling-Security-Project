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
    d3.json("../assets/js/CombineDF.json").then((data) => {
        data = data.filter(d => d.Country===country_name);
        // console.log(data);

        if (data.find(d => d.Year===1990)=== undefined ){
            data.unshift({Year: 1990, attacksCount: null});
        }
        if (data.find(d => d.Year===2018)=== undefined ){
            data.push({Year: 2018, attacksCount: null});
        }

        document.getElementById("plot").innerHTML = "";
        var trace1 = {
            x: data.map(d=>d.Year),
            y: data.map(d=>d.attacksCount*100),
            name: "Terrorism Attacks (multiplied by 100)",
            mode: 'lines+markers',
            marker: {
                color: 'rgb(227, 64, 45)',
                size: 10
              },
              line: {
                color: 'rgb(227, 64, 45)',
                width: 2
              }
            // type: "line"
            // name: "Terrorism Attacks per Year"
        };
        
        var trace2 = {
            x: data.map(d=>d.Year),
            y: data.map(d=>d.refugeesCount),
            name: "Refugees Hosted",
            mode: 'lines+markers',
            marker: {
                color: 'rgb(128, 0, 128)',
                size: 10
              },
              line: {
                color: 'rgb(128, 0, 128)',
                width: 2
              }
            // type: "line"
            // name: "Refugees Hosted per Year"
        };

        var layout = {
            title: "Refugee and Terror Attack Comparison Chart",
            height: 600,
            width: 1800,
            xaxis: {title: "Year",
                    autotick: false,
                    // rangemode: 'tozero'
                    // autorange: false,
                    // ticks: 'outside',
                    // mirror: 'ticks',
                    // tick0: 0,
                    // zeroline: true,
                    // linecolor: '#969696'
                    // showline: true
                    },
            yaxis: {title: "Total",
                    rangemode: 'tozero',
                    showline: true
                    // autotick: false
                    }
        };
    var data = [trace1, trace2];
        Plotly.newPlot("plot", data, layout);
    });


}









