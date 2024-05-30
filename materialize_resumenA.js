/*
* Resumen: Obtiene el valor de una propiedad, siguiendo la cadena de prototipos si es necesario
* Entradas:  objet, property y receiver
* Salidas: valor de la propiedad
*/
var _get = function (object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) { return undefined; }
        else { return get(parent, property, receiver); }
    } else if ("value" in desc) { return desc.value; }
    else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); }
};

/*
* Resumen: Define una clase con propiedades prototipicas y estaticas
* Entradas:  Constructor, protoProps, staticProps
* Salidas: propiedades definidas
*/
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

/*
* Resumen: Gestiona el entorno correcto en constructores para las clases derivadas
* Entradas: self y call
* Salidas: instancia del objeto
*/
function _possibleConstructorReturn(self, call) {
    if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

/*
* Resumen: configura la herencia entre las entradas
* Entradas: subClass y superClass
* Salidas: modifica subClass
*/
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/*
* Resumen: Se encarga de verificar que las instancias sean creadas con 'new'
* Entradas: instance y Constructor
* Salidas: 
*/
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); }
}

(function (factory) {
    window.cash = factory();
})(function () {
    var doc = document,
        win = window,
        ArrayProto = Array.prototype,
        slice = ArrayProto.slice,
        filter = ArrayProto.filter,
        push = ArrayProto.push,
        noop = function () { },
        isFunction = function (item) { return typeof item === typeof noop && item.call; },
        isString = function (item) { return typeof item === typeof ""; },
        idMatch = /^#[\w-]*$/,
        classMatch = /^\.[\w-]*$/,
        htmlMatch = /<.+>/,
        singlet = /^\w+$/;

    /*
    * Resumen: Selecciona elementos del DOM basandose en 'selector'
    * Entradas: selecttor, context
    * Salidas: Elementos encontrados
    */
    function find(selector, context) {
        context = context || doc;
        var elems = classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
        return elems;
    }
    var frag;

    /*
    * Resumen: Convierte HTML en nodos
    * Entradas: str
    * Salidas: nodos DOM
    */
    function parseHTML(str) {
        if (!frag) {
            frag = doc.implementation.createHTMLDocument(null);
            var base = frag.createElement("base");
            base.href = doc.location.href;
            frag.head.appendChild(base);
        }
        frag.body.innerHTML = str;
        return frag.body.childNodes;
    }

    /*
    * Resumen: Ejecuta una función cuando DOM está completo
    * Entradas: fn
    * Salidas: 
    */
    function onReady(fn) {
        if (doc.readyState !== "loading") { fn(); }
        else { doc.addEventListener("DOMContentLoaded", fn); }
    }

    /*
    * Resumen: Es el constructor de la biblioteca, aqui se inicializa la selección de elementos
    * Entradas: selector, context
    * Salidas: instancia 'Init'
    */
    function Init(selector, context) {
        if (!selector) { return this; }
        if (selector.cash && selector !== win) { return selector; }
        var elems = selector, i = 0, length;
        if (isString(selector)) {
            elems = idMatch.test(selector) ? doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ? parseHTML(selector) : find(selector, context);
        } else if (isFunction(selector)) {
            onReady(selector); return this;
        }
        if (!elems) { return this; }
        if (elems.nodeType || elems === win) {
            this[0] = elems; this.length = 1;
        } else {
            length = this.length = elems.length;
            for (; i < length; i++) { this[i] = elems[i]; }
        }
        return this;
    }

    /*
    * Resumen: Esta es la función principal que devuelve una nueva instancia Init
    * Entradas: selector, context
    * Salidas: instancia 'Init'
    */
    function cash(selector, context) {
        return new Init(selector, context);
    }

    var fn = cash.fn = cash.prototype = Init.prototype = {
        cash: true,
        length: 0,
        push: push,
        splice: ArrayProto.splice,
        map: ArrayProto.map,
        init: Init
    };

    Object.defineProperty(fn, "constructor", { value: cash });

    cash.parseHTML = parseHTML;
    cash.noop = noop;
    cash.isFunction = isFunction;
    cash.isString = isString;

    cash.extend = fn.extend = function (target) {
        target = target || {};
        var args = slice.call(arguments), length = args.length, i = 1;
        if (args.length === 1) { target = this; i = 0; }
        for (; i < length; i++) {
            if (!args[i]) { continue; }
            for (var key in args[i]) {
                if (args[i].hasOwnProperty(key)) { target[key] = args[i][key]; }
            }
        }
        return target;
    };

    /*
    * Resumen: Itera sobre una coleccion y ejecuta un callback en cada elemento
    * Entradas: collection,callback
    * Salidas: 
    */
    function each(collection, callback) {
        var l = collection.length, i = 0;
        for (; i < l; i++) {
            if (callback.call(collection[i], collection[i], i, collection) === false) { break; }
        }
    }
    /*
    * Resumen: Verifica si el elemento coincide con el selector
    * Entradas: el, selector
    * Salidas: boolean
    */
    function matches(el, selector) {
        var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
        return !!m && m.call(el, selector);
    }

    /*
    * Resumen: Devuelve la funcion para comparar elementos
    * Entradas: selector
    * Salidas: funcion de coleccion
    */
    function getCompareFunction(selector) {
        return (isString(selector) ? matches : selector.cash ? function (el) { return selector.is(el); } : function (el, selector) { return el === selector; });
    }

    /*
    * Resumen: Filtra los elementos duplicados de la coleccion
    * Entradas: collection
    * Salidas: coleccion unica / nueva coleccion
    */
    function unique(collection) {
        return cash(slice.call(collection).filter(function (item, index, self) {
            return self.indexOf(item) === index;
        }));
    }

    cash.extend({
        merge: function (first, second) {
            var len = +second.length, i = first.length, j = 0;
            for (; j < len; i++, j++) { first[i] = second[j]; }
            first.length = i;
            return first;
        },
        each: each,
        matches: matches,
        unique: unique,
        isArray: Array.isArray,
        isNumeric: function (n) { return !isNaN(parseFloat(n)) && isFinite(n); }
    });

    var uid = cash.uid = "_cash" + Date.now();

    function getDataCache(node) { return node[uid] = node[uid] || {}; }

    /*
    * Resumen: establece datos en un nodo
    * Entradas: node, key, value
    * Salidas: valor establecido
    */
    function setData(node, key, value) { return getDataCache(node)[key] = value; }

    /*
    * Resumen: Obtiene datos de un nodo
    * Entradas: node, key
    * Salidas: valores de los datos
    */
    function getData(node, key) {
        var c = getDataCache(node);
        if (c[key] === undefined) {
            c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
        }
        return c[key];
    }

    /*
    * Resumen: elimina datos de un nodo
    * Entradas: node, key
    * Salidas: 
    */
    function removeData(node, key) {
        var c = getDataCache(node);
        if (c) { delete c[key]; }
        else if (node.dataset) { delete node.dataset[key]; }
        else { cash(node).removeAttr("data-" + name); }
    }

    fn.extend({
        /* 
        * Resumen: Método extendido que provee funcionalidad para manipulacion de elementos
        * Entradas: name, value
        * Salidas: valor de dato, si value no se proporciona; la instancia de 'cash', en caso de que value se proporcione
        */
        data: function (name, value) {
            if (isString(name)) {
                return value === undefined ? getData(this[0], name) : this.each(function (v) { return setData(v, name, value); });
            }
            for (var key in name) { this.data(key, name[key]); }
            return this;
        },

        /*
        * Resumen: Elimina datos personalizados de los elementos seleccionados
        * Entradas: name
        * Salidas: instancia de 'cash'
        */
        removeData: function (key) {
            return this.each(function (v) { return removeData(v, key); });
        }
    });

    var notWhiteMatch = /\S+/g;

    function getClasses(c) {
        return isString(c) && c.match(notWhiteMatch);
    }

    function hasClass(v, c) {
        return v && v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className);
    }
    /*
    * Resumen: Añade una o mas clases a los elementos
    * Entradas: cls
    * Salidas: instancia 'cash'
    */
    function addClass(v, c, spacedName) {
        if (v.classList) { v.classList.add(c); }
        else if (spacedName.indexOf(" " + c + " ")) { v.className += " " + c; }
    }

    /*
    * Resumen: Elimina una o mas clases de los elementos
    * Entradas: cls
    * Salidas: instancia de 'cash'
    */
    function removeClass(v, c) {
        if (v.classList) { v.classList.remove(c); }
        else { v.className = v.className.replace(c, ""); }
    }

    fn.extend({
        addClass: function (c) {
            var classes = getClasses(c);
            return classes ? this.each(function (v) {
                var spacedName = " " + v.className + " ";
                each(classes, function (c) { addClass(v, c, spacedName); });
            }) : this;
        },

        /*
        * Resumen: Obtiene o establece atributos en elementos seleccionados
        * Entradas: name, value
        * Salidas: Valor del atributo (si value no se proporciona) o instancia de cash (si se establece value)
        */
        attr: function (name, value) {
            if (!name) { return undefined; }
            if (isString(name)) {
                if (value === undefined) { return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined; }
                return this.each(function (v) {
                    if (v.setAttribute) { v.setAttribute(name, value); }
                    else { v[name] = value; }
                });
            }
            for (var key in name) { this.attr(key, name[key]); }
            return this;
        }
    });

    return cash;
});

