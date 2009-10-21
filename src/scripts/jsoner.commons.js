/**
 * Copyright (c) 2007, SoftAMIS, http://soft-amis.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Alexey Luchkovsky
 * E-mail: jsiner@soft-amis.com
 *
 * Version: 1.024
 * Last modified: 15/05/2007
 */

/**
 * @fileoverview
 *
 * Common module contains reused general purpose utilities and classes such as:
 * <ul>
 *  <li> Methods for generic type checking.
 *  <li> Methods for type conversion.
 *  <li> Constants which used to determinate client browser name and operation system.
 *
 *  <li> Common logger - the object which can be used to collect log events
 *  from a specific system or components.
 *  <li> Common collections.
 *    <ul>
 *     <li> A KeySet - a collection of unique keys.
 *     <li> A HashMap - an object that maps keys to values and does not contain duplicate keys.
 *    </ul>
 *  <li> Common transporter.
 *  <li> Lazy inheritance implementation.
 *  <li> Iterceptor solution.
 * </ul>
 *
 * JSINER can be downloaded free from
 * <a href="http://sourceforge.net/projects/jsiner">http://sourceforge.net/projects/jsiner</a>.
 * Here anyone can leave his comments and wishes.
 */

/**
 * Defines the COMMONS name space.<br>
 * @constructor
 * The COMMONS contains reused general purpose utilities such as:
 * <ul>
 *  <li> Methods for generic type checking.
 *  <li> Methods for type conversion.
 *  <li> Constants which used to determinate client browser name and operation system.
 * </ul>
 */
//function COMMONS(){}

/**
 * The COMMONS' name space.
 * @private
 */
var COMMONS = {
	version: 1.024,
	/**
	 * Identifies the browser and the operation system.
	 * @type boolean
	 */
	userAgent: navigator.userAgent.toLowerCase()
};

/**
 * The flag indicates that the browser is MS Internet Explorer.
 * @type boolean
 */
COMMONS.isIE = COMMONS.userAgent.indexOf('msie') > -1;
/**
 * The flag indicates that the browser is Opera.
 * @type boolean
 */
COMMONS.isOpera = COMMONS.userAgent.indexOf('opera') > -1;
/**
 * The flag indicates that the browser is Safari.
 * @type boolean
 */
COMMONS.isSafari = (!COMMONS.isOpera && COMMONS.userAgent.indexOf('safari') > -1);
/**
 * The flag indicates that the browser is Gecko Firefox.
 * @type boolean
 */
COMMONS.isGecko = (!COMMONS.isOpera && !COMMONS.isSafari && COMMONS.userAgent.indexOf('gecko') > -1);
/**
 * The flag indicates that the  operation system is MS Windows.
 * @type boolean
 */
COMMONS.isWin32 = (COMMONS.userAgent.indexOf('windows') > -1);
/**
 * The flag indicates that the  operation system is MAC OS.
 * @type boolean
 */
COMMONS.isMacOs = (COMMONS.userAgent.indexOf('mac') > -1);

/**
 * The function which returns false.
 * @return {Boolean} Returns false.
 */
COMMONS.returnFalse = function returnFalse()
{
	return false;
};

/**
 * The function which returns true.
 * @return {Boolean} Returns true.
 */
COMMONS.returnTrue = function returnTrue()
{
	return true;
};

/**
 * The proxy function which itself returns argument.
 * @return Returns the himself argument.
 */
COMMONS.proxy = function(aValue)
{
	return aValue;
};

/**
 * Indicates that the argument is an object.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value is to be checked.
 */
COMMONS.isObject = function(anObject)
{
	return anObject !== null && typeof(anObject) === "object";
};

/**
 * Indicates that the argument is an array.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value to be checked.
 */
COMMONS.isArray = function(anObject)
{
	return anObject instanceof Array;
};

/**
 * Indicates that the argument is a RegExp.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param  The value to be checked.
 */
COMMONS.isRegExp = function(anObject)
{
	return anObject instanceof RegExp;
};

/**
 * Indicates that the argument is a Date.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param  The value to be checked.
 */
COMMONS.isDate = function(anObject)
{
	return anObject instanceof  Date;
};

/**
 * Indicates that the argument is a Number.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param  The value is to be checked.
 */
COMMONS.isNumber = function(anObject)
{
	return typeof(anObject) === "number";
};

/**
 * Indicates that the argument is a Boolean.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param  The value to be checked.
 */
COMMONS.isBoolean = function(anObject)
{
	return typeof(anObject) === "boolean";
};

/**
 * Indicates that the argument is a String.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value is to be checked.
 */
COMMONS.isString = function(anObject)
{
	return typeof(anObject) === "string";
};

/**
 * Indicates that the argument is a function.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value to be checked.
 */
COMMONS.isFunction = function(anObject)
{
	return typeof(anObject) === "function";
};

/**
 * Indicates that the argument is undefined.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value to be checked.
 */
COMMONS.isUndefined = function(anObject)
{
	return anObject === undefined;
};

/**
 * Indicates that the argument is not null and not undefined.
 * @return {Boolean} If so it returns true, otherwise it returns false.
 *
 * @param The value is to be checked.
 */
COMMONS.isDefined = function(anObject)
{
	return anObject !== null && anObject !== undefined;
};

/**
 * Parses the string argument to an integer.
 * @return {Number} Returns the integer represented by the string argument in the 10 radix.
 *
 * @param {String} The string containing the integer representation, which is 
 * to be parsed as number or a number.
 */
COMMONS.toInteger = function(aValue)
{
	var result = 0;
	if (aValue)
	{
		result = this.isNumber(aValue) ? aValue : parseInt(aValue, 10);
	}
	return result;
};

/**
 * Parses the string argument to a float.
 * @return {Number} Returns the number represented by the string argument.
 *
 * @param {String} The string containing the number representation, which is
 * to be parsed as number or a number.
 */
