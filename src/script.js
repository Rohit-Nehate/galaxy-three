import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * galaxy 
 */

const parameters = {}
parameters.count = 20000
parameters.size = .02
parameters.radius= 5
parameters.branches= 3
parameters.spin= 1
parameters.randomness= .2
parameters.randomnessPower= 3
parameters.colorOutside= '#2b0099'
parameters.colorInside= '#ff4700'
parameters.rotate= .2

// gui 

gui.add(parameters,  'count').min(100).max(1000000).step(100).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'size').min(.02).max(.10).step(.02).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'radius').min(.02).max(20).step(.02).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'branches').min(2).max(20).step(1).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'spin').min(-5).max(5).step(.002).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'randomnessPower').name('less randomness').min(1).max(10).step(.002).onFinishChange(()=>{galaxyGenerator()})
gui.add(parameters,  'rotate').min(-1).max(1).step(.002).onFinishChange(()=>{galaxyGenerator()})

gui.addColor(parameters,  'colorInside').onFinishChange(()=>{galaxyGenerator()})
gui.addColor(parameters,  'colorOutside').onFinishChange(()=>{galaxyGenerator()})


// galagy generator

let geometry = null
let material= null
let points = null



const galaxyGenerator = ()=>{

    if(geometry!=null){

        points.geometry.dispose()
        points.material.dispose()
        scene.remove(points)
      
        
    }

    // geometry 
     geometry = new THREE.BufferGeometry()

    const position = new Float32Array(parameters.count *3)
    const colors = new Float32Array(parameters.count *3)
     for(let i =0 ; i < parameters.count ; i++){
let i3 = i*3



const radius = Math.random() * parameters.radius 
const spinAngle = parameters.spin * radius
const branchesAngle = (i % parameters.branches)/ parameters.branches * Math.PI * 2

const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1 : -1)
const randomY= Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1 : -1)
const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1 : -1)

position[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX
position[i3+1] = randomY
position[i3+2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ


//color
const colorInside = new THREE.Color(parameters.colorInside)
const colorOutside = new THREE.Color(parameters.colorOutside)

const mixColor = colorInside.clone()
mixColor.lerp(colorOutside, radius/ parameters.radius)

colors[i3] = mixColor.r
colors[i3 +1] = mixColor.g
colors[i3+ 2] = mixColor.b

     }

     geometry.setAttribute('position', new THREE.BufferAttribute(position,3))
     geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))

    //  material
     material = new THREE.PointsMaterial({
        size : parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, 
        vertexColors: true
    })

    //  particles

     points = new THREE.Points(geometry, material)
    scene.add(points)

}

galaxyGenerator()
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    
    const elapsedTime = clock.getElapsedTime()

    points.rotation.y = elapsedTime * parameters.rotate
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()