var M = (function () {
    /**
    * Resumen: Inicializa un plugin de Jquery para su uso como usuario
    * Entradas: plugin, pluginName, classRef
    * Salidas:
    */
    function initializeJqueryWrapper(plugin, pluginName, classRef) {
        jQuery.fn[pluginName] = function (methodOrOptions) {
            if (plugin.prototype[methodOrOptions]) {
                var params = Array.prototype.slice.call(arguments, 1);
                if (methodOrOptions.slice(0, 3) === 'get') {
                    return this.first()[0][classRef][methodOrOptions].apply(this.first()[0][classRef], params);
                } else {
                    return this.each(function () {
                        this[classRef][methodOrOptions].apply(this[classRef], params);
                    });
                }
            } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
                plugin.init(this, arguments[0]);
                return this;
            } else {
                jQuery.error("Method " + methodOrOptions + " does not exist on jQuery." + pluginName);
            }
        };
    }

    /**
    * Resumen: Automatiza la inicializacion de los componentes en la interfaz
    * Entradas: context
    * Salidas:
    */
    function AutoInit(context) {
        var root = context || document.body;
        var registry = {
            Autocomplete: '.autocomplete:not(.no-autoinit)',
            Carousel: '.carousel:not(.no-autoinit)',
            Chips: '.chips:not(.no-autoinit)',
            Collapsible: '.collapsible:not(.no-autoinit)',
            Datepicker: '.datepicker:not(.no-autoinit)',
            Dropdown: '.dropdown-trigger:not(.no-autoinit)',
            Materialbox: '.materialboxed:not(.no-autoinit)',
            Modal: '.modal:not(.no-autoinit)',
            Parallax: '.parallax:not(.no-autoinit)',
            Pushpin: '.pushpin:not(.no-autoinit)',
            ScrollSpy: '.scrollspy:not(.no-autoinit)',
            FormSelect: 'select:not(.no-autoinit)',
            Sidenav: '.sidenav:not(.no-autoinit)',
            Tabs: '.tabs:not(.no-autoinit)',
            TapTarget: '.tap-target:not(.no-autoinit)',
            Timepicker: '.timepicker:not(.no-autoinit)',
            Tooltip: '.tooltipped:not(.no-autoinit)',
            FloatingActionButton: '.fixed-action-btn:not(.no-autoinit)'
        };

        for (var pluginName in registry) {
            var plugin = M[pluginName];
            var elements = root.querySelectorAll(registry[pluginName]);
            plugin.init(elements);
        }
    }

    return {
        initializeJqueryWrapper: initializeJqueryWrapper,
        AutoInit: AutoInit
    };
})();

