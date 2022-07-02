import './style.css'
import  gsap from "gsap"
import * as THREE from "three"
import disp from "./assets/images/disp.jpg"
import img1 from "./assets/images/1.jpg"
import img2 from "./assets/images/2.jpg"
import img3 from "./assets/images/3.jpg"
import img4 from "./assets/images/4.jpg"
import frag from "./assets/shader/main.frag?raw"
import vert from "./assets/shader/main.vert?raw"

class main{
  constructor(webgl){
    this.webgl = webgl
    this.width = innerWidth
    this.height = innerHeight

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })

    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    this.renderer.setSize(this.width, this.height)

    this.loadManager = new THREE.LoadingManager()
    this.loader = new THREE.TextureLoader(this.loadManager)

    this.img1 = this.loader.load(img1)
    this.img2 = this.loader.load(img2)
    this.img3 = this.loader.load(img3)
    this.img4 = this.loader.load(img4)
    this.disp = this.loader.load(disp)

    this.aspect = 1080 / 1920

    this.loadManager.onLoad = () =>{
      this.setting()
      this.init()
    }
  }

  init(){
    gsap.to(this.material.uniforms.uAnimation,{
      value: 1,
      duration: 2,
      delay: 1,
      ease: "expo.in"
    })
  }

  setting(){
    this.webgl.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      180 * (2 * Math.atan(this.height / 2 / 800)) / Math.PI,
      this.width / this.height,
      1,
      10000
    )

    this.camera.position.set(
      0,
      0,
      800
    )
    this.setMesh()
  }

  setMesh(){
    this.geometry = new THREE.PlaneBufferGeometry(1,1,1,1)
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uResolution: {
          value: this.setCover(this.aspect)
        },
        uAnimation: {
          value: 0
        },
        uTexture1: {
          value: this.img1,
        },
        uTexture2: {
          value: this.img2,
        },
        uTexture3: {
          value: this.img3,
        },
        uTexture4: {
          value: this.img4,
        },
        uDisp: {
          value: this.disp,
        },
      }
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
    this.mesh.scale.x = this.width
    this.mesh.scale.y = this.height

    requestAnimationFrame(this.onRaf.bind(this))
  }

  setCover(aspect){
    let x,y
    if(this.height / this.width > aspect){
      x = (this.width / this.height) * aspect
      y = 1
    }else{
      x = 1
      y = (this.height / this.width) / aspect
    }

    return new THREE.Vector2(x,y)
  }

  onResize(){
    this.width = innerWidth
    this.height = innerHeight
    this.material.uniforms.uResolution.value = this.setCover(this.aspect)
    this.mesh.scale.x = this.width
    this.mesh.scale.y = this.height
    this.camera.aspect = this.width / this.height
    this.camera.fov = 180 * (2 * Math.atan(this.height / 2 / 800)) / Math.PI
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  onRaf(){
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.onRaf.bind(this))
  }
}

addEventListener("load", _ =>{
  const webgl = new main(document.querySelector("#canvas"))
  addEventListener("resize", _ =>{
    webgl.onResize()
  })
})