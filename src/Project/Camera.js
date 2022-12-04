
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Project from "./Project.js";

export default class Camera
{
    constructor()
    {
        this.project = new Project();
        this.sizes = this.project.sizes;
        this.scene = this.project.scene;
        this.canvas = this.project.canvas;
       
        this.setInstance();
        this.setOrbitControls();

       
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        );
        this.instance.position.set(-6, 6, 4);
        this.scene.add(this.instance);
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update()
    {
        this.controls.update();
    }
}