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

var APPROACH_DEBUG_MODE = true;


// endsWith polyfill a la mozilla.org
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== "number" || !Number.isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

function getUrlVars() {
	var vars = [];
	var hash;
	var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function slidesLoadedHandler(list) {
	var activeElement = $(list).children(".active")[0];

	if (list.requester == "Next" && $(list).children().last()[0] != activeElement) //&&   check extreme
	{
		$(activeElement).removeClass("active");
		activeElement = $(activeElement).next();
		$(activeElement)[0].className += " active";
	}
	if (list.requester == "Back" && $(list).children().first()[0] != activeElement) //&& check extreme
	{
		$(activeElement).removeClass("active");
		activeElement = $(activeElement).prev();
		$(activeElement)[0].className += " active";
	}
}

function profile(target, RunOnce) {
	var attribs;
	attribs = [];
	try {
		target = $(target);
		if (typeof (target.attributes) != "undefined") {
			attribs = target.attributes;
			target = $(target);
		} else if (typeof (target.context.attributes) != "undefined") {
			attribs = target.context.attributes;
			target = $(target.context);
		} else if (typeof (target[0]) != "undefined") {
			if (typeof (target[0].attributes) != "undefined") {
				attribs = target[0].attributes;
				target = $(target[0]);
			} else if (typeof (target[0].context.attributes) != "undefined") {
				attribs = target[0].context.attributes;
				target = $(target[0].context);
			}
		}
	} catch (e) {
		console.groupCollapsed("Interface Target Profile Debug");
		console.log(target);
		console.log(arguments.callee.caller);
		console.groupEnd();
	}

	var IntentJSON = {};

	IntentJSON.support = {};
	IntentJSON.support.target = {};
	IntentJSON.support.target.value = $(target).val();
	IntentJSON.support.target.attributes = {};

	for (var i = 0; i < attribs.length; i++)
		IntentJSON.support.target.attributes[attribs[i].nodeName] = attribs[i].value;

	IntentJSON.support.target.tag = $(target).prop("tagName").toLowerCase();
	if (typeof (RunOnce) === "undefined") IntentJSON.support.target.parent = profile($(target[0].parentNode), true);
	return IntentJSON.support.target;
}

function classSplit(incoming) {
	return incoming.className.split(/\s+/);
}

function split_on_space(incoming) {
	if (typeof incoming !== "string") return [];
	else return incoming.split(/\s+/);
}

function debug(reason, loggable) {
	console.groupCollapsed("Approach Interface Debug");
	console.log(reason);
	console.log(loggable);
	console.groupEnd();
}

function dragger() {
	$(this).bind("mousedown", function (event) { });
}

var topChange = 0,
	fullscreenModeActive = false,
	controlsHidden = false,
	html5 = false,
	ApproachTotalRequestsAJAX = 0,
	hideControls = false,
	AnimatingControls = false,
	ob2 = null,
	ActiveTimeStream = 0,
	ActiveFadePhase = 0,
	FadeTimer = 1,
	projectorClass = "up";


var Interface = function ({Markup = {}, api = "//service.example.com/MyService", user_init = function (e) { return true; }}={}) {

	var $elf = this;
	
	this.active = true;
	this.api = api;
	this.Controls = [];
	this.target = {};

	this.call = {
		init: function (Markup, user_init = function (e) {
			return true;
		}) {
			var data_trigger = "",
				event_triggers = "click mouseenter mouseleave";
			$elf.Interface = Markup;
			if ($(Markup).hasClass("controls")) {
				$elf.Controls = $(Markup);	// [ Markup] for vanilla
				$elf.Controls.add($elf.Controls.find(".controls"));	// add sub .controls to the jQUery object. array.push for vanilla
			}
			else $elf.Controls = $(Markup).find(".controls"); // Markup.querySelector(".controls") for vanilla

			$elf.Controls.on(event_triggers, function (event) {	// each for vanilla
				$elf.call.events(event);
			});

			$elf.Controls.find(".control[data-trigger]").each(function (i, el2) {
				data_trigger = $(el2).data("trigger");
				$(el2).on(data_trigger, function (event) {
					$elf.call.events(event);
				});
			});

			$elf.call.userinit = user_init;
			return $elf;
		},
		userinit: function (e) {
			return true;
		},
		reinit: function (DynamicElement, user_init) {
			var classes = split_on_space($(DynamicElement)[0].className);
			$.each(classes, function (i, _class) {
				if (_class == "Interface") {
					$(DynamicElement)[0].Interface = new Interface();
					$(DynamicElement)[0].Interface.call.init(DynamicElement[0], user_init);

					$.ActiveInterface = $(DynamicElement)[0].Interface;
					$(DynamicElement)[0].Interface.active = true;
					//DynamicElement.find(".controls").bind("click mouseenter mouseleave", function(event){ InterfaceEvents(event); });
				}
			});
		},
		rebind: function (el, seeking = "controls") {
			var ran = false;
			event_triggers = "click mouseenter mouseleave",
				data_trigger = "";
			if ($(el).hasClass("controls").length > 0) {
				var TargetInterface = el.closest(".Interface");
				if (TargetInterface.length < 1) {
					TargetInterface = $elf.Markup.Interface;
					console.log("Controls added with no interface, bootstrapping to caller interface.", el, $elf.Markup);
				}
				TargetInterface.Controls.push(el);
				TargetInterface.Controls[TargetInterface.Controls.length - 1].off(event_triggers, function (event) {
					TargetInterface.call.events(event);
				});
				TargetInterface.Controls[TargetInterface.Controls.length - 1].on(event_triggers, function (event) {
					TargetInterface.call.events(event);
				});
				$(TargetInterface.Controls[TargetInterface.Controls.length - 1]).find(".control[data-trigger]").each(function (i, el) {
					data_trigger = $(el).data("trigger");
					$(el).off(data_trigger, function (event) {
						TargetInterface.call.events(event);
					});
					$(el).on(data_trigger, function (event) {
						TargetInterface.call.events(event);
					});
				});


				el.find("Interface").each(function (i, child) {
					child[0].Interface = new Interface();
					child[0].Interface.call.init(child[0], this.user_init);
					$.ActiveInterface = child[0].Interface;
					child[0].Interface.active = true;
				});
				ran = true;
			} else if ($(el).hasClass("Interface")) {
				el = $(el);
				el.find(".controls .control[data-trigger]").each(function (i, el2) {
					data_trigger = $(el2).data("trigger");
					$(el2).off(data_trigger, function (event) {
						$elf.call.events(event);
					});
				});
				el.find(".controls").off(event_triggers, function (event) {
					$elf.call.events(event);
				});
				el.find(".controls .control").off(event_triggers, function (event) {
					$elf.call.events(event);
				});
				el[0].Interface = new Interface();
				el[0].Interface.call.init(el[0], this.user_init);
				$.ActiveInterface = el[0].Interface;
				el[0].Interface.active = true;


				el.find("Interface").each(function (i, child) {
					child[0].Interface = new Interface();
					child[0].Interface.call.init(child[0], this.user_init);
					$.ActiveInterface = child[0].Interface;
					child[0].Interface.active = true;
				});
				ran = true;
			}
			if (!ran)
				$(el).children().each(function (i, child) {
					$elf.call.rebind(child);
				});
		},
		AjaxError: function (json, status, error) {
			$($elf.target).show();
			$(".LoadingContain").remove();
			console.log(json, status, error);
		},
		Ajax: function (json, status, xhr) {

			$($elf.target).show();
			//$($elf.target).next(".LoadingContain").remove();
			$($elf.target).next(".LoadingContain").hide(
				"slow",
				function () {
					$(".LoadingContain").remove();
				}
			);

			console.groupCollapsed("Reacting to intent response");

			if (typeof json != "string")
				$.each(json, function (Activity, IntentJSON) {
					switch (Activity) {
						case "success":
						case "origin":
							break;
						case "APPEND":
						case "BOTTOM":
							if (APPROACH_DEBUG_MODE) console.log("$( --> $WorkData['_response_target'] <-- ).append( --> $WorkData['render'] <-- )");
							$elf.call.Append(IntentJSON);
							break;
						case "AFTER":
						case "AFFIX":
							if (APPROACH_DEBUG_MODE) console.log("$( --> $WorkData['_response_target'] <-- ).after( --> $WorkData['render'] <-- )");
							$elf.call.After(IntentJSON);
							break;
						case "BEFORE":
						case "PREFIX":
							if (APPROACH_DEBUG_MODE) console.log("$( --> $WorkData['_response_target'] <-- ).before( --> $WorkData['render'] <-- )");
							$elf.call.InsertBefore(IntentJSON);
							break;
						case "PREPEND":
						case "TOP":
							if (APPROACH_DEBUG_MODE) console.log("$( --> $WorkData['_response_target'] <-- ).prepend( --> $WorkData['render'] <-- )");
							$elf.call.Prepend(IntentJSON);
							break;
						case "REDIRECT":
							if (APPROACH_DEBUG_MODE) console.log("Redirecting");
							$elf.call.Redirect(IntentJSON);
							break;
						case "REFRESH":
							if (APPROACH_DEBUG_MODE) console.log("$( --> $WorkData['_response_target'] <-- ).html( --> $WorkData['render'] <-- )");
							$elf.call.Refresh(IntentJSON);
							break;
						case "REMOVE":
							if (APPROACH_DEBUG_MODE) console.log("Removing selector..");
							$elf.call.Remove(IntentJSON);
							break;
						case "TRIGGER":
							if (APPROACH_DEBUG_MODE) console.log("Triggering interface call: ", IntentJSON);
							$elf.call.Trigger(IntentJSON);
							break;
						default:
							if (APPROACH_DEBUG_MODE) console.log(Activity + " handler not detected, near line 240 acc.js. Appending To Debug Console: ", IntentJSON);
							$elf.call.Append({
								"#ApproachDebugConsole": "<li>Invalid AJAX Response: <br />\n<pre>" + json + "</pre></li>"
							});
							break;
					}
				});
			else {
				console.log("Unhandled Response Code", json);
				$elf.call.Append({
					"#ApproachDebugConsole": "<li>Invalid AJAX Response: <br />\n<pre>" + json + "</pre></li>"
				});
			}
			$elf.call.afterAjax(json, status, xhr);
			$elf.call.finallyAjax(json, status, xhr);

			console.groupEnd();
		},
		afterAjax: function (json, status, xhr) { },
		finallyAjax: function (json, status, xhr) { },
		Append: function (Info) {
			console.log("self.Append");
			$.each(Info, function (Selector, Markup) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";
					if (Selector.length - selFuncArgStart > 2) // Grab the argument list of the function myFunct({..})
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));

					if (typeof $elf[userFnName] === "function") // check for $elf.myFunc
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === "function") // check for window.myFunc
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function") // check for document.myFunc
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
				}
				console.log(Selector);
				var DynamicElement = $(Selector).append(Markup);
				//DynamicElement[0].scrollIntoView(false); //= $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element
				$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element
				$elf.call.reinit(DynamicElement, $elf.call.userinit);

				if ("RefreshComplete" in $elf)
					$elf.RefreshComplete(DynamicElement, Selector, Markup);

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});
			});
		},
		After: function (Info) {
			console.log(Info);
			$.each(Info, function (Selector, Markup) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				//If the selector is formatted like: something(...)
				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					//Get out the function name
					userFnName = Selector.substring(0, selFuncArgStart) + "";

					/* 	Get the "... arguments passed as json in something( ... )
						unless there are no arguments provided.

						userFnArgs becomes a plain object with your data

						example:
						".anySelector_JQueryOrCSS" :
							HandleComponentResponse( {
								user:10,
								name:"person",
								orders:[22,93,12,10]
							})

						becomes

						data-support='{
							"_response_target" :
								"HandleComponentResponse({
									\"user\":10,
									\"name\":\"person\",
									\"orders\":[22,93,12,10]
								})"
							}'

						becomes
						data-support='{ "_response_target" : "HandleComponentResponse({ \"user\":10, \"name\":\"person\", \"orders\":[22,93,12,10] })" }'


						CAUTION!! When embedded in html attributes, you will need to
						- Use 'string' not "string" inside the JSON portion
						- $.parseJSON is forgiving about using ' in JSON
						- HTML entities &#x22; and &#39; can replace double quote (") and single quote (') respectively
						- If you use attribute='' to enclose json, you can
					*/
					if (Selector.length - selFuncArgStart > 2)
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));
					if (typeof $elf[userFnName] === 'function')
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === 'function')
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
				}
				$(Selector).after(Markup);
				var DynamicElement = $(Selector).next();
				//DynamicElement[0].scrollIntoView(false); //
				$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element

				$elf.call.reinit(DynamicElement[0], $elf.call.userinit);

				if ("RefreshComplete" in $elf)
					$elf.RefreshComplete(DynamicElement[0], Selector, Markup);

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});

			});
		},
		InsertBefore: function (Info) {
			$.each(Info, function (Selector, Markup) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";
					console.log(userFnName, Selector.substring(selFuncArgStart + 1, Selector.length - 2));
					if (Selector.length - selFuncArgStart > 2)
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));

					if (typeof $elf[userFnName] === 'function')
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === 'function')
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
					console.log(Selector, "returned from call to " + userFnName + "( ", userFnArgs, " )");
					console.log("Caller: ", $elf);
				}
				$(Markup).insertBefore(Selector);
				var DynamicElement = $(Selector).prev();
				//DynamicElement[0].scrollIntoView(false); //$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight;
				$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element

				$elf.call.reinit(DynamicElement, $elf.call.userinit);

				if ("RefreshComplete" in $elf)
					$elf.RefreshComplete(DynamicElement, Selector, Markup);

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});
			});
		},
		Prepend: function (Info) {
			$.each(Info, function (Selector, Markup) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";
					if (Selector.length - selFuncArgStart > 2)
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));
					if (typeof $elf[userFnName] === 'function')
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === 'function')
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
				}
				var DynamicElement = $(Selector).prepend(Markup);
				//DynamicElement[0].scrollIntoView(false); //$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element
				$(Selector)[0].scrollTop = $(Selector)[0].scrollHeight; //Scroll to bottom. Improve by, scroll to appended element

				$elf.call.reinit(DynamicElement, $elf.call.userinit);

				if ("RefreshComplete" in $elf)
					$elf.RefreshComplete(DynamicElement, Selector, Markup);

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});

			});
		},
		Redirect: function (Info) {
			console.log("Redirecting to.. ", Info["url"]);
			window.location = Info["url"];
		},
		Refresh: function (Info) {
			$.each(Info, function (Selector, Markup) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};
				var DynamicElement = $(Markup);
				var classes = split_on_space(DynamicElement[0].className);
				var isCallback = false;
				var persistant = [];
				var persistCount = 0;

				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";
					if (Selector.length - selFuncArgStart > 2)
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));
					if (userFnName in $elf) {
						if (typeof $elf[userFnName] == "function")
							Selector = $elf[userFnName](userFnArgs, Info);
					} else if (userFnName in window) {
						if (typeof window[userFnName] == "function")
							Selector = window[userFnName](userFnArgs, Info);
					} else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
					console.log(Selector, "returned from call to " + userFnName + "( ", userFnArgs, " )");
					console.log("Caller: ", $elf);
					isCallback = true;
				}

				if (isCallback == false)
					if (typeof $(Selector).data("persist") != "undefined")
						$($(Selector).data("persist")).each(function (i, attribute) {
							persistant[attribute] = $(Selector).attr(attribute);
							persistCount++;
						});

				console.log("Refreshing: ", Selector, " with ", DynamicElement[0]);
				$(Selector).off();
				//$(Selector).replaceWith(DynamicElement);
				var DynamicElements = $(DynamicElement).replaceAll(Selector);

				if (isCallback == false)
					if (persistCount > 0) {
						for (var key in persistant) {
							console.log(key, persistant[key]);
							$(DynamicElements).each(function (i, el) {
								$(el).attr(key, persistant[key]);
							});
						}
					} else console.log(persistCount);

				//Bind Events for Dynamic Elements if they support Interface

				/*
			$.each(classes, function(i,_class)
			{
				if(_class == "Interface")
				{
					DynamicElement[0].Interface = new Interface();
					DynamicElement[0].Interface.call.init(DynamicElement[0]);

					$.ActiveInterface=DynamicElement[0].Interface;
					DynamicElement[0].Interface.active = true;
					//DynamicElement.find(".controls").bind("click mouseenter mouseleave", function(event){ InterfaceEvents(event); });
				}
			});*/
				$elf.call.reinit(DynamicElement, $elf.call.userinit);

				if ("RefreshComplete" in $elf)
					$elf.RefreshComplete(DynamicElement, Selector, Markup);

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});
			});
		},
		Remove: function (Info) {
			console.log(Info);
			$.each(Info, function (Selector) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				console.log(Selector);

				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";
					if (Selector.length - selFuncArgStart > 2)
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));

					if (typeof $elf[userFnName] === 'function')
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === 'function')
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
					console.log(Selector, "returned from call to " + userFnName + "( ", userFnArgs, " )");
					console.log("Caller: ", $elf);
				}

				var DynamicElement = $(Selector).remove();

				$(DynamicElement).trigger("InterfaceResponse", {
					DynamicElement: DynamicElement,
					Selector: Selector,
					Markup: Markup,
					response: Info
				});
			});
		},
		Trigger: function (Info) {
			$.each(Info, function (Selector, Trigger) {
				var selFuncArgStart = Selector.lastIndexOf("(");
				var userFnName = "";
				var userFnArgs = {};

				// this if is looking for  Selector == "myFunction( {arg, arg, arg} )"
				if (Selector.endsWith(")") && selFuncArgStart != -1) {
					userFnName = Selector.substring(0, selFuncArgStart) + "";

					// This If detects if the function had arguments and splices them out
					if (Selector.length - selFuncArgStart > 2)
						// Decode arguments passed as a json object
						userFnArgs = $.parseJSON(Selector.substring(selFuncArgStart + 1, Selector.length - 2));

					// Feed arguments to client-side function provided by AJAX response
					if (typeof $elf[userFnName] === 'function')
						Selector = $elf[userFnName](userFnArgs, Info);
					else if (typeof window[userFnName] === 'function')
						Selector = window[userFnName](userFnArgs, Info);
					else if (userFnName in document) {
						if (typeof document[userFnName] == "function")
							Selector = document[userFnName](userFnArgs, Info);
					} else {
						Selector = null;
						console.log("Selector function '" + userFnName + "()' not found");
					}
					console.log(Selector, " returned from call to " + userFnName + "( ", userFnArgs, " )");
					console.log("Caller: ", $elf);
				}

				$(Selector).trigger(Trigger["command"], Trigger["support"]);
				console.log("Triggering ", Trigger["command"], " with payload ", Trigger["support"]);
			});
		},
		Service: function (target, IntentJSON){
			let api_url = $elf.api;
			let api_method = "POST";
			let api_dataType = "json";
			
			let CurrentControl = $(target).closest(".control");			// todo: use defaultable options instead
			let override_api = CurrentControl.data("api");
			let override_method = CurrentControl.data("api-method");
			let override_dataType = CurrentControl.data("api-datatype");

			// override if needed
			if (override_api) api_url = override_api;
			if (override_method) api_method = override_method;
			if (override_dataType) api_dataType = override_dataType;

			var RequestType = ""; // The page action that handles the response (REFRESH, APPEND, PREPEND...)
			var RequestNoun = ""; // The system's domain-specific class, component or scope you're working in
			var RequestVerb = ""; // A function, method, action or operation in the selected scope

			var $control_role = false;

			if (IntentJSON["support"] == undefined) IntentJSON.support = {};
			if (IntentJSON.command == undefined) IntentJSON.command = {};

			for (var key in IntentJSON.command) //hacky, do not submit multiple commands e_e
			{
				RequestType = key;
				for (var k in IntentJSON.command[key]) {
					RequestNoun = k;
					RequestVerb = IntentJSON.command[key][k];
					break;
				}
				break;
			}

			console.groupCollapsed("Launching Intent " + RequestType + ":" + RequestNoun + ":" + RequestVerb);

			$control_role = CurrentControl.data("role");
			//console.log($control_role);
			//console.log(IntentJSON.command);    //if (RequestNoun == "Instance") console.log("Instance");


			// TODO: Replace this with approach.autoform.js module call
			// Put autoform instance in $elf.manged.autoform = new Approach.Autoform();


			if ($control_role == "autoform") {

				console.groupCollapsed("Auforming intent support values..");

				//Get all <form> fields inside each <container class="Interface"> or <container class="InterfaceContent">
				//put them into "forms"
				var forms =
					$($elf.Interface).hasClass("InterfaceContent") ?
						$($elf.Interface).find("form") :
						$($elf.Interface).find(".InterfaceContent").find("form");

				var multiform = {};
				forms.each(function (i, obj) {
					var formAction = ($(obj).attr("data-action")) ? $(obj).data("action") : obj["action"];
					if (typeof multiform[formAction] != "undefined")
						return true;

					var count = forms.filter("form[data-action='" + formAction + "'], form[action='" + formAction + "']").length;
					if (count > 1) {
						console.log("Multiple " + formAction + " forms found. (" + count + ")");
						multiform[$(obj).data("action")] = count;
					} else console.log("Single " + formAction + " form found.");
					return true;
				});

				var c = 0;
				forms.each(function (i, obj) {

					// attach any data for ajax calls after verb
					var formAction = ($(obj).attr("data-action")) ? $(obj).data("action") : obj["action"];
					if (!(formAction in IntentJSON.support))
						if (formAction in multiform) //initialize default container for form values
							IntentJSON.support[formAction] = []; //	array for multiple form actions
						else IntentJSON.support[formAction] = {}; //	object for single form action
					if (formAction in multiform)
						IntentJSON.support[formAction][i] = {};
					if (formAction.startsWith("action://")) {
						var tmp = formAction.split("://");
						if (formAction in multiform) { //initialize default container for form values
							if (typeof IntentJSON.command["action"] == "undefined")
								IntentJSON.command["action"] = [];
							IntentJSON.command["action"].push(tmp[1]);
						}
						else IntentJSON.command["action"] = tmp[1];

					}

					$(obj).find("input, textarea, select, checkbox").each(function (i2, input) { //get all form values
						if ($(input).attr("type") == "radio") {
							if ($(input).prop("checked")) //if tis radio button, only get checked ones
								if (!(formAction in multiform)) //single form with this action
									IntentJSON.support[formAction][$(input).attr("name")] = $(input).val();
								else IntentJSON.support[formAction][i][$(input).attr("name")] = $(input).val(); //multiple forms
							else console.log("form error");
						} else
							if (!(formAction in multiform)) //single form with this action
								IntentJSON.support[formAction][$(input).attr("name")] = $(input).val();
							else IntentJSON.support[formAction][i][$(input).attr("name")] = $(input).val(); //multiple forms

						console.log($(input).attr("name") + " is not of type radio but " + $(input).attr("type"));
					});

					if (!obj.checkValidity() || $(obj).data("valid") === false) {
						$(obj).find(':input:visible[required="required"]').each(function () {
							if (!this.validity.valid) {
								$(this).focus();
								console.log(this);
								throw new Error("Bad form");
								return false;
							}
						});
					}

					c++;
				});

				console.groupEnd();
			}
			
			/* Send .control Profile to Server - Add/Delete the space to enable
			///*** ///
			IntentJSON.support.target = profile(
				$(target).closest(".control")
			);
			IntentJSON.support.page_query = getUrlVars();
			///***///

			var intent_list = Object.keys(IntentJSON.command);
			var hasAction = false;
			var actionIndex = 0;
			var actionKey = "action";

			for (var i = 0, L = intent_list.length; i < L; i++) {
				if (intent_list[i].toLowerCase() == "action") {
					if (hasAction) { // If some derp put a different case of Action, action, ACTION, etc..
						Object.assign( // merge them to the first one found
							intent_list[actionIndex],
							intent_list[i]
						);
						delete IntentJSON.command[intent_list[i]];
					} else {
						actionIndex = i;
						actionKey = intent_list[i];
						hasAction = true;
					}
				}
			}
			if (hasAction) {
				for (const [key, value] of Object.entries(IntentJSON.support)) {
					if (key.startsWith("action://")) {
						var tmp = key.split("://");
						var event_name = tmp[1];

						if (Array.isArray(IntentJSON.support[key])) {
							console.log("Triggering multiple " + event_name + " events: ");
							for (const index in IntentJSON.support[key]) {
								var intentClone = JSON.parse(JSON.stringify(IntentJSON.support[key][index]));
								console.log(intentClone);
								$(target).trigger(
									event_name,
									intentClone
								);
							}
						}
						else {
							var intentClone = JSON.parse(JSON.stringify(IntentJSON.support[key]));
							console.log("Triggering " + event_name + " with: ", intentClone);
							$(target).trigger(
								event_name,
								intentClone
							);
						}
					}
				}
				if (Object.keys(IntentJSON.command).length == 1) {
					return true; // Do no AJAX if the intent was only an ACTION trigger
				} else {
					delete IntentJSON.command[actionKey]; // Do not send ACTION verbs to the server either way
				}
			}

			console.log('Calling Intent: ', IntentJSON.command);
			console.log('Supporting intent with data: ', IntentJSON.support);
			var ReqData = {
				json: JSON.stringify(IntentJSON)
			}; //Switch to JSON3 ?

			ApproachTotalRequestsAJAX++;
			
			$elf.target = target;
			//$(".LoadingContain").addClass("loading");
			console.groupEnd();

			$.ajax({
				url: api_url,
				type: api_method,
				data: ReqData,
				dataType: api_dataType,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				error: $elf.call.AjaxError,
				success: $elf.call.Ajax
			});
		},
		getInterface: function () {
			return $elf;
		},
		events: function (e) {
			e.stopPropagation();
			var CurrentControl = $(e.target).closest(".control");
			var fired = false,
				// classlist = e.target.className.split(/\s+/),
				role = CurrentControl.data("role"),
				action = CurrentControl.data("action"),
				data_trigger = CurrentControl.data("trigger"),
				
				IntentJSON = {};

			if (typeof CurrentControl.get(0) == "undefined") {
				IntentJSON.support = {};
				IntentJSON.command = {};
			} else {
				IntentJSON.support = typeof CurrentControl.get(0).dataset.context == "undefined" ? {} :
					JSON.parse(CurrentControl[0].dataset.context);
				IntentJSON.command = typeof CurrentControl.get(0).dataset.intent == "undefined" ? {} :
					JSON.parse(CurrentControl[0].dataset.intent);
			}

			if (
				(e.type == "click" && !data_trigger) ||
				(e.type == data_trigger)
			) {
				console.log(e.type + " event triggered by: ", CurrentControl);
				if (role == "trigger" && action != "") {

					console.log("Stepping aside for delegation of " + action + " event on:", CurrentControl);
					CurrentControl.trigger(action, IntentJSON);
					fired = true;
				} else if (!$.isEmptyObject(IntentJSON.command)) {
					fired = true;
					
					this.Service(e.target, IntentJSON);
				}
			}
		},
		Intent: function (IntentJSON, callback = Interface.call.Ajax, api = "https://service.example.com/MyService") {
			console.log('Calling Intent: ', IntentJSON.command);
			console.log('Supporting intent with data: ', IntentJSON.support);

			var ReqData = {
				json: JSON.stringify(IntentJSON)
			};
			$.ajax({
				url: api, //url of Utility.php
				type: "post",
				data: ReqData, //the json data
				dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				success: callback
			});
		}
	};
	//end $elf.call
	//end Interface Base

	$elf.call.init(Markup, user_init);
	return $elf;
};

