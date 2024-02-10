import React, { useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

//theeScene component with meshurl as prop
const ThreeScene = (prop) => {

    const leftmeshurl = prop.leftmeshurl;
    const rightmeshurl = prop.rightmeshurl;
    const leftitem = prop.leftitem;
    const rightitem = prop.rightitem;

    var leftfiletype = "";
    var leftscale = {x: 1, y: 1, z: 1}
    var leftrotation = {x: 0, y: 0, z: 0}

    var rightfiletype = "";
    var rightscale = {x: 1, y: 1, z: 1}
    var rightrotation = {x: 0, y: 0, z: 0}

    console.log(leftitem);
    console.log(rightitem);
    
    if (leftitem != "") {
        leftfiletype = leftitem.filetype;
        leftscale = leftitem.scale || {x: 1, y: 1, z: 1};
        leftrotation = leftitem.rotation || {x: 0, y: 0, z: 0};
    }

    if (rightitem != "") {
        rightfiletype = rightitem.filetype;
        rightscale = rightitem.scale || {x: 1, y: 1, z: 1};
        rightrotation = rightitem.rotation || {x: 0, y: 0, z: 0};
    }

    const sceneRef1 = useRef(null);
    const sceneRef2 = useRef(null);

    const rendererRef1 = useRef(null);
    const rendererRef2 = useRef(null);

    const windowWidth = (window.innerWidth*0.8)/2;
    const windowHeight = (window.innerHeight*0.8)/2;
  
    useEffect(() => {


        const scene1 = new THREE.Scene();        
        const camera1 = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
        camera1.position.z = 5;
        
        // Set up renderer
        const renderer1 = new THREE.WebGLRenderer();
        renderer1.setSize(windowWidth, windowHeight);
        rendererRef1.current = renderer1;
        sceneRef1.current.appendChild(renderer1.domElement);
        
        // Set up controls
        const controls1 = new OrbitControls(camera1, renderer1.domElement);

        // Create an ambient light to provide global illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene1.add(ambientLight);

        // Create a directional light to simulate sunlight
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight1.position.set(0, 1, 0);
        scene1.add(directionalLight1);


        if (leftmeshurl && leftfiletype === 'fbx') {
            const loader = new FBXLoader();
            loader.load(leftmeshurl, function (object) {

                object.scale.set(leftscale.x, leftscale.y, leftscale.z);
                object.rotation.set(leftrotation.x, leftrotation.y, leftrotation.z);
                scene1.add(object); 
            });
        }

        if (leftmeshurl && leftfiletype === 'ply') {
            const loader = new PLYLoader();
            loader.load(leftmeshurl, function (geometry) {
                geometry.computeVertexNormals();
                var material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.5,
                    metalness: 0.5,
                });                    
                var mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true; // Enable shadow casting
                mesh.receiveShadow = true; // Enable shadow receiving

                mesh.scale.set(leftscale.x, leftscale.y, leftscale.z);
                mesh.rotation.set(leftrotation.x, leftrotation.y, leftrotation.z);
                scene1.add(mesh);
            });
        }
        
        // Set up a simple cube
        const geometry1 = new THREE.BoxGeometry();
        const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube1 = new THREE.Mesh(geometry1, material1);
        // scene1.add(cube1);
        
        controls1.update()

        // Render loop
        const animate1 = () => {
            requestAnimationFrame(animate1);            
            renderer1.render(scene1, camera1);
        };        
        animate1();

        const scene2 = new THREE.Scene();        
        const camera2 = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
        camera2.position.z = 5;
        
        // Set up renderer
        const renderer2 = new THREE.WebGLRenderer();
        renderer2.setSize(windowWidth, windowHeight);
        rendererRef2.current = renderer2;
        sceneRef2.current.appendChild(renderer2.domElement);

        const controls2 = new OrbitControls(camera1, renderer2.domElement);

        // Create an ambient light to provide global illumination
        const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene2.add(ambientLight2);

        // Create a directional light to simulate sunlight
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene2.add(directionalLight);

        if (rightmeshurl && rightfiletype === 'fbx') {
            const loader = new FBXLoader();
            loader.load(rightmeshurl, function (object) {
                object.scale.set(rightscale.x, rightscale.y, rightscale.z);
                object.rotation.set(rightrotation.x, rightrotation.y, rightrotation.z);
                scene2.add(object); 
            });
        }

        if (rightmeshurl && rightfiletype === 'ply') {
            const loader = new PLYLoader();
            loader.load(rightmeshurl, function (geometry) {
                geometry.computeVertexNormals();
                var material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.5,
                    metalness: 0.5,
                });                    
                var mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true; // Enable shadow casting
                mesh.receiveShadow = true; // Enable shadow receiving

                mesh.scale.set(rightscale.x, rightscale.y, rightscale.z);

                // rotate the mesh upside down
                mesh.rotation.set(rightrotation.x, rightrotation.y, rightrotation.z);

                scene2.add(mesh);
            });             
        }
        
        // Set up a simple cube
        const geometry2 = new THREE.BoxGeometry();
        const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube2 = new THREE.Mesh(geometry2, material2);
        // scene2.add(cube2);

        controls2.update()

        function updateCameras() {
            camera2.position.copy(camera1.position);
            camera2.rotation.copy(camera1.rotation);
            // Adjust camera2 position or rotation as needed
        }

        // Render loop
        const animate2 = () => {
            requestAnimationFrame(animate2);
            updateCameras();            
            renderer2.render(scene2, camera2);
        };        
        animate2();
        
        // Cleanup
        return () => {
            // Dispose of materials and geometries
            geometry1.dispose();
            material1.dispose();
            geometry2.dispose();
            material2.dispose();
            
            // Dispose of the renderer
            rendererRef1.current.dispose();
            rendererRef2.current.dispose();
        };
    }, [windowHeight, windowWidth]);
  
    return (
        <>
            <Row>
                <Col span={12}>
                    <div ref={sceneRef1} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} />
                </Col>
                <Col span={12}>
                    <div ref={sceneRef2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} />
                </Col>
            </Row>
        </>
    );
};
  
export default ThreeScene;
  

