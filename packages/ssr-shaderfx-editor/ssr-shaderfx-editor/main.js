window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;
    
    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        onProgress = function (finish, total) {
            var percent = 100 * finish / total;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    if (typeof(Editor) != "undefined") {
        const REGEX = /^(?:\w+:\/\/|\.+\/).+/;
        cc.assetManager.downloader._downloaders.bundle = function (nameOrUrl, options, onComplete) {
            let bundleName = cc.path.basename(nameOrUrl);
            let url = nameOrUrl;
            // if (!REGEX.test(url)) url = 'assets/' + bundleName;
            // console.log(Editor.Project.path);
            // console.log(Editor.url('packages://ssr-shaderfx-editor/ssr-shaderfx-editor/assets/' + bundleName));
            // url = Editor.Project.path + "/packages/ssr-shaderfx-editor/ssr-shaderfx-editor/assets/" + bundleName;
            url = Editor.url('packages://ssr-shaderfx-editor/ssr-shaderfx-editor/assets/' + bundleName);
            var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
            var count = 0;
            var config = `${url}/config.${version ? version + '.' : ''}json`;
            let out = null, error = null;
            cc.assetManager.downloader._downloaders['.json'](config, options, function (err, response) {
                if (err) {
                    error = err;
                }
                out = response;
                out && (out.base = url + '/');
                count++;
                if (count === 2) {
                    onComplete(error, out);
                }
            });

            var js = `${url}/index.${version ? version + '.' : ''}js`;
            cc.assetManager.downloader.downloadScript(js, options, function (err) {
                if (err) {
                    error = err;
                }
                count++;
                if (count === 2) {
                    onComplete(error, out);
                }
            });
        };
    }

    var onStart = function () {

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isBrowser) {
            // setLoadingDisplay();
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_BAIDU_APP,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
                cc.sys.BROWSER_TYPE_HUAWEI,
                cc.sys.BROWSER_TYPE_UC,
            ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 2;
            cc.assetManager.downloader.maxRequestsPerFrame = 2;
        }

        var launchScene = settings.launchScene;
        var bundle = cc.assetManager.bundles.find(function (b) {
            return b.getSceneInfo(launchScene);
        });
        
        bundle.loadScene(launchScene, null, onProgress,
            function (err, scene) {
                if (!err) {
                    cc.director.runSceneImmediate(scene);
                    if (cc.sys.isBrowser) {
                        // show canvas
                        // var canvas = document.getElementById('GameCanvas');
                        // var canvas = document.getElementById("ssr-shaderfx-editor").shadowRoot.getElementById("GameCanvasGameCanvas");
                        // cc.log("canvas");
                        // cc.log(canvas);
                        // canvas.style.visibility = '';
                        // var div = document.getElementById('GameDiv');
                        var div = document.getElementById("ssr-shaderfx-editor").shadowRoot.getElementById("GameDiv");
                        div.style.width = "100%";
                        div.style.height = "100%";
                        // if (div) {
                        //     div.style.backgroundImage = '';
                        // }
                        // console.log('Success to load scene: ' + launchScene);
                        cc.view._resize();
                    }
                }
            }
        );

    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({ 
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server
    });
    
    var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.assetManager.loadBundle(MAIN, function (err) {
                if (!err) cc.game.run(option, onStart);
            });
        }
    }

    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

    for (var i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};

if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}
