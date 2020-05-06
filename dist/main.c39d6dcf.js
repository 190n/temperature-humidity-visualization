// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"main.ts":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function pickColorByTheme(lightThemeColor, darkThemeColor) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return darkThemeColor;
  } else {
    return lightThemeColor;
  }
}

function createPlot(rows, index, hoursStep, radiusStep, radiusSuffix, canvas) {
  var vals = rows.map(function (r) {
    return r[index];
  }),
      min = Math.min.apply(null, vals),
      max = Math.max.apply(null, vals),
      overallRadius = Math.min(canvas.width, canvas.height) / 2,
      ctx = canvas.getContext('2d');
  var mouseX = 0,
      mouseY = 0;
  var fakeCanvas = document.createElement('canvas');
  fakeCanvas.width = canvas.width;
  fakeCanvas.height = canvas.height;
  var fakeCtx = fakeCanvas.getContext('2d');
  var tooltip = document.createElement('div'),
      timeDisplay = document.createElement('h1'),
      valuesDisplay = document.createElement('ul'),
      averageDisplay = document.createElement('li');
  tooltip.classList.add('tooltip');
  tooltip.appendChild(timeDisplay);
  averageDisplay.appendChild(document.createElement('strong'));
  valuesDisplay.appendChild(averageDisplay);
  tooltip.appendChild(valuesDisplay);
  document.body.appendChild(tooltip);

  function getCoords(t, val) {
    var rad = (val - min) / (max - min) * overallRadius / 2 + overallRadius / 2,
        angle = t / (24 * 60 * 60 * 1000) * 2 * Math.PI;
    return [overallRadius + Math.cos(angle) * rad, overallRadius + Math.sin(angle) * rad];
  }

  function render() {
    fakeCtx.clearRect(0, 0, fakeCanvas.width, fakeCanvas.height);
    fakeCtx.lineWidth = 1;
    fakeCtx.strokeStyle = pickColorByTheme('#00000040', '#ffffff40');
    fakeCtx.fillStyle = pickColorByTheme('black', 'white');
    fakeCtx.font = 'bold 12px Inter';
    fakeCtx.textAlign = 'right';

    for (var val = Math.floor(min / radiusStep) * radiusStep; val <= Math.ceil(max / radiusStep) * radiusStep; val += radiusStep) {
      var rad = (val - min) / (max - min) * overallRadius / 2 + overallRadius / 2;
      if (rad >= overallRadius) continue;
      fakeCtx.beginPath();
      fakeCtx.arc(overallRadius, overallRadius, rad, 0, 2 * Math.PI);
      fakeCtx.stroke();
      fakeCtx.closePath();
      fakeCtx.fillText("".concat(val).concat(radiusSuffix), overallRadius + rad, overallRadius);
    }

    fakeCtx.textBaseline = 'top';
    fakeCtx.textAlign = 'center';

    for (var hours = 0; hours < 24; hours += hoursStep) {
      var angle = hours / 24 * 2 * Math.PI;
      fakeCtx.beginPath();
      fakeCtx.moveTo(overallRadius + overallRadius * Math.cos(angle), overallRadius + overallRadius * Math.sin(angle));
      fakeCtx.lineTo(overallRadius, overallRadius);
      fakeCtx.stroke();
      fakeCtx.closePath();
      fakeCtx.fillText("".concat(hours, ":00"), overallRadius + 100 * Math.cos(angle), overallRadius + 100 * Math.sin(angle));
    }

    fakeCtx.strokeStyle = pickColorByTheme('black', 'white');
    fakeCtx.beginPath();
    fakeCtx.moveTo.apply(fakeCtx, _toConsumableArray(getCoords(rows[0][0], vals[0])));

    for (var i = 1; i < rows.length; i++) {
      fakeCtx.lineTo.apply(fakeCtx, _toConsumableArray(getCoords(rows[i][0], vals[i])));
    }

    fakeCtx.stroke();
    fakeCtx.closePath();
    ctx.drawImage(fakeCanvas, 0, 0);
  }

  function highlightPoints() {
    var angle = Math.atan2(mouseY - overallRadius, mouseX - overallRadius);
    if (angle < 0) angle += 2 * Math.PI;
    var ms = angle / (2 * Math.PI) * 24 * 3600 * 1000;
    ctx.strokeStyle = pickColorByTheme('#80000080', '#ffff8080');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(overallRadius, overallRadius);
    ctx.lineTo(overallRadius + overallRadius * Math.cos(angle), overallRadius + overallRadius * Math.sin(angle));
    ctx.stroke();
    ctx.closePath();
    var pointsHighlighted = [];

    for (var i = 0; i < rows.length - 1; i++) {
      var t1 = rows[i][0] % (24 * 3600 * 1000),
          t2 = rows[i + 1][0] % (24 * 3600 * 1000); // borders the target time?

      if (t1 <= ms && t2 >= ms) {
        var t = void 0,
            val = void 0; // use closer one

        if (ms - t1 < t2 - ms) {
          t = t1;
          val = vals[i];
        } else {
          t = t2;
          val = vals[i + 1];
        }

        pointsHighlighted.push([t, val]);
        ctx.fillStyle = pickColorByTheme('#800000', '#ffff80');
        ctx.strokeStyle = pickColorByTheme('#ffffff', '#222222');
        ctx.lineWidth = 3;
        ctx.beginPath();

        var _getCoords = getCoords(t, val),
            _getCoords2 = _slicedToArray(_getCoords, 2),
            x = _getCoords2[0],
            y = _getCoords2[1];

        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
      }
    }

    var minutes = Math.floor(ms / 60000) % 60,
        hours = Math.floor(ms / 3600000);
    timeDisplay.textContent = "".concat(hours < 10 ? '0' + hours : hours, ":").concat(minutes < 10 ? '0' + minutes : minutes);
    tooltip.classList.add('visible');

    while (valuesDisplay.lastChild != averageDisplay) {
      valuesDisplay.removeChild(valuesDisplay.lastChild);
    }

    var average = pointsHighlighted.reduce(function (a, b) {
      return a + b[1];
    }, 0) / pointsHighlighted.length,
        averageText = "Average: ".concat(Math.round(average * 100) / 100).concat(radiusSuffix);
    averageDisplay.firstChild.textContent = averageText;

    for (var _i2 = pointsHighlighted.length - 1; _i2 >= 0; _i2--) {
      var li = document.createElement('li');
      li.textContent = pointsHighlighted[_i2][1] + radiusSuffix;
      valuesDisplay.appendChild(li);
    }
  }

  render();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    return render();
  });

  function mouseEnterOrMove(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fakeCanvas, 0, 0);
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    highlightPoints();
    tooltip.style.left = "".concat(e.pageX, "px");
    tooltip.style.top = "".concat(e.pageY, "px");
  }

  function mouseLeave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fakeCanvas, 0, 0);
    tooltip.classList.remove('visible');
  }

  canvas.addEventListener('mouseenter', mouseEnterOrMove);
  canvas.addEventListener('mousemove', mouseEnterOrMove);
  canvas.addEventListener('mouseleave', mouseLeave);
}

require("_bundle_loader")(require.resolve('./data')).then(function (_ref) {
  var rows = _ref.default;
  createPlot(rows, 1, 3, 2, '°C', document.getElementById('temp'));
  createPlot(rows, 2, 3, 5, '%', document.getElementById('humidity'));
});
},{"_bundle_loader":"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-loader.js","./data":[["data.c2b69d8e.js","data.js"],"data.c2b69d8e.js.map","data.js"]}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35185" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}],"../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));
},{}]},{},["../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0,"main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map