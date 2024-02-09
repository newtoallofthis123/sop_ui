/*************************************************************************

	APPROACH
	Organic, human driven software.


	COPYRIGHT NOTICE
	__________________

	Copyright 2002-2023 - Garet Claborn, Orchestration Syndicate Corporation
	All Rights Reserved.

	Title: Approach Interface, a system of accessing systems.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

*/

// needed because this is poop w/out jquery
// noinspection JSUnusedAssignment

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Credit: Matthias Bynens + tweaks by Approach contributors
// https://mathiasbynens.be/notes/globalthis

(function () {
    if (typeof globalThis === "object") return;
    Object.prototype.__defineGetter__("__globalThisMagic__", function () {
        return this;
    });
    __globalThisMagic__["globalThis"] = __globalThisMagic__;
    __globalThisMagic__.globalThis = __globalThisMagic__;
    delete Object.prototype["__globalThisMagic__"];
}());

// Credit: Garet Claborn
// runtime namespacing, attaches data at end of namespace provided by scope array
// addScopeJS( [ "Approach", "project", "tool"], pluginDefinition );
function addScopeJS(scope = [], data, $root = globalThis) {

    // If array has anything in it, define root.next_scope
    if (scope.length > 0) {
        let s = scope.shift();  // array shrinks on each dive deeper into the recursion
        if (typeof $root[s] == "undefined") {
            $root[s] = {};
        }
        addScopeJS(scope, data, $root[s]);
    }

    // If array was empty, and is an object, assign properties to this this scope
    else{
        if (typeof (data) == "object" && data !== {}) {
            for (const key in data) {
                $root[key] = data[key];
            }
        }
        // If array was empty, and is not an object, assign whatever was passed to this scope
        else {
            $root = data;
        }
    }

}


// Credit: Tom Samwel
// overwrite a defaults config object with custom config recursively
function overwriteDefaults(config = {}, defaults = {}) {
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            // Check if there are nested properties, check if those properties exist in $elf.config also
            if (typeof config[key] === 'object' && typeof defaults[key] != "undefined") {
                overwriteDefaults(config[key], defaults[key])
            }
            // otherwise directly assign the value to the property on the current level
            else defaults[key] = config[key];
        }
    }
}

function SendIntent(RequestData, callback, api) {
    $.ajax({
        url: api,
        type: "post",
        data: RequestData,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: callback
    });
}

function isEmpty(mixedVar = null){
    //  discuss at: https://locutus.io/php/empty/
    // original by: Philippe Baumann
    //    input by: Onno Marsman (https://twitter.com/onnomarsman)
    //    input by: LH
    //    input by: Stoyan Kyosev (https://www.svest.org/)
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Francesco
    // improved by: Marc Jansen
    // improved by: Rafał Kukawski (https://blog.kukawski.pl)
    let undef
    let key
    let i
    let len
    const emptyValues = [undef, null, false, 0, '', '0']
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            if (mixedVar.hasOwnProperty(key)) {
                return false
            }
        }
        return true
    }
    return false
}