COMMONS.toFloat = function(aValue)
{
	var result = 0;
	if (aValue)
	{
		result = this.isNumber(aValue) ? aValue : parseFloat(aValue);
	}
	return result;
};

/**
 * The predefined string representations of boolean "true" value.
 * <ul>
 *  <li>true
 *  <li>yes
 *  <li>ok
 * </ul>
 * @type Map
 */
COMMONS.BOOLEAN_TRUE = {"true":true, "yes":true, "ok":true};

/**
 * Parses the string argument to a boolean.
 * @return {Boolean} Returns the boolean represented by the string argument.
 *
 * @param {String} The string containing the boolean representation,which is to be
 * compared with predefined values or boolean.
 *
 * @see #BOOLEAN_TRUE
 */
COMMONS.toBoolean = function(aValue)
{
	var result = false;
	if (aValue)
	{
		result = this.isBoolean(aValue) ? aValue : this.BOOLEAN_TRUE[ aValue.toString().toLowerCase() ];
	}
	return result;
};

/**
 * A Logger object is used to collect log events for a specific system or components.
 * @constructor
 * Each log events has a message part and category associated with it.
 * The Logger's methods designed to logging severe error allowed to associate
 * log event with occured Error and error called method.
 * The Logger output method can be overriden subject to custom project architecture.
 *
 * @param {String} The logger prefix.
 */
function Logger(aPrefix)
{
	/**
	 * The logger prefix used to identify logged class.
	 * @type String
	 */
	this.fPrefix = aPrefix;
}

/**
 * The TRACE logging category designates fine-grained
 * informational events than the DEBUG category.
 */
Logger.TRACE = 20;

/**
 * The DEBUG logging category designates fine-grained
 * informational events that are the most useful for debugging the
 * application.
 */
Logger.DEBUG = 50;

/**
 * The INFO logging category designates informational messages
 * that illustrate the progress of the application at coarse-grained
 * level.
 */
Logger.INFO = 70;

/**
 * The WARN logging category designates potentially
 * harmful situations.
 */
Logger.WARN = 80;

/**
 * The ERROR logging category designates error events that
 * may allow the application to continue running.
 */
Logger.ERROR = 90;

/**
 * The FATAL logging category designates very severe error
 * that will presumably lead the application to abort.
 */
Logger.FATAL = 100;

/**
 * Logs event according to TRACE category.
 *
 * @param {String} The message to log.
 * @param {Exception} The exception to log.
 */
Logger.prototype.trace = function(aMessage, anException)
{
	this.log(Logger.TRACE, aMessage, anException);
};

/**
 * Logs event according to DEBUG category.
 *
 * @param {String} The message to log.
 * @param {Exception} The exception to log.
 */
Logger.prototype.debug = function(aMessage, anException)
{
	this.log(Logger.DEBUG, aMessage, anException);
};

/**
 * Logs event according to INFO category.
 *
 * @param {String} The message to log.
 * @param {Exception} The exception to log.
 */
Logger.prototype.info = function(aMessage, anException)
{
	this.log(Logger.INFO, aMessage, anException);
};

/**
 * Logs event according to WARN category.
 *
 * @param {String} The message to log.
 * @param {Exception} The exception to log.
 */
Logger.prototype.warning = function(aMessage, anException)
{
	this.log(Logger.WARN, aMessage, anException);
};

/**
 * Logs event according to ERROR category.
 *
 * @param {String} The message  to log.
 * @param {Exception} The exception to log.
 * @param {Function} The error called method.
 */
Logger.prototype.error = function(aMessage, anException, aMethod)
{
	this.log(Logger.ERROR, aMessage, anException, aMethod);
};

/**
 * Logs event according to FATAL category.
 *
 * @param {String} The message  to log.
 * @param {Exception} The exception to log.
 * @param {Function} The error called method.
 */
Logger.prototype.fatal = function(aMessage, anException, aMethod)
{
	this.log(Logger.FATAL, aMessage, anException, aMethod);
};

/**
 * Processes log event.
 *
 * @param {Integer} The log event category.
 * @param {String} The message to log.
 * @param {Exception} The exception to log.
 * @param {Function} The error called method.
 */
Logger.prototype.log = function(aType, aMessage, anException, aMethod)
{
	var txt = COMMONS.isDefined(this.fPrefix) ? "[" + this.fPrefix + "] " + aMessage : aMessage;
	if (COMMONS.isDefined(anException))
	{
		txt += ": " + anException.name + ", " + anException.message;
	}
	if (COMMONS.isDefined(aMethod))
	{
		txt += "\n" + aMethod.toString();
	}
	this.printLog(aType, txt);
};

/**
 * Prints the log message.
 *
 * @param {Integer} The log event category.
 * @param {String} The message to print.
 */
Logger.prototype.printLog = function(aType, aMessage)
{
	if (aType > Logger.WARN)
	{
		alert(aMessage);
	}
};

/**
 * Defines common logger.
 */
COMMONS.fLogger = new Logger("Common");

