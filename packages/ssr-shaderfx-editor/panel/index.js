//
const Fs = require("fire-fs");
const Path = require("fire-path");
const electron = require("electron");
window.__electron = electron;
window.__Fs = Fs;

Editor.require("packages://ssr-shaderfx-editor/ssr-shaderfx-editor/src/settings.js");
Editor.require("packages://ssr-shaderfx-editor/ssr-shaderfx-editor/main.js");

Editor.Panel.extend({
    style: Fs.readFileSync(Editor.url("packages://ssr-shaderfx-editor/ssr-shaderfx-editor/style-desktop.css", "utf8")),
    template: `
        <div id="GameDiv" style="width:1336px; height: 640px;">
            <canvas id="GameCanvas"></canvas>
        </div>
    `,
    ready() {
        function loadScript(moduleName, cb) {
            function scriptLoaded() {
                document.body.removeChild(domScript);
                domScript.removeEventListener("load", scriptLoaded, false);
                cb && cb();
            };
            var domScript = document.createElement("script");
            domScript.async = true;
            domScript.src = moduleName;
            domScript.addEventListener("load", scriptLoaded, false);
            document.body.appendChild(domScript);
        }
        let self = this;
        loadScript(Editor.url("packages://ssr-shaderfx-editor/ssr-shaderfx-editor/cocos2d-js-min.js", "utf8"), function() {
            self.polyfill();
            window.boot();
        });
    },
    polyfill () {
        cc.game._initRenderer = function () {
            // Avoid setup to be called twice.
            if (this._rendererInitialized) return;
            var el = this.config.id,
                width,
                height,
                localCanvas,
                localContainer;

            if (CC_JSB || CC_RUNTIME) {
              this.container = localContainer = document.createElement("DIV");
              this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
              localCanvas = window.__canvas;
              this.canvas = localCanvas;
            } else {
              var addClass = function addClass(element, name) {
                var hasClass = (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1;

                if (!hasClass) {
                  if (element.className) {
                    element.className += " ";
                  }

                  element.className += name;
                }
              };
              var element = document.getElementById(Editor.argv.panelID).shadowRoot.getElementById("GameDiv");
              if (element.tagName === "CANVAS") {
                width = element.width;
                height = element.height; //it is already a canvas, we wrap it around with a div

                this.canvas = localCanvas = element;
                this.container = localContainer = document.createElement("DIV");
                if (localCanvas.parentNode) localCanvas.parentNode.insertBefore(localContainer, localCanvas);
              } else {
                //we must make a new canvas and place into this element
                if (element.tagName !== "DIV") {
                  cc.warnID(3819);
                }

                width = element.clientWidth;
                height = element.clientHeight;
                this.canvas = localCanvas = document.createElement("CANVAS");
                this.container = localContainer = document.createElement("DIV");
                element.appendChild(localContainer);
              }

              localContainer.setAttribute('id', 'Cocos2dGameContainer');
              localContainer.appendChild(localCanvas);
              this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
              addClass(localCanvas, "gameCanvas");
              localCanvas.setAttribute("width", width || 480);
              localCanvas.setAttribute("height", height || 320);
              localCanvas.setAttribute("tabindex", 99);
            }

            this._determineRenderType(); // WebGL context created successfully


            if (this.renderType === this.RENDER_TYPE_WEBGL) {
              var opts = {
                'stencil': true,
                // MSAA is causing serious performance dropdown on some browsers.
                'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
                'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS
              };
              cc.renderer.initWebGL(localCanvas, opts);
              this._renderContext = cc.renderer.device._gl; // Enable dynamic atlas manager by defaul
            }

            if (!this._renderContext) {
              this.renderType = this.RENDER_TYPE_CANVAS; // Could be ignored by module settings

              cc.renderer.initCanvas(localCanvas);
              this._renderContext = cc.renderer.device._ctx;
            }

            this.canvas.oncontextmenu = function () {
              if (!cc._isContextMenuEnable) return false;
            };
            this._rendererInitialized = true;
        };
    },
    messages: {
        "ssr-shaderfx-editor:c2p_test"(event, data) {
        },
        "ssr-shaderfx-editor:p2c_test"(event, data) {
            Editor.Scene.callSceneScript("ssr-shaderfx-editor", "get-canvas-children", data);
        }
    }
});