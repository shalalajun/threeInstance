import * as THREE from 'three';
import Project from "../Project";
import vertex from "../assets/shaders/vertex.glsl";
import fragment from "../assets/shaders/fragment.glsl";



export default class CircleInstance
{
    constructor(x,y)
    {
        this.project = new Project();
        this.scene = this.project.scene;
        
        this.mesh;
        

        this.center = new THREE.Vector3(0,0,0);
        this.radius = 10.0;
        this.angle = 0;
        this.position = new THREE.Vector3(x,y,0);
        this.velocity = new THREE.Vector3(0,0,0);
        this.acceleration = new THREE.Vector3(0,0,0);

        this.width = window.innerWidth;
        this.height =window.innerHeight;

        this.resolution = 30;

        this.setMesh();

       
    }

    setMesh()
    {
        this.circleGeometry = new THREE.BoxGeometry(1,1,1);
        this.circleMaterial = new THREE.MeshStandardMaterial({color:'white'});
        this.mesh = new THREE.InstancedMesh(this.circleGeometry, this.circleMaterial);
       // this.circle = new THREE.Mesh(this.circleGeometry, this.circleMaterial);   
        //this.scene.add(this.mesh);
        return this.mesh;

    }

    update()
    {
        this.angle += 0.01;
        //const px = this.center.x + this.radius * Math.cos(this.angle); 
        const py = this.wave(this.position.x, this.angle);
        this.position.set(0,py,0);
        this.circle.position.copy(this.position);
    }
} 