M.initializeJqueryWrapper(Autocomplete, 'autocomplete', 'M_Autocomplete');
M.initializeJqueryWrapper(Carousel, 'carousel', 'M_Carousel');
M.initializeJqueryWrapper(Chips, 'chips', 'M_Chips');
M.initializeJqueryWrapper(Collapsible, 'collapsible', 'M_Collapsible');
M.initializeJqueryWrapper(Datepicker, 'datepicker', 'M_Datepicker');
M.initializeJqueryWrapper(Dropdown, 'dropdown', 'M_Dropdown');
M.initializeJqueryWrapper(Materialbox, 'materialbox', 'M_Materialbox');
M.initializeJqueryWrapper(Modal, 'modal', 'M_Modal');
M.initializeJqueryWrapper(Parallax, 'parallax', 'M_Parallax');
M.initializeJqueryWrapper(Pushpin, 'pushpin', 'M_Pushpin');
M.initializeJqueryWrapper(ScrollSpy, 'scrollSpy', 'M_ScrollSpy');
M.initializeJqueryWrapper(FormSelect, 'formSelect', 'M_FormSelect');
M.initializeJqueryWrapper(Sidenav, 'sidenav', 'M_Sidenav');
M.initializeJqueryWrapper(Tabs, 'tabs', 'M_Tabs');
M.initializeJqueryWrapper(TapTarget, 'tapTarget', 'M_TapTarget');
M.initializeJqueryWrapper(Timepicker, 'timepicker', 'M_Timepicker');
M.initializeJqueryWrapper(Tooltip, 'tooltip', 'M_Tooltip');
M.initializeJqueryWrapper(FloatingActionButton, 'floatingActionButton', 'M_FloatingActionButton');
M.AutoInit();