/**
 * Defines the JSINER (originated from JavaScript INheritance) is a lazy inheritance implementation
 * in JavaScript.
 * @constructor
 * <br><b>Lazy inheritance</b> is a design pattern used in JavaScript computer programming.
 * It designates a “postponed linking” of an object with its prototype (class) until it is needed.
 * If used properly, such approach may increase efficiency, simplicity and flexibility of
 * OOP based code written using JavaScript.
 * Since lazy inheritance is called only for instance creation, it JSINER allowed to combine process
 * of class prototype creation with resolving necessary dependencies of that class.<br>
 *
 * The instances of objects in lazy inheritance are created in “mixed” mode – on first invocation,
 * a factory is used to modify class prototype which is later used to create subsequent object instances.<br>
 *
 * The main features of lazy inheritance approach are:
 * <ul>
 *  <li> Lazy inheritance is prototype-based inheritance;
 *  <li> Maintaining proper order of script files declaration is not obligatory;
 *  <li> HTML page loading is faster, since there is no need in creation objects during page initialization
 *  and, additionally, some scripts could be loaded only at the moment in which they are actually necessary;
 *  <li> The parent classes for the object can be loaded dynamically after defining the object type;
 *  <li> Dependencies are declared in more explicit way; it’s not necessary to group particular scripts into “modules” artificially and define dependencies between such “modules”;
 *  <li> If lazy mode of scripts loading is used, only important scripts (those which are highly necessary for application functionality) will be loaded.
 * </ul>
 * <br>
 * The following code illustrates <b>JSINER' lazy inheritance</b> usage case:<br>
 *
 * <pre>
 *  // Person constructor. The code defined in person.js.
 *  function Person(aName)
 *  {
 *    this.fName = aName;
 *  }
 *
 * // Returns the string representation of the Person.
 * Person.prototype.toString = function()
 * {
 *   return "Person: " + this.getName();
 * };
 *
 * // The code is defined in employee.js.
 * // Dependency declaration, defines that Employee required "person", no scripts are loaded so far
 * // The Employee class required "person" script to be loaded.
 * JSINER.addDependency( {Employee:"person"} );
 *
 * // Employee’ constructor and inheritance definition.
 * // Actual instance of Person and loading all their dependencies
 * // will happen with first instantiation of the Employee.
 * function Employee(aName, aUID)
 * {
 *   var self = JSINER.extend(this, "Person"); // lazy inheritance calling
 *   self.fName = aName;
 *   self.fUID = aUID;
 *   return self;
 * }
 *
 * // Returns the string representation of the Employee.
 * Employee.prototype.toString = function()
 * {
 *   var person = Employee.superClass.toString.call(this);
 *    return this.fUID + ":" + person;
 * };
 * </code>
 */
//function JSINER() {}

/**
 * The JSINER' name space.
 * @private
 */
var JSINER = {
	/**
   * Defines the prefix used to prepare JavaScript URI.
   * @type String
   * @see #getScriptURI
   */
  scriptPrefix:"script/",
	/**
	 * Defines the suffix used to prepare JavaScript URI.
	 * @type String
	 * @see #getScriptURI
	 */
	scriptSuffix:".js",
	/**
	 * Defines the version used to prepare JavaScript URI.
	 * @type Number
	 * @see #getScriptURI
	 */
	version: 1.0
};

/**
 * Defines object dependencies structure.
 * <samp>{ Class1:["dependency1", "dependency2"], Class2:"dependency" }</samp>.
 */
JSINER.fDependency = {};

/**
 * Defines JSINER logger.
 */
JSINER.fLogger = new Logger("JSINER");

/**
 * Lookups the object constructor.
 *
 * @param The parameter which used to lookup an object constuctor.
 * Available arument types:
 * The string that represented constructor name;
 * The function that is the object constructor;
 * The object that constuctor should be obtained.
 *
 * @returns {Function} Returns the object constructor.
 */
JSINER.getConstructor = function(anObject)
{
	var result = null;
	if (COMMONS.isString(anObject))
	{
		result = window[anObject];
	}
	else
	if (COMMONS.isFunction(anObject))
	{
		result = anObject;
	}
	else
	if (COMMONS.isObject(anObject))
	{
		result = anObject.constructor;
	}
	return result;
};

/**
 * Computes an object type.
 *
 * @param The object to be introspected.
 * @return {String} Returns object type by object constructor if it defined
 * otherwise returns null.
 */
JSINER.getType = function(anObject)
{
	var result = (typeof anObject);
	if (COMMONS.isObject(anObject))
	{
		if ( COMMONS.isRegExp(anObject) )
		{
			result = "RegExp";
		}
		else
		{
			var constr = this.getConstructor(anObject);
			if (COMMONS.isDefined(constr))
			{
				var cons = constr.toString();
				var index = cons.indexOf('(');
				result = ((index > 0) ? cons.substring(cons.indexOf(' ') + 1, index) : cons);
			}
		}	
	}
	return result;
};

/**
 * Returns JavaScript URI by argument.
 * The method can be overridden subject to custom project structure.
 *
 * @param {String} The key, which is used to obtain the JavaScript URI.
 * @return {String} Returns the JavaScript URI.
 */
JSINER.getScriptURI = function(aURL)
{
	var result = null;
	if ( COMMONS.isString(aURL) )
	{
		result = this.scriptPrefix;
		if ( /js[i|o]ner/.test(aURL) )
		{
			result += aURL;
		}
		else
		{
		  result += aURL.replace(/[.]/g, '/');
		}
		result = Transporter.addParameter(result + this.scriptSuffix, "ver", this.version );
	}
	return result;
};

/**
  * Checks that the JavaScript is already loaded.
  *
  * The method can be overriden subject to custom project structure.
  * @return {Boolean} If so, it returns true, otherwise it returns false.
  *
  * @param {String} The key is used to obtain the JavaScript URI.
  */
JSINER.isScriptLoaded = function(aKey)
{
	var result = this.fScripts.isContains(aKey);
	if ( !result )
	{
		var uri = this.getScriptURI(aKey);
		var index = uri.indexOf('?');
		if ( index > 0 )
		{
			uri = uri.substring(0, index);
		}

		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++)
		{
			var src = scripts[i].src;
			if ( src.indexOf(uri) >= 0 )
			{
				result = true;
				break;
			}
		}
	}
	this.fLogger.info("The script [" + aKey + "] are " + (result ? "loaded" : "not loaded"));
	return result;
};

/**
 * Sets new collection of object dependencies, such as JSON structure.
 *
 * @param {JSON} The JSON representation of objects relations.
 * <samp>COMMONS.setDependency( { Class1:["dependency1", "dependency2"], Class2:"dependency" } );</samp>.
 * That designates   
 */
