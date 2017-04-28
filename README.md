# googlemapsHelper
Biblioteca de ayuda para google maps



# Dependencias

* Font Awesome: http://fontawesome.io/ para íconos de controles
* Jquery : https://jquery.com/  jquery-2.2.4
* jsts: https://github.com/bjornharrtell/jsts para el buffer de rutas
* measure tool : https://github.com/zhenyanghua/MeasureTool-GoogleMaps-V3 para el control de medición de distancias.

# Modo de uso

```html
<html>
<head>
 <meta charset="utf-8">
<script src="https://use.fontawesome.com/1a178a2dc9.js"></script>
  <script src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossorigin="anonymous"></script>
 <script src="https://maps.googleapis.com/maps/api/js?libraries=places,drawing&key=[TU_KEY]"></script>
 <script type = "text/javascript" src="jsts.min.js"></script>
 <script type = "text/javascript" src="measure-tool.min.js"></script>
 <script type = "text/javascript" src="googleHelper.js"></script>
 <script type = "text/javascript">
 
 
 $(document).ready(function(){
    
     var map = new googleMapsHelper({drawControl : true}); 
 
     map.addMarker([-32.858996430,70.435860157], null,
                        {
                            id: 2,
                            icon: map.MARKERS.POI_VERDE,
                           popup : {bindClick: true, content: "<div>DEMO POPUP</div>"}
                        });
 }
 
 </script>
 
 <body>
 
   
 	<div id="map" style='height:100%'></div>
   <div id="panel" style='height:100%'></div> 
 </body>

</html>
```

# Contribuir
* Cualquiera es bienvenido
* El estandar de código se definirá

# DOCUMENTACIÓN EN CURSO:
