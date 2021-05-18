/**
 * Description
 * ===========
 * create a text object by rendering HTML
 *
 * Usage
 * =====
 * Create a plane in Blender and give it a material (just the default Principled BSDF).
 * Assign color image to "color" channel and depth map to "emissive" channel.
 * You may want to set emissive strength to zero so the preview looks better.
 * Add the "parallax" component from the Hubs extension, configure, and export as .glb
 */

//import {WebLayer3D, toDOM, THREE} from '/node_modules/ethereal/dist/ethereal.es.js'

// const errorHTML = '<div id="hello" xr-width="2" style="width: 200px; height: 30px; background: rgba(1, 0, 0, 0.6); position:absolute">No Text Provided</div>'

//import * as htmlComponents from "https://resources.realitymedia.digital/test-vue-app/dist/hubs.js";
import * as htmlComponents from "https://blairhome.ngrok.io/test-vue-app/dist/hubs.js";
AFRAME.registerComponent('html-script', {
  init: function () {

    this.parseNodeName().then( () => {
        if (!this.scriptData) return

        this.simpleContainer = new THREE.Object3D()
        this.simpleContainer.matrixAutoUpdate = true
        this.simpleContainer.add(this.scriptData.webLayer3D)

        const width = this.scriptData.width
        const height = this.scriptData.height
        if (width && width > 0 && height && height > 0) {
            var bbox = new THREE.Box3().setFromObject(this.scriptData.webLayer3D);
            var wsize = bbox.max.x - bbox.min.x
            var hsize = bbox.max.y - bbox.min.y
            var scale = Math.min(width / wsize, height / hsize)
            this.simpleContainer.scale.set(scale,scale,scale)
        }
        this.el.object3D.add(this.simpleContainer)
        setInterval(() => {
            this.scriptData.webLayer3D.update()
        }, 50)
    })
  },

  // INTERACTION
  // [1:05 PM] Speiginer, Gheric
    // layer.interactionRays = [ray, orObject3D, etc.]
    //     If you pass an object, it assumes +Z in object-space is the ray
    //     Or might be -Z… whatever the WebXR controllers do
    //     To create a ray from a intersection point, you can covert the point to object space, 
    //     set the direction vector to -z (0,0,-1), then convert back into world space
    
parseNodeName: async function () {
    const nodeName = this.el.parentEl.parentEl.className

    // nodes should be named anything at the beginning with 
    //  "dirname_filename"
    // at the very end.  This will fetch a file from the resources
    // directory data/htmltext/dirname/filename
    const params = nodeName.match(/([A-Za-z0-9]*)_([A-Za-z0-9]*)$/)
    
    // if pattern matches, we will have length of 3, first match is the dir,
    // second is the filename name or number
    if (!params || params.length < 3) {
        console.warn("html-script dirname_filename not formatted correctly: ", nodeName)
        this.dirname = null
        this.filename = null
        this.scriptData = null
    } else {
        this.dirname = params[1]
        this.filename = params[2]

        var initScript = htmlComponents[this.filename]
        if (!initScript) {
            console.warn("'html-script' component doesn't have script for " + nodeName);
            this.scriptData = null
            return;
        }

        this.scriptData = initScript(htmlComponents.styles)
        if (this.scriptData){
            //this.scriptData.webLayer3D.refresh()
            this.scriptData.webLayer3D.update()
        } else {
            console.warn("'html-script' component failed to initialize script for " + nodeName);
        }
        // try {
        //     const scriptURL = "https://resources.realitymedia.digital/test-vue-app/" + this.filename + ".js"
        //     var scriptPromise = import(scriptURL);
        //     try {
        //         const {d} = await scriptPromise;
        //         this.scriptData = d
        //         this.div = this.scriptData.div
        //         this.scriptData.webLayer3D.update()
        //     } catch (err) {
        //         this.scriptData = null;
        //         console.error(`Custom script for html-script componentg ${nodeName} failed to load. Reason: ${err}`);
        //     }
        // } catch (e) {
        //     console.warn("Couldn't fetch script for " + nodeName);
        // }  
    }
  },

})