JSINER.setDependency = function(aJson)
{
	this.fDependency = COMMONS.isDefined(aJson) ? aJson : {};
};

/**
 * Adds the object dependecy.
 *
 * @param {JSON} The JSON representation of object dependency structure.
 * <samp>COMMONS.addDependency( { Class1:["dependency1", "dependency2"], Class2:"dependency" } );</samp>.
 */
JSINER.addDependency = function(aJson)
{
	if (COMMONS.isDefined(aJson))
	{
		for (var name in aJson)
		{
			var dependency = this.fDependency[name];
			if ( !COMMONS.isArray(dependency) )
			{
				this.fDependency[name] = [];
				dependency = this.fDependency[name];
			}

			var value = aJson[name];
			if ( COMMONS.isArray(value) )
			{
				for( var i=0; i < value.length; i++)
				{
					dependency.push( value[i] );
				}
			}
			else
			{
				dependency.push( value );
			}
		}
	}
};

/**
 * Returns the registered object dependency.
 *
 * @param The object.
 * @param The class from which the object inherit.
 * @return {Array} Returns the object dependency.
 *
 * @see #addDependency
 * @see #setDependency
 */
JSINER.getDependency = function(anObject, aClass)
{
	var type = this.getType(anObject);
	return this.fDependency[type];
};

/**
 * Creates the instance of the object by constructor and class from which to inherit.
 *
 * @param {Function} The object constructor.
 * @param {Function} The class from which to inherit.
 *
 * @return Returns instance of the object if class from which to inherit definded
 * otherwise returns null.
 */
JSINER.createInstance = function(aConstructor, aClass)
{
	var result = null;
	if (COMMONS.isFunction(aConstructor) && COMMONS.isFunction(aClass) && aClass !== Object)
	{
		var oldPrototype = aConstructor.prototype;        	// stores object prototype properties
		var oldToString = aConstructor.prototype.toString; 	// stores toString property for IE only

		aConstructor.prototype = new aClass(); 		          // overrides constuctor prototype
		aConstructor.prototype.constructor = aConstructor;	// restores class constructor
		aConstructor.superClass = aClass.prototype;         // adds superclass property

		for (var name in oldPrototype) //restores old prototype properties
		{
			aConstructor.prototype[name] = oldPrototype[name];
		}
		aConstructor.prototype.toString = oldToString;
		
		aConstructor.$extend = true; // sets flag that the class is already tied
		result = new aConstructor(); // creates new instance of the class
	}
	return result;
};

/**
 * Inherits the object by specified class.
 *
 * @param The processed object.
 * @param The class name or class from which to inherit.
 */
JSINER.extend = function(anObject, aClass)
{
	var doExtend = function(anObject, aClass)
	{
		var result = anObject;
		var cons = anObject.constructor;
		if ( COMMONS.isUndefined(cons.$extend) )
		{
			var dependency = this.getDependency(anObject, aClass);
			if ( COMMONS.isArray(dependency) )
			{
				var toolkit = this;
				this.inject(dependency, function()
				{
					var inheritClass = toolkit.getConstructor(aClass);
					result = toolkit.createInstance(cons, inheritClass) || result;
				});
			}
			else
			{
				var inheritClass = this.getConstructor(aClass);
				result = this.createInstance(cons, inheritClass) || result;
			}
		}
		return result;
	};

	var result = doExtend.call(this, anObject, aClass);
	var inheritClass = this.getConstructor(aClass);
	if ( COMMONS.isFunction(inheritClass) )
	{
		inheritClass.call(result);
	}
	return result;
};


/**
 * The interceptor type designates that the intercept method
 * should be called to process before the object method.
 */
JSINER.INTERCEPT_BEFORE = 0;

/**
 * The interceptor type designates that the intercept method
 * should be called to process after the object method.
 */
JSINER.INTERCEPT_AFTER = 1;

/**
 * The interceptor type designates that the intercept method
 * should be called to process instead the object method.
 */
JSINER.INTERCEPT_INSTEAD = 2;

/**
 * The interceptor type designates that the intercept method
 * should be called to process when in the object method
 * catch arises an exception.
 */
JSINER.INTERCEPT_ON_ERROR = 3;

/**
 * The map of class methods which are intercepted now.
 * @see #unregisterInterceptor
 */
JSINER.fMethods = new HashMap();

/**
 * Registers interceptor on defined method of the class
 * and all children of the class.
 *
 * @param The class of the objects.
 * @param {String} The method name.
 * @param {Integer} The interceptor type.
 * @param {Function} The method should be used to intercept class.
 */
JSINER.registerInterceptor = function(aClass, aMethodName, aType, aMethod)
{
	var constr = this.getConstructor(aClass);
	if (constr !== null && COMMONS.isFunction(aMethod))
	{
		var key = this.getType(constr) + "." + aMethodName;
		var oldMethod = constr.prototype[aMethodName];
		if (!this.fMethods.isContains(key))
		{
			this.fMethods.put(key, oldMethod);
		}
		if (this.isUndefined(oldMethod))
		{
			aType = this.INTERCEPT_INSTEAD;
		}

		var newFunction = null;
		switch (aType)
		{
			case this.INTERCEPT_BEFORE:
				newFunction = function()
				{
					aMethod.apply(this, arguments);
					return oldMethod.apply(this, arguments);
				};
				break;
			case this.INTERCEPT_AFTER:
				newFunction = function()
				{
					var result = oldMethod.apply(this, arguments);
					aMethod.apply(this, arguments);
					return result;
				};
				break;
			case this.INTERCEPT_INSTEAD:
				newFunction = function()
				{
					var result = aMethod.apply(this, arguments);
					return result;
				};
				break;
			case this.INTERCEPT_ON_ERROR:
				newFunction = function()
				{
					var result = null;
					try
					{
						result = oldMethod.apply(this, arguments);
					}
					catch(ex)
					{
						result = aMethod.apply(this, arguments);
					}
					return result;
				};
				break;
			default:
				this.fLogger.error("register interceptor, unsupported type " + aType);
				break;
		}
		constr.prototype[aMethodName] = newFunction;
	}
	else
	{
		this.fLogger.error("register interceptor, unsupported arguments " + aClass );
	}
};

