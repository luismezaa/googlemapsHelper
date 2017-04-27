function measureControl(measureControlDiv, measureTool) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginLeft = '10px';
    controlUI.style.marginTop = '3px';
    controlUI.style.marginBottom = '3px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click para ejecutar la herramienta de medición';

    measureControlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('i');
    controlText.className += "fa fa-arrows-h iconSize-25";



    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {

        if (measureTool.started != undefined && measureTool.started === true) {
            measureTool.started = false;
            measureTool.end();
        } else if (measureTool.started != undefined && measureTool.started === false) {
            measureTool.started = true;
            measureTool.start();
        } else {
            measureTool.started = true;
            measureTool.start();
        }
    });


}
function ajustarMapa(ajustarMapaControlDiv, helper) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginLeft = '10px';
    controlUI.style.marginTop = '3px';
    controlUI.style.marginBottom = '3px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click para ejecutar ajustar mapa a su extensión';

    ajustarMapaControlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('i');
    controlText.className += "fa fa-map-o iconSize-20";



    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {

        helper.zoomToExtent(); 

    });


}
function showHideLabelsControl(labelControlDiv, labelArray, map, initShow) {
    var eyeIconTrue = "fa fa-eye-slash iconSize-25";
    var eyeIconFalse = "fa fa-eye iconSize-25";

    if (labelControlDiv.show == undefined) {

        labelControlDiv.show = initShow;

        eyeIcon = labelControlDiv.show ? eyeIconTrue : eyeIconFalse;

    }

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginLeft = '10px';
    controlUI.style.marginTop = '3px';
    controlUI.style.marginBottom = '3px';
    controlUI.style.textAlign = 'center';


    labelControlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('i');
    controlText.className = eyeIcon;

    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {

        for (var ii = 0; ii <= labelArray.length - 1; ii++) {

            !labelControlDiv.show ? labelArray[ii].open(map) : labelArray[ii].close();

        }

        labelControlDiv.show = !labelControlDiv.show;
        controlText.className = labelControlDiv.show ? eyeIconTrue : eyeIconFalse;

    });


}
function googleMapsHelper(options) {

    google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (element, index) { bounds.extend(element); });
        return bounds;
    };
    google.maps.Polyline.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (item, index) {
            bounds.extend(new google.maps.LatLng(item.lat(), item.lng()));
        });
        return bounds;
    };

    var _this = this;
    _this.mapInstance = null;
    _this.settings = {
        target: "map",
        center: [-33.4378439, -70.6504796],
        defaultZoom: 18,
        drawControl: false,
        initialMapLayer: "HYBRID", //TERRAIN, SATELLITE, TRAFFIC, HYBRID
        labelOptions: {
            showLabels: false,
        },
        antStyle: {
            antColor: 'white',
            antDelay: 150,
            antDashArray: [4, 20]
        },
        routeStyle: {
            strokeColor: "#0080ff",
            strokeOpacity: 0.55,
            strokeWeight: 6
        },
        circleStyle: {

            strokeColor: '#DC45ED',
            strokeWeight: 4,
            strokeOpacity: 0.5,
            fillColor: "#FF0000", //same as color by default
            fillOpacity: 0.2,
            clickable: true
        },
        polygonStyle: {

            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: true

        },
        routeBoxStyle: {

            strokeColor: '#00008b',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: null,
            fillOpacity: 0.0,
            clickable: false
        },
        polylineStyle: {
            strokeColor: "#0080ff",
            strokeOpacity: 0.55,
            strokeWeight: 4,
            clickable: true,
            draggable: false,
            editable: false,
        }
    };
    _this.settings = $.extend(true, _this.settings, options || {});

    _this.layers = {
        totalMarkers: [],
        markers: [],
        activeHighlightMarkers: [],
        directions: [],
        draw: [],
        objectsIds: [],
        infoWindows: [],
        routeBoxes: []
    };

    _this.directionsService = new google.maps.DirectionsService();
    _this.measureTool = null;

    function initMap(_this) {
        console.info(_this.settings.initialMapLayer.toLowerCase()); 
        _this.mapInstance = new google.maps.Map(document.getElementById(_this.settings.target), {
            center: { lat: _this.settings.center[0], lng: _this.settings.center[1] },
            zoom: _this.settings.defaultZoom,
            scaleControl: true,
            mapTypeId: _this.settings.initialMapLayer.toLowerCase()
        });


        var centerControlDiv = document.createElement('div');
        var centerControlInstance = ajustarMapa(centerControlDiv, _this);
        centerControlDiv.index = 1;
        _this.mapInstance.controls[google.maps.ControlPosition.LEFT_CENTER].push(centerControlDiv);


        _this.measureTool = new MeasureTool(_this.mapInstance, { contextMenu: false });

        var measureControlDiv = document.createElement('div');
        var measureControlInstance = measureControl(measureControlDiv, _this.measureTool);
        measureControlDiv.index = 2;
        _this.mapInstance.controls[google.maps.ControlPosition.LEFT_CENTER].push(measureControlDiv);


        var labelControlDiv = document.createElement('div');
        var labelControlInstance = showHideLabelsControl(labelControlDiv, _this.layers.infoWindows, _this.mapInstance, _this.settings.labelOptions.showLabels);
        labelControlDiv.index = 3;
        _this.mapInstance.controls[google.maps.ControlPosition.LEFT_CENTER].push(labelControlDiv);
        _this.labelControl = labelControlDiv;



    }
    function getGoogleLocation(location) {

        if (location instanceof google.maps.LatLng) {
            return location;
        } else if (!isNaN(location[0]) && !isNaN(location[1])) {
            return new google.maps.LatLng(location[0], location[1]);
        }
        else if (location.lat && location.lon) {

            return new google.maps.LatLng(location.lat, location.lon);

        } else if (location.lat && location.lng) {

            return new google.maps.LatLng(location.lat, location.lng);

        } else if (location.Latitude && location.Longitude) {
            return new google.maps.LatLng(location.Latitude, location.Longitude);
        } else {


            throw "Formato location no reconocido";

            return location;
        }
    }

    _this.transformLocation = function (location) {



        if (location.constructor === Array) {



            if (location[0].constructor === Array || location[0].constructor === Object || location[0] instanceof google.maps.LatLng) {

                var retorno = [];
                for (var ii = 0; ii <= location.length - 1; ii++) {

                    retorno.push(getGoogleLocation(location[ii]));
                }

                return retorno;

            }
            else {



                return getGoogleLocation(location);
            }
        } else {


            return getGoogleLocation(location);
        }

    }

    _this.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }

    initMap(_this);
    if (_this.settings.drawControl) {
        _this.initDrawControl();
    }

}
googleMapsHelper.prototype.remove = function (removeMap) {
    var _this = this;


    for (var ii = 0; ii <= _this.layers.totalMarkers.length - 1; ii++) {
        _this.layers.totalMarkers[ii].setMap(null);
    }

    for (var ii = 0; ii <= _this.layers.directions.length - 1; ii++) {
        _this.layers.directions[ii].setMap(null);
    }

    for (var ii = 0; ii <= _this.layers.draw.length - 1; ii++) {
        _this.layers.draw[ii].setMap(null);
    }

    for (var ii = 0; ii <= _this.layers.infoWindows.length - 1; ii++) {
        _this.layers.infoWindows[ii].setMap(null);
    }

    for (var ii = 0; ii <= _this.layers.routeBoxes.length - 1; ii++) {
        _this.layers.routeBoxes[ii].setMap(null);
    }

    for (var ii = 0; ii <= _this.layers.objectsIds.length - 1; ii++) {
        $(document.getElementById(_this.layers.objectsIds[ii])).remove();
    }

    if (removeMap != undefined && removeMap === true) {
        $(document.getElementById(_this.settings.target)).remove();
        delete _this.mapInstance;
        delete _this;
    }
}
googleMapsHelper.prototype.zoomMarker = function (element, options) {
    var _this = this;
    var defaultOptions = { zoom: 15 };
    defaultOptions = $.extend({}, defaultOptions, options || {});
    _this.setCenter(element.position, defaultOptions.zoom);
}
googleMapsHelper.prototype.fit = function (element) {
    var _this = this;
    var bounds = new google.maps.LatLngBounds();

    if (element.position) {
        bounds.extend(element.position);
    }
    else if (element.getBounds) {
        bounds.extend(element.getBounds().getNorthEast());
        bounds.extend(element.getBounds().getSouthWest());
    }

    _this.mapInstance.fitBounds(bounds);
}
googleMapsHelper.prototype.padLeft = function (nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
googleMapsHelper.prototype.secondsToTime = function (secs) {

    var _this = this;
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);




    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds,
        "totalSeconds": secs,
        "text": _this.padLeft(hours.toString(), 2, "0") + ":" + _this.padLeft(minutes.toString(), 2, "0") + ":" + _this.padLeft(seconds.toString(), 2, "0")
    };
    return obj;
}
googleMapsHelper.prototype.initDrawControl = function () {
    var _this = this;
    if (_this.drawingManager == null) {


        var circleStyle = jQuery.extend(true, { editable: true }, _this.settings.circleStyle);
        var polygonStyle = jQuery.extend(true, { editable: true }, _this.settings.polygonStyle);
        var polylineStyle = jQuery.extend(true, { editable: true }, _this.settings.polylineStyle);


        _this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.HAND,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT,
                drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
            },
            markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
            circleOptions: circleStyle,
            polygonOptions: polygonStyle,
            polylineOptions: polylineStyle,
            rectangleOptions: polygonStyle
        });

        _this.drawingManager.setMap(_this.mapInstance);


        google.maps.event.addListener(_this.drawingManager, 'overlaycomplete', function (event) {


            if (_this.layers.draw.indexOf(event.overlay) < 0) {

                _this.layers.draw.push(event.overlay);

            }
        });

    }

}
googleMapsHelper.prototype.setCenter = function (center, zoom) {
    var _this = this;
    _this.mapInstance.setCenter(_this.transformLocation(center));
    _this.mapInstance.setZoom(zoom || _this.settings.defaultZoom);
}
googleMapsHelper.prototype.highlight = function (id, options) {

    var _this = this;
    if (!_this.layers.markers[id]) {
        return;
    }

    var defaultOptions = { zoom: 15, changeZoom: false, stopOthers: true };

    if (defaultOptions.stopOthers) {
        _this.disableAllHighlightMarkers();
    }


    _this.layers.activeHighlightMarkers.push(_this.layers.markers[id]);

    defaultOptions = $.extend({}, defaultOptions, options || {});
    _this.mapInstance.panTo(_this.layers.markers[id].position);

    if (defaultOptions.changeZoom) {
        _this.mapInstance.setZoom(defaultOptions.zoom);
    }



    _this.layers.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    //_this.flyTo(_this.instance.markers[id].getLatLng(), defaultOptions.zoom);
    //_this.instance.markers[id].enablePermanentHighlight();

}
googleMapsHelper.prototype.disableAllHighlightMarkers = function () {
    var _this = this;


    for (var i = 0; i <= _this.layers.activeHighlightMarkers.length - 1; i++) {
        _this.disableHighlight(_this.layers.activeHighlightMarkers[i].idInterno);
    }

    _this.layers.activeHighlightMarkers = [];
}
googleMapsHelper.prototype.disableHighlight = function (id) {

    var _this = this;

    if (_this.layers.markers[id]) {
        _this.layers.markers[id].setAnimation(null);
    }


}
googleMapsHelper.prototype.addMarker = function (point, click, options) {

    //    extraData, icon, color, iconColor, prefix, extraClasses, popup, id

    var defaultOptions = {
        extraData: null,
        icon: null,
        popup: {

            bindClick: false,
            content: null

        },
        id: null,

    }

    defaultOptions = $.extend({}, defaultOptions, options || {});


    var _this = this;
    var marker = null;
    var optimized = (!defaultOptions.icon ? true : (defaultOptions.icon.url ? false : true));

    marker = new google.maps.Marker({
        position: _this.transformLocation(point),
        icon: defaultOptions.icon || null,
        optimized: optimized
    });

    //'<i class="' + icon + '" + style="' + (iconColor ? "background:" + iconColor : "")  + ';"></i>'


    marker.extraData = defaultOptions.extraData;

    if (click) {
        marker.addListener('click', click);
    }

    if (defaultOptions.popup) {

        var infowindow = new google.maps.InfoWindow({
            content: defaultOptions.popup.content
        });

        marker.hasClicked = false;

        if (typeof defaultOptions.popup.bindClick != 'undefined' && defaultOptions.popup.bindClick) {

            marker.addListener("click", function (e) { marker.hasClicked = true; infowindow.open(_this.mapInstance, marker); });
        }

        google.maps.event.addListener(infowindow, 'closeclick', function () {
            marker.hasClicked = false;
        });


        google.maps.event.addListener(marker, 'mouseover', (function (marker) {
            return function () {
                infowindow.open(_this.mapInstance, marker);
            }
        })(marker));


        google.maps.event.addListener(marker, 'mouseout', function () {
            if (!this.hasClicked) {
                infowindow.close();
            }
        });
    }

    marker.setMap(_this.mapInstance);

    if (defaultOptions.id) {
        marker.idInterno = defaultOptions.id;
        _this.layers.markers[defaultOptions.id] = marker;
    }

    _this.layers.totalMarkers.push(marker);

    return marker;

}
googleMapsHelper.prototype.addRotateMarker = function (point, click, icon, popup, id, options) {
    var _this = this;
    var guid = _this.guid();
    var course = point.course;

    options = options || { size: [32, 32], scaledSize: [16, 16], anchor: [0, 8] };

    icon = icon + "#" + guid;

    var iconMarker = {
        url: icon,
        size: new google.maps.Size(options.size[0], options.size[1]),
        scaledSize: new google.maps.Size(options.scaledSize[0], options.scaledSize[1]),
        anchor: new google.maps.Point(options.anchor[0], options.anchor[1])
    };

    var marker = _this.addMarker(point, click, null, iconMarker, null, null, null, null, popup, id);

    var interval = window.setInterval(function () {
        var image = $('img[src*="' + icon + '"]');


        if (image.length && image.length > 0) {
            window.clearInterval(interval);
            image.css({ 'transform': 'rotate(' + course + 'deg)' });
        }

    }, 100);



    return marker;
}
googleMapsHelper.prototype.route = function (routes, completeCallback, multiple, panel) {


    var _this = this;
    _this.layers.directions = [];

    function renderDirections(result, panel) {

        var directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true, hideRouteList: false, panel: (panel ? document.getElementById(panel) : null) });
        directionsRenderer.setMap(_this.mapInstance);
        directionsRenderer.setDirections(result);

        _this.layers.directions.push(directionsRenderer);

    }

    if (panel) {
        _this.layers.objectsIds.push(panel);
    }

    var retorno = [];

    for (var ii = 0; ii <= routes.length - 1; ii++) {
        var route = routes[ii];

        var request = {

            origin: new google.maps.LatLng(route.origin.lat, route.origin.lon),
            destination: new google.maps.LatLng(route.destination.lat, route.destination.lon),
            provideRouteAlternatives: multiple || false,
            travelMode: google.maps.TravelMode.DRIVING,


        };

        if (route.waypoints != undefined && route.waypoints != null && route.waypoints.length > 0) {

            request.waypoints = [];
            for (var ee in route.waypoints) {

                request.waypoints.push({
                    location: _this.transformLocation(route.waypoints[ee]),
                    stopover: route.waypoints[ee].stopover
                });
            }
        }


        _this.directionsService.route(request, function (result, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                retorno.push(result);
                renderDirections(result, panel);

            } else {

                retorno.push({ status: status });
            }

            if (retorno.length == routes.length) {

                window.setTimeout(function () {
                    completeCallback(retorno);
                }, 200);


            }

        });

    }


}
googleMapsHelper.prototype.zoomToExtent = function (newBounds) {
    var _this = this;
    var bounds = new google.maps.LatLngBounds();

    for (var ii = 0; ii <= _this.layers.totalMarkers.length - 1; ii++) {
        bounds.extend(_this.layers.totalMarkers[ii].getPosition());
    }

    for (var ii = 0; ii <= _this.layers.directions.length - 1; ii++) {

        bounds.extend(_this.layers.directions[ii].directions.routes[_this.layers.directions[ii].routeIndex].bounds.getNorthEast());
        bounds.extend(_this.layers.directions[ii].directions.routes[_this.layers.directions[ii].routeIndex].bounds.getSouthWest());
    }

    for (var ii = 0; ii <= _this.layers.draw.length - 1; ii++) {

        if (_this.layers.draw[ii].position) {
            bounds.extend(_this.layers.draw[ii].position);
        }
        else if (_this.layers.draw[ii].getBounds) {
            bounds.extend(_this.layers.draw[ii].getBounds().getNorthEast());
            bounds.extend(_this.layers.draw[ii].getBounds().getSouthWest());

        }
    }


    _this.mapInstance.fitBounds(bounds);

}
googleMapsHelper.prototype.drawCircle = function (latlong, radius, click, options) {

    var _this = this;
    options = $.extend(true, {}, options || {});;
    var defaultStyle = $.extend(true, {}, _this.settings.circleStyle || {});;

    defaultStyle = $.extend(true, defaultStyle, options.style || {});

    if (options.editable != undefined) {

        defaultStyle.editable = options.editable;

    }

    var circle = new google.maps.Circle(defaultStyle);

    if (options.extraData) {

        circle.extraData = options.extraData;
    }

    if (click) {
        google.maps.event.addListener(circle, 'click', click);
    }

    circle.setCenter(_this.transformLocation(latlong));
    circle.setRadius(radius);

    circle.setMap(_this.mapInstance);

    _this.layers.draw.push(circle);
    return circle;
}
googleMapsHelper.prototype.drawPolygon = function (points, click, options) {

    var _this = this;

    options = $.extend(true, {}, options || {});;

    var defaultStyle = $.extend(true, {}, _this.settings.polygonStyle || {});;

    defaultStyle = $.extend(true, defaultStyle, options.style || {});

    if (options.editable != undefined) {

        defaultStyle.editable = options.editable;

    }

    defaultStyle.paths = _this.transformLocation(points);

    var polyline = new google.maps.Polygon(defaultStyle);



    if (options.extraData) {

        polyline.extraData = options.extraData;
    }



    if (click) {
        google.maps.event.addListener(polyline, 'click', click);
    }



    polyline.setMap(_this.mapInstance);

    _this.layers.draw.push(polyline);

    return polyline;

}
googleMapsHelper.prototype.drawLine = function (points, click, route, options) {

    var _this = this;

    function animate(polyline, delay) {
        var count = 0;

        if (!delay) {
            delay = _this.settings.antStyle.antDelay;
        }

        offsetId = window.setInterval(function () {
            count = (count + 1) % 200;
            var icons = polyline.get('icons');
            icons[0].offset = (count / 2) + '%';
            polyline.set('icons', icons);

        }, delay);
    }


    points = _this.transformLocation(points);
    options = $.extend(true, {}, options || {});
    var defaultStyle = $.extend(true, {}, (route ? _this.settings.routeStyle : _this.settings.polylineStyle) || {});

    defaultStyle = $.extend(true, defaultStyle, options.style || {});

    if (options.editable != undefined) {

        defaultStyle.editable = options.editable;

    }



    var ant = false;
    if (options.ant != undefined && options.ant != null && options.ant.antPath != undefined && options.ant.antPath != null && options.ant.antPath == true) {

        ant = true;

        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeColor: _this.settings.antStyle.antColor,
            strokeOpacity: 0.4,
            scale: _this.settings.antStyle.antDashArray[0]
        };

        defaultStyle.icons = [{
            icon: lineSymbol,
            offset: '100%',
            repeat: _this.settings.antStyle.antDashArray[1].toString() + "px"
        }];


    }

    var polyline = new google.maps.Polyline(defaultStyle);
    polyline.setPath(points);


    if (options.extraData) {
        polyline.extraData = options.extraData;
    }

    if (click) {
        google.maps.event.addListener(polyline, 'click', click);
    }

    if (options.mouseover) {
        if (click) {
            google.maps.event.addListener(polyline, 'mouseover', function (e) {
                options.mouseover(e);
            });
        }
    }

    polyline.setMap(_this.mapInstance);

    if (ant) {
        animate(polyline);
    }


    _this.layers.draw.push(polyline);




    return polyline;
}
googleMapsHelper.prototype.getShapeCenter = function (shape) {

    if (shape.position) {
        return shape.position;
    } else if (shape.getBounds) {
        return shape.getBounds().getCenter();
    } else {

        throw "No se puedo determinar el centro de la forma";
    }

}
googleMapsHelper.prototype.getInstance = function () {
    var _this = this;
    return _this.mapInstance;

}
googleMapsHelper.prototype.getCurrentBounds = function () {
    var _this = this;
    var bounds = _this.mapInstance.getBounds();
    return bounds;
}
googleMapsHelper.prototype.clear = function () {

    var _this = this;
    _this.remove(false);
    _this.setCenter(_this.settings.center);
}
googleMapsHelper.prototype.deleteShape = function (shape) {
    var _this = this;


    if (shape instanceof google.maps.Marker) {

        var index = _this.layers.totalMarkers.indexOf(shape);

        if (index > -1) {
            _this.layers.totalMarkers.splice(index, 1);
        }

        index = _this.layers.activeHighlightMarkers.indexOf(shape);

        if (index > -1) {
            _this.layers.activeHighlightMarkers.splice(index, 1);
        }

        if (shape.idInterno) {
            delete _this.layers.markers[shape.idInterno];
        }


    } else {

        var index = _this.layers.draw.indexOf(shape);

        if (index > -1) {
            _this.layers.draw.splice(index, 1);
        }
    }

    shape.setMap(null);
}
googleMapsHelper.prototype.setLabel = function (staticLabel, layer, content) {

    var _this = this;


    var infowindow = new google.maps.InfoWindow({
        content: content

    });

    infowindow.setPosition(_this.getShapeCenter(layer));

    google.maps.event.addListener(infowindow, 'closeclick', function () {
        infowindow.open(_this.mapInstance);
    });


    if (staticLabel || _this.labelControl.show) {

        infowindow.open(_this.mapInstance);
    }

    _this.layers.infoWindows.push(infowindow);

}
googleMapsHelper.prototype.showAllLabels = function () {
    var _this = this;

    for (var ii = 0; ii <= this.layers.infoWindows.length - 1; ii++) {

        _this.layers.infoWindows[ii].open(_this.mapInstance);
    }

    _this.labelControl.show = true;
}
googleMapsHelper.prototype.closeAllLabels = function () {
    var _this = this;

    for (var ii = 0; ii <= this.layers.infoWindows.length - 1; ii++) {

        _this.layers.infoWindows[ii].close();
    }
    _this.labelControl.show = false;
}
googleMapsHelper.prototype.routeBox = function (path, distance, clear) {

    var _this = this;

    function googleMaps2JTS(boundaries) {
        var coordinates = [];
        var length = 0;
        if (boundaries && boundaries.getLength) length = boundaries.getLength();
        else if (boundaries && boundaries.length) length = boundaries.length;
        for (var i = 0; i < length; i++) {
            if (boundaries.getLength) coordinates.push(new jsts.geom.Coordinate(
            boundaries.getAt(i).lat(), boundaries.getAt(i).lng()));
            else if (boundaries.length) coordinates.push(new jsts.geom.Coordinate(
            boundaries[i].lat(), boundaries[i].lng()));
        }
        return coordinates;
    };

    var jsts2googleMaps = function (geometry) {
        var coordArray = geometry.getCoordinates();
        GMcoords = [];
        for (var i = 0; i < coordArray.length; i++) {
            GMcoords.push(new google.maps.LatLng(coordArray[i].x, coordArray[i].y));
        }
        return GMcoords;
    }


    if (clear) {
        for (var ii = 0; ii <= _this.layers.routeBoxes.length - 1; ii++) {

            var index = _this.layers.routeBoxes.indexOf(_this.layers.routeBoxes[ii]);
            _this.layers.routeBoxes[ii].setMap(null);
            _this.layers.routeBoxes.splice(index, 1);

        }

        _this.layers.routeBoxes = [];
    }

    var overviewPath = path,
          overviewPathGeo = [];
    for (var i = 0; i < overviewPath.length; i++) {
        overviewPathGeo.push(
        [overviewPath[i].lng(), overviewPath[i].lat()]);
    }

    var distance = distance * 0.001 / 111.12,
        geoInput = {
            type: "LineString",
            coordinates: overviewPathGeo
        };
    var geoInput = googleMaps2JTS(overviewPath);
    var geometryFactory = new jsts.geom.GeometryFactory();
    var shell = geometryFactory.createLineString(geoInput);
    var polygon = shell.buffer(distance);


    var oLanLng = [];
    var oCoordinates;

    oCoordinates = polygon.shell.points.coordinates;
    for (i = 0; i < oCoordinates.length; i++) {
        var oItem;
        oItem = oCoordinates[i];
        oLanLng.push(new google.maps.LatLng(oItem[1], oItem[0]));
    }

    var retorno = _this.drawPolygon(jsts2googleMaps(polygon), null, { style: _this.settings.routeBoxStyle });

    _this.layers.routeBoxes.push(retorno);

    return retorno;
}
googleMapsHelper.prototype.disableDraw = function () {

    var _this = this;
    if (_this.drawingManager && _this.drawingManager != null) {

        _this.drawingManager.setOptions({
            drawingControl: false
        });
    }
}
googleMapsHelper.prototype.enableDraw = function () {
    var _this = this;
    if (_this.drawingManager && _this.drawingManager != null) {
        _this.drawingManager.setOptions({
            drawingControl: true
        });
    } else {
        _this.initDrawControl();

    }
}
googleMapsHelper.prototype.MARKERS = {};
googleMapsHelper.prototype.MARKERS.BASESITE = "./bower_components/googlemaps"
googleMapsHelper.prototype.MARKERS.POI_AZUL = googleMapsHelper.prototype.MARKERS.BASESITE + "/pointOfInterest-azul.svg";
googleMapsHelper.prototype.MARKERS.POI_VERDE = googleMapsHelper.prototype.MARKERS.BASESITE + "/pointOfInterest-verde.svg";
googleMapsHelper.prototype.MARKERS.POI_ROJO = googleMapsHelper.prototype.MARKERS.BASESITE + "/pointOfInterest-rojo.svg";
