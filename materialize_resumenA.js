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