/**
 * Unregisters the interceptor on defined method of the class.
 *
 * @param The class of the objects.
 * @param {String} The method name.
 */
JSINER.unregisterInterceptor = function(aClass, aMethodName)
{
	var constr = this.getConstructor(aClass);
	if (constr !== null)
	{
		var key = this.getType(constr) + "." + aMethodName;
		if (this.fMethods.isContains(key))
		{
			constr.prototype[aMethodName] = this.fMethods.get(key);
			this.fMethods.remove(key);
		}
		else
		{
			this.fLogger.warning("unregister interceptor, " + key + " never was registered.");
		}
	}
	else
	{
		this.fLogger.error("unregister interceptor, unable to obtain object constructor " + aClass);
	}
};

/**
 * Introspects object and creates string representation of object structure.
 *
 * @param {Object} The introspected object.
 * @param {Boolean} The flag defines that the object properties
 * should be not introspected.
 *
 * @return {String} The string representation of object stucture.
 */
JSINER.getInfo = function(anObject, anAttributesOnly)
{
	var result = typeof(anObject);
	if (COMMONS.isObject(anObject))
	{
		result += "[" + this.getType(anObject) + "]\n";
		if ( !anAttributesOnly )
		{
			var properties = [];
			var value;
			for (var name in anObject)
			{
				try
				{
					value = anObject[name];
					properties.push(COMMONS.isFunction(value) ? (name + "()") : (name + "=" + value));
				}
				catch(ex)
				{
					properties.push(name);
				}
			}
			if (properties.length > 0)
			{
				result += properties.sort().join(", ");
			}
		}

		if ( COMMONS.isArray(Object.attributes) )
		{
			var attributes = [];
			var attribute;
			try
			{
				for (var j = 0; j < anObject.attributes.length; j++)
				{
					attribute = anObject.attributes[j];
					if (attribute.nodeValue !== null && attribute.nodeValue !== '')
					{
						attributes.push(attribute.name + "=" + attribute.nodeValue);
					}
				}
			}
			catch(ex)
			{
			}
			if (attributes.length > 0)
			{
				result += "\n [" + attributes.sort().join(", ") + "]";
			}
		}
	}
	return result;
};

/**
 * A HashMap - an object that maps keys to values and does not contain duplicate keys.
 * @constructor
 *
 * @param {JSON} The object used to constructs the HashMap with the same
 * mappings as the specified by parameter property-value map.
 */
function HashMap(anObject)
{
	/**
	 * The map: key - value.
	 * @private
	 */
	this.fObject = anObject || {};
	/**
	 * The number of elements in the collection.
	 * @private
	 * @type Integer
	 */
	this.fSize = 0;
	for(var name in this.fObject )
	{
		if ( this.fObject.hasOwnProperty(name) )
		{
		  this.fSize++;
		}	
	}
}

/**
 * Indicates that the collection contains no elements.
 * @return {Boolean} Returns true if the collection contains no elements.
 */
HashMap.prototype.isEmpty = function()
{
	return this.getSize() === 0;
};

/**
 * Returns the number of elements in the collection.
 * @return {Integer} Returns the number of elements in the collection.
 */
HashMap.prototype.getSize = function()
{
	return this.fSize;
};

/**
 * Returns the value which the collection maps the specified key.
 * Returns undefined if the collection contains no mapping for this key.
 * @param {String} The key.
 * @return Returns the value according to which the collection maps the specified key.
 */
HashMap.prototype.get = function(aKey)
{
	return this.fObject[aKey];
};

/**
 * Indicates that the collection contains the specified key.
 * @param {String} The key, which presence in the collection is to be tested.
 * @return {Boolean} Returns true if the collection contains the specified key.
 */
HashMap.prototype.isContains = function(aKey)
{
	return COMMONS.isDefined(this.get(aKey));
};

/**
 * Associates the value with the specified key in this collection.
 * @param {String} The key.
 * @param  The value.
 */
HashMap.prototype.put = function(aKey, aValue)
{
	if (!this.isContains(aKey))
	{
		this.fSize++;
	}
	this.fObject[aKey] = aValue;
};

/**
 * Removes the specified key from the collection.
 * @param {String} The key to be removed from the collection.
 */
HashMap.prototype.remove = function(aKey)
{
  if ( this.isContains(aKey))
	{
		this.fObject[aKey] = undefined;
		delete this.fObject[aKey];

		if ( !this.isContains(aKey) )
		{
			this.fSize--;
		}
	}
};

/**
 * Clears the collection.
 */
HashMap.prototype.clear = function()
{
	this.fSize = 0;
	this.fObject = {};
};

/**
 * A KeySet - a collection of unique keys.
 * The KeySet inherits from HashMap.
 * @constuctor
 * 
 * @param The arguments which used to prepare a set by the specified values.
 */
function KeySet()
{
	var self = JSINER.extend(this, HashMap);
	for( var i = 0; i < arguments.length; i++ )
	{
		self.add(arguments[i]);
	}
	return self;
}

/**
 * Adds the specified key to the set.
 * @param {String} The key to be added to the set.
 */
KeySet.prototype.add = function(aKey)
{
	KeySet.superClass.put.call(this, aKey, true);
};


/**
 * Returns the number of elements in the collection.
 * @return {Integer} Returns the number of elements in the collection.
 */
