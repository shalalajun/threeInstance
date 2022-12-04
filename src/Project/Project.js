import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import Circle from './World/Circle.js';
import CircleInstance from './World/CircleInstance.js';
import GUI from 'lil-gui'; 
import Stats from 'stats.js';




let instance = null;

export default class Project
{
    constructor(canvas)
    {

        if(instance)
        {
            return instance;
        }

        instance = this;


        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

       
        this.preset = {};
        this.gui = new GUI();
        this.parameter =
        {
            function: 1,
            resolution: 10,
     
        };

        this.resolution = this.parameter.resolution;
        this.gui.add(this.parameter,'function',0,2,1);
        // this.gui.add(this.parameter,'resolution',10,100,1)
        //         .onChange(() =>
        //         {
        //             console.log(this.parameter.resolution)
        //             //this.resolution = this.parameter.resolution;
        //         })
       

        window.project = this;
        this.canvas =canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x4c4c4c);
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
      
       

        this.center = new THREE.Vector3(0,0,0);
        this.radius = 2.0;
        this.angle = 0;
        this.resolution = 120;
        this.points = this.resolution * this.resolution;
        
     
        this.matrix = new THREE.Matrix4();
        this.dummy = new THREE.Object3D();

        this.circleGeometry = new THREE.BoxGeometry(1,1,1);
        this.circleMaterial = new THREE.MeshStandardMaterial({color:'white', metalness: 0.2, roughness: 0.8});
        console.log( this.circleMaterial.metalness)
        this.circleInstances = new THREE.InstancedMesh(this.circleGeometry, this.circleMaterial,  this.points);
        console.log(this.circleInstances);
        this.circleInstances.castShadow = true;
        this.circleInstances.receiveShadow = true;
        

        this.scale = new THREE.Vector3();
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        this.quaternion = new THREE.Quaternion();
        

        this.circleInstances.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
        this.scene.add(this.circleInstances);

       
        this.sizes.on('resize',()=>
        {
            this.resize();
        })

        this.time.on('tick',()=>
        {
           this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
        
    }

    update()
    {
        this.stats.begin();
        this.camera.update();
        this.renderer.update(); 
        this.updateinstance();
        this.stats.end();
        
    }


    updateinstance()
    {
        

        this.angle = this.angle + 0.015;
        this.circleInstances.rotation.y = Math.PI/2;
	    // this.circleInstances.rotation.y = Math.sin( this.angle / 2 );
       
        
        let step = 2 / this.resolution;
        let scale = step;

        for(let i=0, x=0, z=0; i < this.points ; i++, x++)
        {
                    if(x == this.resolution )
                    {
                        x = 0;
                        z += 1;
                    }
                    let ix = (x + 0.5) * step -1;
                    let iz = (z + 0.5) * step -1;
                    let iy;

                    if(this.parameter.function == 0){
                            iy = this.wave(ix, iz, this.angle);
                    }else if(this.parameter.function == 1){
                            iy = this.multiWave(ix, iz, this.angle);
                    }else{
                            iy = this.ripple(ix, iz, this.angle);
                    }
                   
                    this.dummy.position.set( ix, iy, iz );
                    this.dummy.scale.set(scale, scale, scale);
                    this.dummy.updateMatrix();
                    this.circleInstances.setMatrixAt( i , this.dummy.matrix );
                
              
            
        }
      
        this.circleInstances.instanceMatrix.needsUpdate = true;

    }

    wave(x, z, t)
    {
        let wy = Math.sin(Math.PI * (x +z + t));
        return wy;
    }

    multiWave(x, z, t)
    {
        let my = Math.sin(Math.PI * (x + 0.5 + t));
        my += Math.sin(2* Math.PI * (z + t)) * 0.5;
        my += Math.sin(Math.PI * (x + z + 0.25 + t));
        return my * (1 / 2.5);
    }

    ripple(x, z, t)
    {
        let d = Math.abs(x * x + z * z);
        let ry = Math.sin(Math.PI * (4 * d - this.angle));
        return ry / (1 + 10 * d);
    }
}