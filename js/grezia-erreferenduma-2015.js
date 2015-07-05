(function() {
    
    // Maparen svg elementuaren neurriak.
    var width = 680,
        height = 680;

    // Maparen proiekzioaren xehetasunak.
    var projection = d3.geo.mercator()
        .center([24.0, 38.3])
        .scale(4100)
        .translate([width / 2, height / 2]);

    // Maparen bidearen generatzailea.
    var path = d3.geo.path()
        .projection(projection);

    // Maparen svg elementua DOMera gehitu eta neurriak ezarri.
    var svg = d3.select("#mapa").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Emaitzak irakurri.
    d3.csv("datuak/emaitzak.csv", function(error, datuak) {
        
        if (error) {
            return console.error(error);
        }
            
        d3.json("greziako-eskualdeak.json", function(error, grezia) {
            
            if (error) {
                return console.error(error);
            }
            
            // d: Emaitzen arrayko eskualde bakoitzaren propietateak biltzen dituen objektua.
            // i: indizea
            datuak.forEach(function(d, i) {
                
                // e: Datu geografikoetako eskualdearen propietateak
                // j: indizea
                topojson.feature(grezia, grezia.objects.eskualdeak).features.forEach(function(e, j) {
                    
                    if (d.Eskualdea === e.properties.IZENA) {
                        e.properties.datuak = d;
                    }
                    
                });
                
            });
            
            svg.selectAll(".unitateak")
               .data(topojson.feature(grezia, grezia.objects.eskualdeak).features)
               .enter().append("path")
               .attr("class", "unitateak")
               .attr("d", path)
               .attr("fill", function(d) {
                   
                   // Bai: #3E9A97
                   // Ez: #EC682E
                   
                   // Ezetza nagusitu bada...
                   if (parseFloat(d.properties.datuak.Ez) > 50.0) {
                       return "#EC682E";
                   }
                   
                   // Baietza nagusitu bada...
                   return "#3E9A97";
                   
               })
               .on("mouseover", function(d) {
                   
                   $(".hasierako-mezua").hide();
                   
                   //$("#unitatea-izena").text(d.properties.PER + " - " + d.properties.IZENA);
                   $("#unitatea-izena").text(d.properties.IZENA_EUS);
                   
                   $("#emaitza-bai").text("%" + (100.0 - parseFloat(d.properties.datuak.Ez)).toFixed(2).replace(".", ","));
                   $("#emaitza-ez").text("%" + d.properties.datuak.Ez.replace(".", ","));
                   
               });
            
            // Eskualdeen arteko mugak (a !== b)
            svg.append("path")
                .datum(topojson.mesh(grezia, grezia.objects.eskualdeak, function(a, b) { return a !== b; }))
                .attr("d", path)
                .attr("class", "eskualde-mugak");
            
            // Kanpo-mugak (a === b)
            svg.append("path")
                .datum(topojson.mesh(grezia, grezia.objects.eskualdeak, function(a, b) { return a === b; }))
                .attr("d", path)
                .attr("class", "kanpo-mugak");
        });
        
    });

}());