KeySet.prototype.getSize = function()
{
	return this.fSize;
};


/**
 * Defines a set of already loaded scripts.
 */
JSINER.fScripts = new KeySet();

/**
 * An AJAX transporter.
 * Provides a interface to cross-browser instantiantion of the XMLHttpRequest. 
 * @constructor
 * The main feature of the AJAX transporter
 * is ability to register custom response handlers for
 * corresponding HTTP XML request statuses.
 * It allowed to use custom HTTP XML status codes to assign
 * custom particular business logic. For example: code 5222 can
 * designates that the server is busy and code 5223 - the session is expired.
 *
 * @param {Function} The method is invocated if data is loaded successfully.
 * @param {String} The transporter task ID.
 *
 * @param {String} The HTTP method, which is used for the request.
 * If the method is not defined, POST is used for sending data to server.
 * and GET is used for loading data from server.
 *
 * @param {Integer} The max count of attempts, which is used for sending data. 
 * The behavior of the transporter can be customized by custom response handlers.
 *
 * @param {Boolean} The flag determines whether XMLHttpRequest
 * is to be send the request asynchronously or not.
 */
function Transporter(anOnLoad, aTaskID, aMethod, aCounter, anAsynch)
{
	/**
	  * The flag determines whether XMLHttpRequest
    * is to be send the request asynchronously or not.
    * @type Boolean
	  */
	this.fAsynch = COMMONS.isBoolean(anAsynch) ? anAsynch : true;
	/**
	  * The transporter task ID.
	  * @type String
	  */
	this.fTaskID = aTaskID;
	/**
	  * The max count of attempts, which is used for sending data to URL.
	  * @type Integer
	  */
	this.fCounter = COMMONS.isNumber(aCounter) ? Math.max(aCounter, 0) : 1;
	/**
	  * The HTTP method, which is used for the request
	  * @type String
	  */
	this.fMethod = aMethod;
	/**
	  * The method is invocated if data is loaded successfully.
	  * @type Function
	  */
	this.onLoad = anOnLoad;
	/**
	  * The transporter logger.
	  * @type Logger
	  */
	this.fLogger = new Logger("Transporter");
	/**
	  * The polling frequency, in milliseconds, to make next attemption to send request
	  * if result was failure.
	  * The behavior of the transporter can be customized by custom response handlers.
	  * @type Integer
	  * @see #setResponseHandeler
	  */
	this.fTimeout = 1000;
	/**
	  * The URI which used to send the request.
	  * @private
	  */
	this.fURI = null;
	/**
	  * The URL query part.
	  * @private
	  */
	this.fQueryString = null;
	/**
	  * The current request attemption counter.
	  * @private
	  */
	this.fTaskCounter = this.fCounter;
	/**
	  * The XMLHTTPRequest object.
	  * @private
	  */
	this.fReq = null;
	/**
	  * The send request task id.
	  * @private
	  */
	this.fReqTaskID = null;
	/**
	  * The map [reposnse staus - function] of response handlers.
	  * @see #setResponseHandeler
	  * @private
	  */
	this.fResponseHandlers = new HashMap();
	/**
	  * Registers default respponse handlers.
	  * @private
	  */
	this.registerDefaults();
}

/**
  * The set of transporter tasks ID.
  */
Transporter.fTaskSet = new KeySet();

/**
 * Sets the transporter task status.
 *
 * @param {String} The transporter task ID.
 * @param {Boolean} The transporter task status.
 * True represented that the task is alive, false - the contrary.
 */
Transporter.setTaskAlive = function(aTaskID, anAlive)
{
	if (COMMONS.isDefined(aTaskID))
	{
		if (anAlive)
		{
			Transporter.fTaskSet.add(aTaskID);
		}
		else
		{
			Transporter.fTaskSet.remove(aTaskID);
		}
	}
};

/**
 * Indicates the transporter overall status.
 *
 * @return {Boolean} Returns true if any of transporter tasks are alive,
 * otherwise it returns false.
 */
Transporter.isLoaderAlive = function(aTaskID)
{
	var result = !Transporter.fTaskSet.isEmpty();
	return result;
};

/**
 * Indicates the transporter task status.
 *
 * @param {String} The transporter task ID.
 * @return {Boolean} Returns true if the task is alive,
 * otherwise it returns false.
 */
Transporter.isTaskAlive = function(aTaskID)
{
	var result = false;
	if (COMMONS.isDefined(aTaskID))
	{
		result = Transporter.fTaskSet.isContains(aTaskID);
	}
	return result;
};

/**
 * Adds parameter to defined URL.
 * <ul>
 *  <li>In case when the URL does not contain query part: <code>URL?name=value</code>.
 *  <li>In case when the URL contains query part: <code>URL&name=value</code>.
 *  <li>In case when the URL query part contains the parameter, parameter value will be replaced.
 * </ul>
 *
 * @param {String} The URL.
 * @param {String} The parameter name.
 * @param {String} The parameter value.
 * @return {String} Returns the modified URL.
 */
Transporter.addParameter = function(aURL, aParamName, aValue)
{
	var result = aURL;
	if ( COMMONS.isString(aURL) && COMMONS.isString(aParamName) && COMMONS.isDefined(aValue) )
	{
		var prefix = aParamName + "=";
		var index = aURL.indexOf(prefix);
		if ( index > 0 )
		{
			result = aURL.substring(0, index + prefix.length) + aValue;
			var lastIndex = aURL.indexOf("&", index + prefix.length);
			if ( lastIndex > 0 )
			{
				result += aURL.substring(lastIndex, aURL.length);
			}
		}
		else
		{
			result += (result.indexOf('?') > 0) ? "&" : "?" ;
			result += prefix + aValue;
		}
	}
	return result;
};

/**
 * Predefined collection of ActiveX objects is used for creation of
 * XMLHttpRequest by Microsoft IE.
 */
