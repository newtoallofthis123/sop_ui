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


addScopeJS(["Approach", "Tabs"], {});
/// Example At End Of File

Approach.Tabs = function( config = {}) {
	let $elf = {};
	$elf.config = {
		controls: $(".tabs").first(),
		container: $()
	};
	overwriteDefaults(config, $elf.config);

	$elf.active = {
		control: $elf.config.controls,
		tab: $elf.config.container
	};
	$elf.controls = {};
	$elf.tabs = {};


	$elf.init = function() {
		console.groupCollapsed("Tabs init");
		console.log("init Tabs", $elf.config);

		// Get tab selector strings from each tab control, match with paired tab
		$( $elf.config.controls ).find("input[name='tab']").each((index, element) => {
			console.log( element );
			let tab_selector = $(element).attr("value");
			$elf.controls[ tab_selector ] = $(element);
			$elf.tabs[ tab_selector ] = $( $elf.config.container ).find( tab_selector );

			if ( !$elf.tabs[ tab_selector ].hasClass("active") ){
				$elf.tabs[ tab_selector ].hide();
			}
			else{
				$elf.active.control = tab_selector;
				$elf.tabs[ tab_selector ].show();
			}


			$(element).on("click",function(e){
				$elf.call.swap(tab_selector, e);
			});
		});
		console.groupEnd();
	};

	// Publicly Callable, User Re-assignable Functions
	$elf.call = {
		swap:function(tab_selector, e={} ){
			console.log("tab swap to: ", $elf.tabs[ tab_selector ]);
			$( $elf.controls[tab_selector] ).attr('checked', 'checked');
			$elf.tabs[ $elf.active.control ].hide();
			$elf.tabs[ tab_selector ].show();
			$elf.active.control = tab_selector;
		}
	};

	// Privileged functions - Exist outside of the constructed object's scope. Available to prototypes.
	let dispatch = {

	};

	$elf.init();
	return $elf;
};

/*

Tab Control Example:
<div class="myMenu">
	<label>
		<input type="radio" name="tab" value=".greatPost" />
		<span>First Tab</span>
	</label>
	<label>
		<input type="radio" name="tab" value=".anotherThing" />
		<span>Second Tab</span>
	</label>
</div>

Container Example:
<div class="myContent">
	<div class="greatPost"></div>
	<div class="anotherThing"></div>
</div>

Initialisation Example:
let TabHandler = new Tabs({
	controls: $(".myMenu"),
	container: $(".myContent")
})
*/

export let Tabs = Approach.Tabs;
