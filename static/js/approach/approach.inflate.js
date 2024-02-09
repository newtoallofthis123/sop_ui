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

addScopeJS(["Approach", "Inflate"], {});

Approach.Inflate = function( config = {} ) {
	let $elf = {};
	// default config
	$elf.config = {
		listen_target: document,
		toggle_effect:"slide",
		toggle_speed: 800,
		toggle_direction: "up"
	};

	$elf.selected_form = {};
	$elf.data = {};
	$elf.valid = true;

	overwriteDefaults(config, $elf.config);	// from approach.utility.js

	$elf.init = function() {
		console.log("Initializing Approach.Inflate..");
		$($elf.config.listen_target).on("inflate_this", function(e){
			let target = $(e.target).parent().children().not(e.target).not("swapHiding");
			$elf.call.pre_swap(e, target);
			dispatch.toggle(e, target);
			$elf.call.post_swap(e, target);
		});
		$($elf.config.listen_target).on("inflate_next", function(e){
			let target = $(e.target).next().get();
			$elf.call.pre_swap(e, target);
			dispatch.swap(e, target);
			$elf.call.post_swap(e, target);
		})
	};

	// Publicly Callable, User Re-assignable Functions
	$elf.call = { 
		pre_swap:function(e, target){},
		post_swap:function(){}
	};


	// Privileged functions - Exist outside of the constructed object's scope. Available to prototypes.
	let dispatch = {
		swap:function(e, target){
			let t = $(target);
			if ( t.is( ":hidden" ) )
			{
				t.slideDown( "fast" );
			}
			else
			{
				t.slideUp("fast");
			}
		},
		toggle:function(e, target){
			// Does not play nice with nested. Debugging just broke it more. Redesign this functionality.
			let t = $(target);
			if ( $(e.target).hasClass("deflate-toggle-active") || $(e.target).hasClass("deflate-toggle-tucked"))
			{
				t.slideDown( "fast" );
				if($(e.target).hasClass("deflate-toggle-tucked")){
					$(e.target).removeClass("deflate-toggle-tucked");
				}
				else {
					$(e.target).removeClass("deflate-toggle-active");
				}
			}
			else
			{
				t.slideUp("fast");
				$(e.target).addClass("deflate-toggle-active");
			}
		}
	};

	$elf.init();
	return $elf;
};

addScopeJS(["Approach", "DocReady"], {
	Inflate: Approach.Inflate
});

export let Inflate = Approach.Inflate;