Transporter.ActiveX_TRANSPORT = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.5.0",
																"Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0"];

/**
 * Returns HTTP request query string by set of data represented as order of name and value.
 *
 * @param  {Array} The array which contains the ordered request query parameters.
 * <samp>getQueryString( [0, 1, "param1", value1, "param2", value2], 2)</samp>
 * The second parameter 2 defines a start point from which
 * the query parameters start iterated in an array.
 * <samp>getQueryString( ["param1", value1, "param2", value2] )</samp>
 *
 * @return {Integer} The index in the array which used as start point to iterate the query parameters.
 * If the index is not defined, iterate starts from the fist element of the array.
 *
 * @return {String} Returns HTTP request query string.
 */
Transporter.prototype.getQueryString = function(anArray, aIndex)
{
	var result = null;
	var index = COMMONS.isNumber(aIndex) ? Math.max(aIndex, 0) : 0;
	if (COMMONS.isArray(anArray) && anArray.length >= index)
	{
		result = anArray[index];
		if (anArray.length >= index)
		{
			for (var i = index + 1; i < anArray.length; i++)
			{
				result += ((i % 2 === 1) ? "=" : "&") + anArray[i];
			}
		}
	}
	return result;
};

/**
 * Returns default response handler.
 * @return {Function} Returns default response handler.
 *
 * @see #getResponseHandler
 */
Transporter.prototype.getDefaultHandler = function()
{
	return this.errorHandler();
};

/**
 * Returns response handler according to response status code.
 *
 * @param {Integer} The response status code.
 * @return {Function} Returns response handler according to response status code.
 * Returns custom response handler when it was registered, otherwise
 * returns predefined response handler.
 *
 * @see #getDefaultHandler
 */
Transporter.prototype.getResponseHandler = function(aStatusCode)
{
	var result = this.fResponseHandlers.get(aStatusCode);
	if (!COMMONS.isDefined(result))
	{
		result = this.getDefaultHandler();
	}
	return result;
};

/**
 * Registers default response handler.
 */
Transporter.prototype.registerDefaults = function()
{
	this.setResponseHandeler(400, this.fatalErrorHandler);
	this.setResponseHandeler(500, this.fatalErrorHandler);
	this.setResponseHandeler(0, this.okHandler);
	this.setResponseHandeler(200, this.okHandler);
};

/**
 * Registers custom response handler.
 * @param {Integer} The response status code.
 * @param {Function} The custom response handler.
 */
Transporter.prototype.setResponseHandeler = function(aStatusCode, aHandler)
{
	this.fResponseHandlers.put(aStatusCode, aHandler);
};

/**
 * Customizes HTTP request headers .
 * @param {XMLHTTPRequest} The XMLHTTPRequest.
 */
Transporter.prototype.customizeHeaders = function(aRequest)
{
	var contentType = (this.fMethod === "POST") ? 'application/x-www-form-urlencoded;charset="utf-8"' :
	                                              'text/xml;charset="utf-8"';
	aRequest.setRequestHeader('Content-type', contentType);
	if ( COMMONS.isGecko )
	{
		aRequest.setRequestHeader('Connection', 'close');
  }
};

/**
 * Forces the transporter to send data to server.
 * <samp>new Transporter().request("controller.jsp", "post", "parameter1", value1, "parameter2", value2);</samp>
 *
 * @param {String} The request URI.
 * @param {String} The request method.
 * @param {String} The request query string.
 */
Transporter.prototype.request = function(aURI, aMethod, aQuery)
{
	this.fURI = aURI;
	this.fTaskCounter = this.fCounter;
	this.fQueryString = aQuery;
	this.fMethod = aMethod;
	Transporter.setTaskAlive(this.fTaskID, true);
	try
	{
		this.doLoadData();
	}
	catch (ex)
	{
		this.fLogger.warning("doLoadData error happened", ex);
	}
};

/**
 * Forces the transporter to send data to server using POST method.
 * <samp>new Transporter().sendData("controller.jsp", "parameter1", value1, "parameter2", value2);</samp>
 *
 * @param {String} The request URI.
 * @param The set of data which should be send to server as ordered pairs of name and value.
 */
Transporter.prototype.sendData = function(aURI)
{
	var query = this.getQueryString(arguments, 1);
	this.request(aURI, "POST", query);
};

/**
 * Forces a transporter to get data from server using GET method.
 * <samp>new Transporter().loadData("controller.jsp", "parameter1", value1, "parameter2", value2);</samp>
 *
 * @param {String} The server URI.
 * @param The set of query parameters which are to be used to obtain response from the server.
 */
Transporter.prototype.loadData = function(aURI)
{
	var query = this.getQueryString(arguments, 1);
	this.request(aURI, "GET", query);
};

/**
 * The inner method of the transporter.
 * Prepares XML HTTP request and sends request to URL.
 */
Transporter.prototype.doLoadData = function()
{
	if (window.XMLHttpRequest)
	{
		this.fReq = new XMLHttpRequest();
	}
	else
	if (window.ActiveXObject)
	{
		if (COMMONS.isDefined(Transporter.ActiveX_TRANSPORT.transport))
		{
			this.fReq = new ActiveXObject(Transporter.ActiveX_TRANSPORT.transport);
		}
		else
		{
			var value;
			for (var i = 0; i < Transporter.ActiveX_TRANSPORT.length; i++)
			{
				value = Transporter.ActiveX_TRANSPORT[i];
				try
				{
					this.fReq = new ActiveXObject(value);
					Transporter.ActiveX_TRANSPORT.transport = value;
					break;
				}
				catch(ex)
				{
				}
			}
		}
	}

	if ( COMMONS.isDefined(this.fReq) )
	{
    this.fProcessed = false;

		var transport = this;
		this.fReq.onreadystatechange = function()
		{
			transport.onReadyState.call(transport);
		};

		try
		{
			this.fReq.open(this.fMethod, this.fURI, this.fAsynch);
			this.customizeHeaders(this.fReq);
			this.fReq.send(this.fQueryString);
			this.fLogger.info("Open request: " + this.fURI + (this.fQueryString ? "?" + this.fQueryString : ""));
			
			if ( !this.fAsynch && COMMONS.isGecko && this.fReq.readyState === 4 )
			{
			  this.onReadyState();
			}
		}
		catch (ex)
		{
			this.fatalErrorHandler();
		}
	}
	else
	{
		this.fLogger.error("Browser not supported XMLHttpRequest");
	}
};

