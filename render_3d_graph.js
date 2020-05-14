
function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    var cubeGeometry = new THREE.BoxGeometry(1, 3, 1);
    var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    
    var planeGeometry = new THREE.planeGeometry(3, 3);
    var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xf0f0f0, side: THREE.DoubleSide} );
    
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    
    scene.add( plane );
    scene.add(cube);
    
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    
    camera.lookAt(0, 0, 0);
}

function update() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

function animate() {
    requestAnimationFrame( animate );

    update();

    renderer.render(scene, camera);
}

init();
animate();
