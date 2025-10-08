var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/4.33/@arcgis/core/views/SceneView.js";



Main = (function() {
    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [layer]
         },
    });
    
    const view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,
        camera: {
            position: {
                x: -175.700680,
                y: 44.270,
                z: 17500000,
                spatialReference: {
                    wkid: 4326
    
                }
            },
            heading: 0,
            tilt: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
        // enable shadows to be cast from the features

        environment: {
             background: {
             type: "sky" 
                },
            starsEnabled: true,
             lighting: {
            directShadowsEnabled: false
            }
                }
});
             
    const initMap = function(){
                          
        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.featureReduction = {
  type: "cluster"
};          
        map.add(graphicsLayer);

        for (const [key, value] of Object.entries(myStuff)){                       
            console.log(key, value)
                        
            const point = {                        
                type: "point",                             
                x: value.coord[0],                        
                y: value.coord[1],                            
                z: 10000                          
            };
                                
            const markerSymbol = {                            
                type: "simple-marker",     
                style: "diamond",                        
                color: [222, 49, 99],                            
                outline: {
                              
                    // autocasts as new SimpleLineSymbol()                              
                    color: [119, 7, 55],                             
                    width: 1
                            
                }
                          
            };
                                                
            const pointGraphic = new Graphic({                            
                geometry: point,                            
                symbol: markerSymbol,                            
                popupTemplate: {                                
                    title: key,
                      content: 'Location:' + " " + value.city + ", " + value.state
                                }});                           
            
                          
            graphicsLayer.add(pointGraphic);
            


                    
        };

for (const [key, value] of Object.entries(cities)){                       
            console.log(key, value)
                        
            const point = {                        
                type: "point",                             
                x: value.coord[0],                        
                y: value.coord[1],                            
                z: 10000                          
            };
                                
            const markerSymbol = {                            
                type: "simple-marker",     
                style: "square",                        
                color: [152, 251, 152],                            
                outline: {
                              
                    // autocasts as new SimpleLineSymbol()                              
                    color: [71, 135, 120],                             
                    width: 1
                            
                }
                          
            };
                                                
            const pointGraphic = new Graphic({                            
                geometry: point,                            
                symbol: markerSymbol,                            
                popupTemplate: {                                
                    title: key,
                      content: 'Location:' + " " + value.city + ", " + value.state
                                }});                           
            
                          
            graphicsLayer.add(pointGraphic);
            


                    
        }
                                    
    }
                
    initMap()

    view.on("click", function(event) {
  
  view.hitTest(event).then(function(response) {
    let result = response.results[0];

    if (result?.type === "graphic") {
      let lon = result.mapPoint.longitude;
      let lat = result.mapPoint.latitude;

      console.log("Hit graphic at (" + lon + ", " + lat + ")", result.graphic);
      view.goTo({target:result.graphic.geometry,
                zoom:7
    });
    } else {
      console.log("Did not hit any graphic");
    }
  });
});

view.when(() => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();


    const matchedKey = Object.keys(cities).find(city => city.toLowerCase() === searchTerm.toLowerCase());

    if (matchedKey) {
      const city = cities[matchedKey];
      view.goTo({
        center: [city.coord[0], city.coord[1]],
        zoom: 10
      }).catch(err => {
        console.error("GoTo failed: ", err);
      });
    } else {
      alert("City not found in dataset.");
    }
  });
});
                
    return {};

            
})();

    