/**
 * The request onreadystatechange call back.
 */
Transporter.prototype.onReadyState = function()
{
	var ready = this.fReq.readyState;
	if (ready === 4)
	{
		if ( !this.fProcessed )
		{
			var handler = this.getResponseHandler(this.fReq.status);
			handler.call(this);
			this.fReq.onreadystatechange = COMMONS.returnTrue;
			this.fProcessed = true;
		}
	}
};

/**
 * Default successful request handler.
 */
Transporter.prototype.okHandler = function()
{
	this.fLogger.info("Request successfully: " + this.fURI);
	if (COMMONS.isFunction(this.onLoad))
	{
		try
		{
			this.onLoad.call(this);
		}
		catch(ex)
		{
			this.fLogger.error("Callback error: " + this.fURI, ex, this.onLoad);
		}
	}
	Transporter.setTaskAlive(this.fTaskID, false);
};

/**
 * Fatal error handler. It called on very severe error
 * that will require the transporter to abort
 * XML HTTP request.
 */
Transporter.prototype.fatalErrorHandler = function()
{
	if (this.fReqTaskID !== null)
	{
		window.clearTimeout(this.fReqTaskID);
		this.fReqTaskID = null;
	}
	Transporter.setTaskAlive(this.fTaskID, false);
	if (COMMONS.isDefined(this.fReq))
	{
		this.fLogger.error(this.fReq.status + ", request " + this.fURI + " error. Headers: " +
		                   this.fReq.getAllResponseHeaders());

		this.fReq.onreadystatechange = COMMONS.returnTrue;
		this.fReq.abort();
	}
};

/**
 * Error handler. It called on request error
 * and allowes the transporter to try the request again,
 * after short waiting.
 */
Transporter.prototype.errorHandler = function()
{
	if (this.fReqTaskID !== null)
	{
		window.clearTimeout(this.fReqTaskID);
		this.fReqTaskID = null;
	}
	if (this.fTaskCounter <= 0)
	{
		Transporter.setTaskAlive(this.fTaskID, false);
		this.fLogger.error(this.fReq.status + ", request  " + this.fURI + " error. Headers: " +
		                   this.fReq.getAllResponseHeaders());
	}
	else
	{
		var transporter = this;
		this.fTaskCounter = this.fTaskCounter - 1;
		this.fReqTaskID = window.setTimeout(function()
		{
			transporter.doLoadData();
		}, this.fTimeout);
		this.fLogger.info(this.fReq.status + ", trying to request " + this.fURI + " again....");
	}
};

/**
 * Returns XML HTTP request responsed text.
 * @return {String} Returns XML HTTP request responsed text.
 */
Transporter.prototype.getResponsedText = function()
{
	var result = null;
	if (COMMONS.isDefined(this.fReq))
	{
		result = this.fReq.responseText;
	}
	return result;
};

/**
 * Returns XML HTTP request responsed XML.
 * @return {String} Returns XML HTTP request responsed XML.
 */
Transporter.prototype.getResponsedXML = function()
{
	var result = null;
	if (COMMONS.isDefined(this.fReq))
	{
		try
		{
			result = this.fReq.responseXML;
		}
		catch(ex)
		{
			this.fLogger.error("Unable to parse responsed XML", ex);
		}
	}
	return result;
};

/**
 * JavaScript dependency injector.
 *
 * @param {Array} The object dependecy as array of dependency keys which should be resolved.
 * @param {Function} The call back function invocated when all object dependency loaded.
 *
 * @see #extend
 */
JSINER.inject = function(aDependency, aCallBack)
{
	var getUri = function(aLoader, aDependency)
	{
		var result = null;
		for (var i = aLoader.fIndex; i < aDependency.length; i++)
		{
			var link = aDependency[aLoader.fIndex];
			if (!JSINER.isScriptLoaded(link))
			{
				result = JSINER.getScriptURI(link);
				if (result !== null)
				{
					aLoader.fIndex = i;
					break;
				}
			}
		}
		return result;
	};

	if ( COMMONS.isDefined(aDependency) )
	{
		if ( !COMMONS.isArray(aDependency) )
		{
			aDependency = [aDependency];
		}

		var loader = new Transporter(function()
		{
			var code = this.getResponsedText();
			if (window.execScript)
			{
				window.execScript(code, 'javascript');
			}
			else
			if (COMMONS.isSafari)
			{
				var heads = document.getElementsByTagName('head');
			  var head = heads.length > 0 ? heads[0] : document.body;

				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.innerHTML = code;
				head.appendChild(script);
			}
			else
			{
				window.eval(code);
			}

			JSINER.fScripts.add(aDependency[this.fIndex]);
			this.fIndex++;

			var uri = getUri(this, aDependency);
			if (uri !== null )
			{
				this.loadData(uri);
			}
			else
			if ( COMMONS.isFunction(aCallBack) )
			{
				aCallBack();
			}
		});
		loader.fAsynch = false;
		loader.fIndex = 0;

		var uri = getUri(loader, aDependency);
		if ( uri !== null)
		{
			loader.loadData(uri);
		}
		else
		if ( COMMONS.isFunction(aCallBack) )
		{
			aCallBack();
		}
	}
};