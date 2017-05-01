/*
@author: sk342
*/
$(function() {
  var PLANETS_DATA = gon.planets;
  var ASTEROIDS_DATA = gon.asteroids;
  
  var scene, camera, renderer, controls;
  var domEvents;
  var controller;
  var planets, neos;
  var pOrbits, nOrbits;
  // var plane;
  var animated = [];
  var $container;
  var $info;
  
  function onWindowResize() {
  	camera.aspect = $container.width() / $container.height();
  	camera.updateProjectionMatrix();
  	renderer.setSize( $container.width(), $container.height() );
  }
  
  
  function initGUI() {
		var gui = new dat.GUI({ autoPlace: false });
    $container.append($(gui.domElement).addClass('viscontrols'));
    
    var d = gui.add(controller, "Date").listen();
    var $input = $($(d.domElement).children()[0]);
    $input.prop('readonly',true);
    $input.addClass('datepicker').datepicker({
      format: "yyyy-mm-dd"
    }).on('changeDate', function(e){
      // console.log(e);
      var date = new Date(e.date);
      controller['Time'] = util.dateToJD(date).getJD();
    });
    var f0 = gui.addFolder("Animation");
    f0.add(controller, "Animate");
    f0.add(controller, "Speed", 1, 365).step(1);
    var f1 = gui.addFolder("Planets");
    f1.add(controller, "Planets").onChange(function(value) {
      planets.traverse( function ( object ) { object.visible = value; } );
    });
    f1.add(controller, "Planet Orbits").onChange(function(value) {
      pOrbits.traverse( function ( object ) { object.visible = value; } );
    });
    var f2 = gui.addFolder("NEOs");
    f2.add(controller, "NEOs").onChange(function(value) {
      neos.traverse( function ( object ) { object.visible = value; } );
    });
    f2.add(controller, "NEO Orbits").onChange(function(value) {
      nOrbits.traverse( function ( object ) { object.visible = value; } );
    });
    // f1.open();
    // f2.open();
  }
  
  function pairsFromData(data) {
    return {
      'NEO ID': data.neo_reference_id,
      'Name': data.name,
      'Link': data.nasa_jpl_url,
      'Absolute Magnitude': data.absolute_magnitude_h,
      'Estimated Diameter': data.estimated_diameter.meters.estimated_diameter_min + ' - ' + data.estimated_diameter.meters.estimated_diameter_max + ' m',
      'Potentially Hazardous': data.is_potentially_hazardous_asteroid
    };
  }
  
  function createObject(data) {
    var orbit = data.orbital_data;
    var a = orbit.semi_major_axis;
    var e = orbit.eccentricity;
    var b = a * Math.sqrt(1 - Math.pow(e, 2));  // semi-minor axis
    var y = -1* a * e;                          // y coord of the center
    var material = new THREE.LineBasicMaterial({color:0x1ed36f, opacity:1});
    // EllipseCurve(Center_Xpos, Center_Ypos, Xradius, Yradius, StartAngle, EndAngle, isClockwise, rotation)
    var ellipse = new THREE.EllipseCurve(0, y, b, a, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    var line = new THREE.Line(ellipseGeometry, material);
    // scene.add(line);
  
  
    var pivot = new THREE.Object3D();     // orbital plane
    var main_axis = new THREE.Object3D(); // used for rotation of the orbital plane
  
    // rotate ellipse using w
    pivot.rotation.z += util.toRadians(orbit.perihelion_argument);
    // rotate ellipse using i (around y, since the semi-major axis was originally along the y-axis)
    pivot.rotation.y += util.toRadians(orbit.inclination);
    // rotate everything using omega, with an offset of -90 degrees for the same reason as above
    main_axis.rotation.z += util.toRadians(orbit.ascending_node_longitude - 90);
    main_axis.add(pivot);
    pivot.add(line);
    return {
      path: ellipsePath,
      pivot: pivot,
      main_axis: main_axis
    };
  }
  
  // opts: diameter, widthSegments, heightSegments, color
  function addObjects(data, opts) {
    if (typeof(opts)==='undefined') {
      opts = {};
    }
    data.forEach(function(datum) {
      var name = datum.name;
      var oobj = createObject(datum);
      // create object mesh
      var geo = new THREE.SphereGeometry(opts.diameter || 0.025, opts.widthSegments || 32, opts.heightSegments || 32);
      var mat = new THREE.MeshLambertMaterial({color: opts.color || 0x00ffff});
      var mesh = new THREE.Mesh(geo, mat);
      // mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = datum;
      // oobj.pivot.add(mesh);
      if (opts.planets) {
        planets.add(mesh);
        pOrbits.add(oobj.main_axis);
      } else {
        neos.add(mesh);
        nOrbits.add(oobj.main_axis);
      }
      
      // plane.add(mesh);
      animated.push({
        orbit: oobj.path,
        object: mesh
      });
      // add label
      var canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      
      // resize text
      var fontface = "verdana";
      var fontsize=44;
      name = name.split(/\(|\)/);
      name = name.length > 1 ? name[1] : name[0];

      do {
        fontsize--;
        ctx.font = fontsize + "px " + fontface;
      } while (ctx.measureText(name).width > canvas.width)
      ctx.fillText(name,128,64);
      
      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      var spriteMat = new THREE.SpriteMaterial({ map: texture });
      var sprite = new THREE.Sprite(spriteMat);
      mesh.add(sprite);
      
      // add events
      // domEvents.addEventListener(mesh, 'click', function(event){
      //   console.log(mesh.userData);
      // }, false);
      
      // the sprite covers the mesh
      if (!opts.planets) {
        domEvents.addEventListener(sprite, 'click', function(event){
          var d = sprite.parent.userData;
          if ($info.attr('id') == d.name) {
            return;
          }
          $info.attr('id',d.name);
          var hid = $($info.children()[0]).css("display");
          $info.empty();
          var $div = $('<ul/>').css("display", hid);
          var pairs = pairsFromData(d);
          // use dat.gui classes to keep styling consistent
          for (var n in pairs) {
            $div.append($('<li/>').addClass('cr').addClass('string')
              .append($('<div/>'))
                .append($('<span/>').addClass('property-name').text(n))
                .append($('<div/>').addClass('c')
                .append($(n=='Link' ? '<a href='+pairs[n]+'>'+pairs[n]+'</a>':'<span>'+pairs[n]+'<span/>'))));
          }
          $info.append($div);
          // add button to toggle view
          var $but = $('<div/>').addClass('close-button').text('Show/Hide Info');
          $but.on('click', function(event){
            $div.toggle();
          });
          $info.append($but);
        }, false);
      }
      
      
    });
  }
  
  const MAX_ITERATIONS = 7;
  const THRESH = 1e-6;
  function eccAnomaly(e, M) {
    // iterative application of Kepler's equation
    var E = M;
    while(true) {
      var dE = (E - e * Math.sin(E) - M)/(1 - e * Math.cos(E));
      E -= dE;
      if( Math.abs(dE) < THRESH ) return E;
    }
  }
  function trueAnomaly(e, E) {
    return Math.atan2(Math.sqrt(1 - e*e) * Math.sin(E), Math.cos(E) - e);
  }
  /*
  https://space.stackexchange.com/questions/8911/determining-orbital-position-at-a-future-point-in-time
  http://www.davidcolarusso.com/astro/#helioeclipxyz
  http://www.jgiesen.de/kepler/kepler.html
  http://www.stjarnhimlen.se/comp/tutorial.html
  http://farside.ph.utexas.edu/teaching/celestial/Celestialhtml/node34.html
  */
  function objPosition(obj,t) {
    var od = obj.userData.orbital_data;
    // orbital elements
    var e = od.eccentricity;
    var a = od.semi_major_axis;
    var i = util.toRadians(od.inclination);
    var omega = util.toRadians(od.ascending_node_longitude);
    var w = util.toRadians(od.perihelion_argument)
    var wbar;
    if (od.perihelion_longitude) {
      wbar = util.toRadians(od.perihelion_longitude);
    } else {
      wbar = w + omega;
    }
    var Mepoch = util.toRadians(od.mean_anomaly);   // mean anomaly at epoch of osculation
    var n;
    if (od.mean_motion) {
      n = util.toRadians(od.mean_motion);
    } else {
      n = 2*Math.PI / od.orbital_period;
    }
    var epoch = od.epoch_osculation;
    var dt = t - epoch;
    var M = Mepoch + n*dt;      // mean anomaly at time t
  
    var E = eccAnomaly(e, M);
    // console.log("Name: " + obj.userData.name);
    // console.log("E: " + E.toString());
    var v = trueAnomaly(e, E);
    // console.log("V: " + v.toString());
    var r = (a * (1 - Math.pow(e, 2))) / (1 + e * Math.cos(v));   // radius vector
  
    // convert to cartesian coordinates
    // heliocentric ecliptic
    var x = r * (Math.cos(omega) * Math.cos(w + v) - Math.sin(omega) * Math.sin(w + v) * Math.cos(i));
    var y = r * (Math.sin(omega) * Math.cos(w + v) + Math.cos(omega) * Math.sin(w + v) * Math.cos(i));
    var z = r * Math.sin(w + v) * Math.sin(i);
  
    // heliocentric equatorial
    // var X = x;
    // var Y = y * Math.cos(i) - z * Math.sin(i);
    // var Z = y * Math.sin(i) + z * Math.cos(i);
    // return [X,Y,Z];
  
    return [x,y,z];
  }
  
  function visualize(data) {
    data.forEach(function(asteroid) {
      addObjects([asteroid],{
        diameter: 0.01,
        widthSegments: 8,
        heightSegments: 8,
        color: asteroid.is_potentially_hazardous_asteroid ? 0xff0000 : 0x00ff00
      });
    });
  };
  
  function init(data) {
    $container = $('#viscontainer');
    // var $date = $('<div/>').addClass('date').text("test");
    // $container.append($date);
    $info = $('<div/>').addClass('visinfo').addClass('dg').addClass('main');
    $container.append($info);
    
    controller = {
      'Time': util.dateFromJD().getJD(), // current time in Julian Days
      'Date': "date",
      'Planet Orbits': true,
      'NEO Orbits': true,
      'Animate': true,
      'Planets': true,
      'NEOs': true,
      'Speed': 1
    };
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, $container.width() / $container.height(), 0.1, 1000 );
  
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize( $container.width(), $container.height() );
    $container.append( $(renderer.domElement) );
    
    domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
  
    // let there be light
    var light = new THREE.PointLight( 0xffffff, 1, 0, 2 );
    light.castShadow = true;
    light.position.set( 0, 0, 0 );
    scene.add( light );
    // praise the sun
    var geometry = new THREE.SphereGeometry( 0.05, 32, 32 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var sp = new THREE.Mesh( geometry, material );
    scene.add( sp );
  
    // parent of all the object meshes
    // plane = new THREE.Object3D();
    planets = new THREE.Object3D();
    neos = new THREE.Object3D();
    pOrbits = new THREE.Object3D();
    nOrbits = new THREE.Object3D();
    // scene.add(plane);
    scene.add(planets);
    scene.add(neos);
    scene.add(pOrbits);
    scene.add(nOrbits);
  
    // the ecliptic plane
    var cir_geo = new THREE.CircleGeometry( );
    var cir_mat = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.7 } );
    cir_mat.transparent = true;
    var circle = new THREE.Mesh( cir_geo, cir_mat );
    scene.add( circle );
  
    camera.position.z = 2;
    camera.position.y = -2;
    camera.lookAt(new THREE.Vector3(0,0,0));
  
    // make camera controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    // controls.addEventListener('change', render); 
    // controls.panSpeed = 1;
    controls.rotateSpeed = 3;
    controls.zoomSpeed = 3;
    // enable animation loop when using damping or autorotation
  	// controls.enableDamping = true;
  	// controls.dampingFactor = 0.25;
  	// controls.enableZoom = false;
    window.addEventListener( 'resize', onWindowResize, false );
    
    initGUI();
  }
  
  function scaleLabels() {
    // resize labels
    // https://stackoverflow.com/questions/40446915/three-js-keep-label-size-on-zoom/40452050#40452050
  	var scaleVector = new THREE.Vector3();
    var scaleFactor = 4;
    animated.forEach(function(l) {
      var sprite = l.object.children[0];
      var scale = scaleVector.subVectors(l.object.position, camera.position).length() / scaleFactor;
      sprite.scale.set(scale, scale, 1);
    });
  }
  
  function render() {
    scaleLabels();
    renderer.render( scene, camera );
  }
  function animate() {
    // var $date = $('.date');
    // $date.text(util.dateFromJD(controller['time']));
    controller['Date'] = util.dateFromJD(controller['Time']).toDateString();
    
  	controls.update();
    
    if (controller['Animate']) {
      animated.forEach(function(l) {
        var pos = objPosition(l.object, controller['Time'])
        l.object.position.set(pos[0],pos[1],pos[2]);
      });
      controller['Time'] += controller['Speed']/60;
    }
    
  	render();
    // 60 FPS
    setTimeout( function() {
      requestAnimationFrame( animate );
    }, 1000 / 60 );
  }
  
  init();
  addObjects(PLANETS_DATA, {planets: true});
  visualize(ASTEROIDS_DATA);
  
  // render();
  animate();
});