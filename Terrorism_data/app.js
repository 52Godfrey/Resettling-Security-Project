function makeResponsive() {
    //Define SVG area
    var svgWidth = 1800;
    var svgHeight = 900;

    var chartMargin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40    
    };

    // Define dimensions of the chart area
    var width = svgWidth - chartMargin.left - chartMargin.right;
    var height = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area, and set the dimensions
    var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg
    .append("g")
    .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")")
    .attr("class","main");

    //Read CSV

    d3.json("files/terrorismAttacks.json"). then(function(terrorismData) {
        console.log(terrorismData);

        //parse data
        terrorismData.forEach(function(data) {
            data.year = +data.year;
            data.attacksCount = +data.attacksCount
            // data.country = data.country.length;
            // console.log(data);

        });

    });
}


// d3.csv("test.csv").then((data) => {
//     console.log(data)
// });

// // d3.csv("test.csv").then((data) => {
// //     // console.log(data);
// //     var countryName = data.map(d => d.country);
// //     // console.log(countryName);

// //     var selectOption = d3.select("body")
// //                     .append("div")
// //                     .append("select");

// //     countryName.forEach((x) => {
// //         selectOption.append("option")
// //                     .text(x)
// //                     .property("value", x);
// //     });


// //     // CREATE DROPDOWN MENU AND APPEND COUNTRY NAME
    
    
    
// //     // selectOption.selectAll("option")
// //     //           .data(data)
// //     //           .enter()
// //     //           .append("option")
// //     //           .attr("value", function (d) {return d; })
// //     //           .text(function (d) {return d;});


// //     // var terrorismData = data.country_txt[0];
// //     // console.log(terrorismData);



// // });