/**
 * Resumen: Añade un pollyfill a una funcion si no existe en el entorno actual, modifica el objeto global
 * Entradas: e, r, p, m
 * Salidas: 
 */
$jscomp.polyfill = function (e, r, p, m) {
    if (r) {
        p = $jscomp.global;
        e = e.split(".");
        for (m = 0; m < e.length - 1; m++) {
            var u = e[m];
            if (!(u in p)) p[u] = {};
            p = p[u];
        }
        e = e[e.length - 1];
        m = p[e];
        r = r(m);
        if (r != m && r != null) $jscomp.defineProperty(p, e, { configurable: true, writable: true, value: r });
    }
};

/**
  * Resumen: Devuelve un iterador sobre los indices del array
  * Entradas: 
  * Salidas:Iterador
  */
$jscomp.polyfill("Array.prototype.keys", function (e) {
    return e ? e : function () {
          /**
            * Resumen: Devuelve una lista de elementos que coinciden con el selesctor proporcionado
            * Entradas: a (selector css)
            * Salidas: lista de elementos del DOM que coinciden con el selector
            */
        return $jscomp.iteratorFromArray(this, function (e) {
            return e;
        });
    };
}, "es6-impl", "es3");

/**
* Resumen: Filtra los elementos de un array segun una funcion de filtro
* Entradas: a (array), c (funcion de filtro)
* Salidas: array filtrado
*/
(function (r) {
    M.anime = r();
})(function () {
    function e(a) {
        if (!h.col(a)) try {
            return document.querySelectorAll(a);
        } catch (c) { }
    }

    function r(a, c) {
        return a.filter(function (d, b) {
            return c.call(arguments[2], d, b, a);
        }, arguments[1]);
    }
    /**
    * Resumen: Aplana arrays anidados
    * Entradas: a (array anidado)
    * Salidas: array aplanado
    */
    function p(a) {
        return a.reduce(function (a, d) {
            return a.concat(h.arr(d) ? p(d) : d);
        }, []);
    }
    /**
    * Resumen: Convierte la entrada en un array de elementos de DOM
    * Entradas: a (array, selector o node)
    * Salidas: array de elementos
    */
    function m(a) {
        if (h.arr(a)) return a;
        if (h.str(a)) a = e(a) || a;
        return a instanceof NodeList || a instanceof HTMLCollection ? [].slice.call(a) : [a];
    }

    /**
    * Resumen: Comprueba si un elemento esta presente en el array
    * Entradas: a (array), c (elemento a buscar)
    * Salidas: boolean
    */
    function u(a, c) {
        return a.some(function (a) {
            return a === c;
        });
    }

    /**
    * Resumen: Crea una copia superficial de un objeto
    * Entradas: a (objeto)
    * Salidas: copia del objeto
    */
    function C(a) {
        return Object.assign({}, a);
    }

    /**
    * Resumen: Combina dos objetos, dando preferencia a las propiedades del segundo objeto
    * Entradas: a (objeto base), c (objeto con propiedades adicionales)
    * Salidas: objeto combinado
    */
    function D(a, c) {
        return Object.assign({}, a, c);
    }

    /**
    * Resumen: Combina dos objetos, solo añade las propiedades que le falten al primero
    * Entradas: a (objeto base), c (objeto con propiedades adicionales)
    * Salidas: objeto combinado con las propiedades del segundo 
    */
    function z(a, c) {
        var d = C(a);
        for (var b in c) {
            if (h.und(a[b])) d[b] = c[b];
        }
        return d;
    }

    /**
    * Resumen: convierte un color en formato hex a formato rgba
    * Entradas: a (cadena hexadecimal de color)
    * Salidas: rgba (cadena con los valores del color)
    */
    function T(a) {
        a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (a, c, d, k) {
            return c + c + d + d + k + k;
        });
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
        return "rgba(" + parseInt(c[1], 16) + "," + parseInt(c[2], 16) + "," + parseInt(c[3], 16) + ",1)";
    }

    /**
    * Resumen: Convierte un color a formato hsl(a) a rgba
    * Entradas: a (cadena hsl(a))
    * Salidas: rgba (cadena con los valores del color)
    */
    function U(a) {
        function c(a, c, b) {
            if (b < 0) b += 1;
            if (b > 1) b -= 1;
            if (b < 1 / 6) return a + 6 * (c - a) * b;
            if (b < 1 / 2) return c;
            if (b < 2 / 3) return a + (c - a) * (2 / 3 - b) * 6;
            return a;
        }
        var d = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(a),
            a = parseInt(d[1]) / 360,
            b = parseInt(d[2]) / 100,
            f = parseInt(d[3]) / 100,
            d = d[4] || 1;
        if (b === 0) {
            f = b = a = f;
        } else {
            var n = f < 0.5 ? f * (1 + b) : f + b - f * b,
                k = 2 * f - n;
            f = c(k, n, a + 1 / 3);
            b = c(k, n, a);
            a = c(k, n, a - 1 / 3);
        }
        return "rgba(" + 255 * f + "," + 255 * b + "," + 255 * a + "," + d + ")";
    }

    /**
    * Resumen: Extrae y devuelve la medida de una cadena
    * Entradas: a (cadena con una medida)
    * Salidas: Unidad de medida
    */
    function y(a) {
        if (a = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(a)) return a[2];
    }

    /**
    * Resumen: devuelve la unidad de medida predeterminada para ciertas propiedadaes css
    * Entradas: a (cadena con propiedades css)
    * Salidas: medida predeterminada para la propiedad
    */
    function V(a) {
        if (a.indexOf("translate") >= 0 || a === "perspective") return "px";
        if (a.indexOf("rotate") >= 0 || a.indexOf("skew") >= 0) return "deg";
    }

    /**
    * Resumen: ejecuta una funcion con un contexto dado o devuelve el valor si no es una funcion
    * Entradas: a (funcion o valor), c (contexto)
    * Salidas: valor resultante
    */
    function I(a, c) {
        return h.fnc(a) ? a(c.target, c.id, c.total) : a;
    }

    /**
    * Resumen: obtiene el valor computado de una propiedad css
    * Entradas: a (elemento de DOM), c (propiedad css)
    * Salidas: valor de la propiedad css
    */
    function E(a, c) {
        if (c in a.style) return getComputedStyle(a).getPropertyValue(c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()) || "0";
    }

    /**
    * Resumen: determina el tipo de propiedad de un elemento
    * Entradas: a (elemento DOM), c (propiedad)
    * Salidas: tipo de propiedad
    */
    function J(a, c) {
        if (h.dom(a) && u(W, c)) return "transform";
        if (h.dom(a) && (a.getAttribute(c) || (h.svg(a) && a[c]))) return "attribute";
        if (h.dom(a) && c !== "transform" && E(a, c)) return "css";
        if (a[c] != null) return "object";
    }

    /**
    * Resumen: Obtiene el valor de una transformacion css de un elemento
    * Entradas: a (elemento DOM), c (transformacion css)
    * Salidas: valor de la transformacion
    */
    function X(a, c) {
        var d = V(c);
        if (c.indexOf("scale") >= 0) d = 1;
        a = a.style.transform;
        if (!a) return d;
        var b = [],
            f = [],
            n = [],
            k = /(\w+)\((.+?)\)/g;
        while (b = k.exec(a)) {
            f.push(b[1]);
            n.push(b[2]);
        }
        a = r(n, function (a, b) {
            return f[b] === c;
        });
        return a.length ? a[0] : d;
    }

    /**
    * Resumen: obtiene el valor de una propiedad de un elemento basado en su tipo
    * Entradas: a (elemento DOM), c (propiedad)
    * Salidas: valor de la propiedad
    */
    function K(a, c) {
        switch (J(a, c)) {
            case "transform":
                return X(a, c);
            case "css":
                return E(a, c);
            case "attribute":
                return a.getAttribute(c);
        }
        return a[c] || 0;
    }

    /**
    * Resumen: calcula un nuevo valor basado en el operador y el valor base
    * Entradas: a (cadena con operador), c (valor base)
    * Salidas: valor calculado
    */
    function L(a, c) {
        var d = /^(\*=|\+=|-=)/.exec(a);
        if (!d) return a;
        var b = y(a) || 0,
            c = parseFloat(c),
            a = parseFloat(a.replace(d[0], ""));
        switch (d[0][0]) {
            case "+":
                return c + a + b;
            case "-":
                return c - a + b;
            case "*":
                return c * a + b;
        }
    }

    /**
    * Resumen: calcula la distancia euclidiana entre dos puntos
    * Entradas: a,c (coordenadas 'x' y 'y')
    * Salidas: distancia entre los puntos
    */
    function F(a, c) {
        return Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
    }

    /**
    * Resumen: calcula la longitud total del un elemento SVG
    * Entradas: a (elemento SVG)
    * Salidas: longitud total del elemento
    */
    function M(a) {
        var c = 0,
            d, b = a.points;
        for (var f = 0; f < b.numberOfItems; f++) {
            var n = b.getItem(f);
            if (f > 0) c += F(d, n);
            d = n;
        }
        return c;
    }

    /**
    * Resumen: calcula la longitud total de carios tipos de elementos SVG
    * Entradas: a (elemento SVG)
    * Salidas: longitud del elemento
    */
    function N(a) {
        if (a.getTotalLength) return a.getTotalLength();
        switch (a.tagName.toLowerCase()) {
            case "circle":
                return 2 * Math.PI * a.getAttribute("r");
            case "rect":
                return 2 * a.getAttribute("width") + 2 * a.getAttribute("height");
            case "line":
                return F({ x: a.getAttribute("x1"), y: a.getAttribute("y1") }, { x: a.getAttribute("x2"), y: a.getAttribute("y2") });
            case "polyline":
                return M(a);
            case "polygon":
                var c = a.points;
                return M(a) + F(c.getItem(c.numberOfItems - 1), c.getItem(0));
        }
    }

    /**
    * Resumen: Obtiene la coordenada o angulo en una posicion dada de un elemento SVG
    * Entradas: a (objeto con una propiedad), c(longitud)
    * Salidas: coordenada o angulo
    */
    function Y(a, c) {
        function d(b) {
            b = b === undefined ? 0 : b;
            return a.el.getPointAtLength(1 <= c + b ? c + b : 0);
        }
        var b = d(),
            f = d(-1),
            n = d(1);
        switch (a.property) {
            case "x":
                return b.x;
            case "y":
                return b.y;
            case "angle":
                return 180 * Math.atan2(n.y - f.y, n.x - f.x) / Math.PI;
        }
    }

    /**
    * Resumen: extrae numeros de cadenas y compara dos valores
    * Entradas: a, c (cadenas con numeros o valores)
    * Salidas: objeto con valores originales y numeros extraidos
    */
    function O(a, c) {
        var d = /-?\d*\.?\d+/g,
            b;
        b = h.pth(a) ? a.totalLength : a;
        if (h.col(b)) {
            if (h.rgb(b)) {
                c = h.rgb(c) ? c : T(c);
            } else {
                c = h.hex(c) ? T(c) : c;
            }
        } else {
            a = (a + "").match(d);
            b = (c + "").match(d);
        }
        return { original: a, numbers: b };
    }

    function Z(a) {
        return a.map(function (a) {
            return a.h.value;
        });
    }

    /**
    * Resumen: asocia valores con sus unidades
    * Entradas: a (valores), c (unidades)
    * Salidas: array de objetos con valor y unidad
    */
    function P(a, c) {
        return a.map(function (a, b) {
            return {
                value: a,
                unit: c[b].unit
            };
        });
    }

    /**
    * Resumen: combina valores y unidades de dos cadenas
    * Entradas: a, c (cadenas con valores numericos o colores)
    * Salidas: array de objetos con valor y unidad
    */
    function aa(a, c) {
        var d = O(a, c),
            b = d.numbers;
        if (d.original.length !== b.length) return c;
        var f = d.original.map(function (a) {
            return {
                value: a,
                unit: y(a)
            };
        });
        return P(Z(d), f);
    }

    /**
    * Resumen: Combina valores y unidades de dos strings
    * Entradas: a, c (cadenas con valor y unidad )
    * Salidas: array de objetos con valor y unidad
    */
    function ba(a, c) {
        var d = O(a, c),
            b = d.numbers;
        if (d.original.length !== b.length) return c;
        var f = d.original.map(function (a) {
            return {
                value: a,
                unit: y(a)
            };
        });
        return P(Z(d), f);
    }

    /**
    * Resumen: interpola valores entre dos conjuntos
    * Entradas: a,c,d,b (valores y unidades)
    * Salidas: array de objetos interpolados
    */
    function ca(a, c, d, b) {
        a = aa(a, c);
        return a.map(function (a, c) {
            a = a.value;
            var e = d[c].value,
                g = b[c].value,
                h = e === g ? 1 : e === a ? 0 : 1 / (g - e) * (a - e);
            return {
                value: h * (g - e) + e,
                unit: a.unit
            };
        });
    }

    /**
    * Resumen: devuelve los valores de un objeto en un array
    * Entradas: a (objeto)
    * Salidas: array de valores del objeto
    */
    function G(a) {
        var c = [];
        for (var d in a) c.push(a[d]);
        return c;
    }

    /**
    * Resumen: devuelve funciones 'easing' basados en una descripcion 
    * Entradas: a (objeto con funciones 'easing')
    * Salidas: array de funciones 'easing''
    */
    function da(a, c) {
        var d = c.toLowerCase();
        return d.indexOf("elastic") >= 0 ? G(a).map(function (a) {
            return function (c) {
                return Math.pow(2, 10 * (c - 1)) * Math.sin(20 * (c - 1.1) * Math.PI / 3);
            };
        }) : d.indexOf("cubic") >= 0 ? G(a).map(function (a) {
            return function (c) {
                return Math.pow(c, 3);
            };
        }) : d.indexOf("bounce") >= 0 ? G(a).map(function (a) {
            return function (c) {
                return Math.pow(c, 2);
            };
        }) : G(a).map(function (a) {
            return function (c) {
                return 1 - Math.cos(c * (Math.PI / 2));
            };
        });
    }

    /**
    * Resumen: devuelve una funcion que aplica la transformacion a valores
    * Entradas: a ( funcion)
    * Salidas: funcion transformada
    */
    function ha(a) {
        return function (c) {
            return c.map(function (c) {
                return a(c.value);
            });
        };
    }

    /**
    * Resumen: devuelve una funcion que aplica la transformacion inversa de valores
    * Entradas: a (funcion)
    * Salidas: funcion inversa
    */
    function ia(a) {
        return function (c) {
            return c.map(function (c) {
                return 1 - a(1 - c.value);
            });
        };
    }
    /**
    * Resumen: devuelve una funcion que representa una transformacion lineal
    * Entradas: a (array con dos numeros)
    * Salidas: funcion lineal
    */
    function ka(a) {
        var c = a[0],
            d = a[1];
        return function (a) {
            return function (b) {
                return a * b + d;
            };
        };
    }

    /**
    * Resumen: devuelve una serie de funciones que representan transformaciones lineales
    * Entradas: a (array de numeros)
    * Salidas: array de funciones lineales 
    */
    function la(a) {
        return a.map(function (a) {
            return ka([0.75 * a, 1 - 0.75 * a]);
        });
    }

    /**
    * Resumen: devuelve una sere de funciones sigmoidales
    * Entradas: a (array de numeros)
    * Salidas: array de funciones sigmoidales
    */
    function ma(a) {
        return a.map(function (a) {
            return function (c) {
                return c.map(function (c) {
                    return 1 / (1 + Math.exp(-c.value));
                });
            };
        });
    }

    /**
    * Resumen: devuelve una serie de funciones que invierten una transformacion lineal
    * Entradas: a (array de numeros)
    * Salidas: arrqay de funciones lineales invertidas
    */
    function na(a) {
        return a.map(function (a) {
            return function (c) {
                return c.map(function (c) {
                    return 2 * c.value - 1;
                });
            };
        });
    }

    /**
    * Resumen: devuelve una funcion que apllica la transformacion a valores
    * Entradas: a (funcion)
    * Salidas: funcion transformadora
    */
    function Jc(a) {
        return function (c) {
            return c.map(function (c) {
                return a(c.value);
            });
        };
    }

    /**
    * Resumen: devuelve una funcion que escala valores
    * Entradas: a (numero)
    * Salidas: funcion escalar
    */
    function Uc(a) {
        return function (c) {
            return c.map(function (c) {
                return c.value * a;
            });
        };
    }

    /**
    * Resumen: interpola valores entre dos conjuntos (similar a 'ca'), permite manejar animaciones
    *          y transformaciones de elementos DOM
    * Entradas: a,c,d,b (valores y unidades)
    * Salidas: array de objetos interpolados
    */
    function Xc(a, c, d, b) {
        a = aa(a, c);
        return a.map(function (a, c) {
            a = a.value;
            var e = d[c].value,
                g = b[c].value,
                h = e === g ? 1 : e === a ? 0 : 1 / (g - e) * (a - e);
            return {
                value: h * (g - e) + e,
                unit: a.unit
            };
        });
    }

    return {
        createInstance: function (a) {
            return {
                value: a
            };
        },
        createTween: function (a) {
            return {
                value: a
            };
        },
    };
});
