import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { fill } from 'three/src/extras/TextureUtils.js';
import { Vector3 } from 'three/webgpu';

(async () => {

    await new Promise(reslove => {
        window.addEventListener('DOMContentLoaded', reslove)
    })
    document.body.style.margin = '0px'

    // -------------------------

    const gui = new GUI();

    const scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 0.66, 50)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 5;
    camera.lookAt(new Vector3)
    // renderer
    const renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: true,
        stencil: true,
        depth: true,
    });
    // 顏色空間設置
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // 預設背景顏色 透明
    renderer.setClearColor(0, 0.0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    const axes = new THREE.AxesHelper(5)
    scene.add(axes);

    // 斷行設計
    function getLines(ctx, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    let ctx = document.createElement('canvas').getContext('2d')
    ctx.canvas.width = 500
    ctx.canvas.height = 500

    let text = `
     文案測試 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. 
    `
    // ctx.fillStyle = '#333'
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#FFF'
    ctx.font = '24px Arial'
    let lines = getLines(ctx, text, ctx.canvas.width)

    lines.forEach((line, idx) => {
        ctx.fillText(line, 0, 22 + idx * 24)
        ctx.fill()
    })

    let imgC = new THREE.CanvasTexture(ctx.canvas)
    const imgPlane = new THREE.PlaneGeometry(ctx.canvas.width / 100, ctx.canvas.height / 100)
    const imgM = new THREE.MeshStandardMaterial({ map: imgC, transparent: true });
    const imgBox = new THREE.Mesh(imgPlane, imgM);
    imgBox.rotateX(-90 / 180 * Math.PI)
    scene.add(imgBox)

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, metalness: .619, roughness: .666 });
    const controls = new OrbitControls(camera, renderer.domElement);

    let lightP = new THREE.PointLight(0xffd877)
    lightP.position.set(0, 1, 0)
    lightP.intensity = 3.9
    scene.add(lightP)

    //建構環境光源
    const light = new THREE.AmbientLight(0xe0edd4);
    light.intensity = 0.85
    //將光源加進場景中
    scene.add(light);

    // 主光源
    const lightD = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightD.position.set(-5.9, 7.5, 7.26)
    lightD.intensity = 3.15
    scene.add(lightD)

    // 反射光源
    const lightFloor = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightFloor.position.set(100, -100, -100)
    lightFloor.intensity = 1.55
    scene.add(lightFloor)

    let camFolder = gui.addFolder('Camera Settings')
    camFolder.add(camera.position, 'x', -10, 10).name('position x');
    camFolder.add(camera.position, 'y', -10, 10).name('position y');
    camFolder.add(camera.position, 'z', -10, 10).name('position z');
    let mainLightFolder = gui.addFolder('Env Settings')
    mainLightFolder.addColor(lightP, 'color').name('Light Color');
    mainLightFolder.add(lightP, 'intensity', 0, 50).name('Light Intensity');
    mainLightFolder.add(lightP.position, 'x', -10, 10).name('Light x');
    mainLightFolder.add(lightP.position, 'y', -10, 10).name('Light y');
    mainLightFolder.add(lightP.position, 'z', -10, 10).name('Light z');

    let materialFolder = gui.addFolder('Material')
    materialFolder.addColor(material, 'color').name('Material Color');
    materialFolder.addColor(material, 'emissive').name('Material Emissive');
    materialFolder.add(material, 'metalness', 0, 1).name('Material Metalness');
    materialFolder.add(material, 'roughness', 0, 1).name('Material Roughness');
    materialFolder.add(material, 'wireframe')

    function animate() {
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onWindowResize()

    document.body.style.background = `linear-gradient(rgb(11,11,11),rgb(99, 99, 99))`
})()