import React, { useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

//theeScene component with meshurl as prop
const ThreeScene = (prop) => {

    const meshurl = prop.meshurl;



    const sceneRef1 = useRef(null);
    const sceneRef2 = useRef(null);

    const rendererRef1 = useRef(null);
    const rendererRef2 = useRef(null);

    const windowWidth = (window.innerWidth*0.8)/2;
    const windowHeight = (window.innerHeight*0.8)/2;
  
    useEffect(() => {

        console.log('meshurl', meshurl);

        


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

        if (meshurl) {
            const loader = new FBXLoader();
            loader.load(meshurl, function (object) {
                // Assuming you have a scene already initialized
                console.log('object', object);
                // give the object a the same material
                object.traverse(child => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    }
                });
                scene1.add(object);
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
        
        // Set up a simple cube
        const geometry2 = new THREE.BoxGeometry();
        const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube2 = new THREE.Mesh(geometry2, material2);
        scene2.add(cube2);

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
  

