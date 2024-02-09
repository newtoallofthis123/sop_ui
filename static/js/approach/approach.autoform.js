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

// TO DO: Merge the part of approach.interface.js that is similar into here and use this module instead
// Requires updating interface library to a proper module

addScopeJS(["Approach", "Autoform"], {});
Approach.Autoform = function( config = {} ) {
	let $elf = {};
	// default config
	$elf.config = {
		form: null
	};

	$elf.selected_form = {};
	$elf.data = {};
	$elf.valid = true;

	overwriteDefaults(config, $elf.config);

	$elf.init = function() {
		if($elf.config.form !== null)
		{
			$elf.selected_form = $elf.config.form;
		}
		else
		{
			$elf.selected_form = document.createElement("form");
		}
		$elf.call.swap( $elf.selected_form );
	};

	// Publicly Callable, User Re-assignable Functions
	$elf.call = {
		swap: function(swap_form=null){
			if(swap_form != null)
			{
				$elf.data = {};
				$elf.valid = true;
				$elf.selected_form = swap_form;
			}
			// let obj = $elf.selected_form;

			let formAction = "";
			if( $($elf.selected_form).attr("action") )
			{
				formAction = $elf.selected_form["action"];
			}
			if( $($elf.selected_form).attr("data-action") )
			{
				formAction = $($elf.selected_form).data("action");
			}

			$($elf.selected_form).find("input, textarea, select, checkbox").each(function(i2, input) { 				//get all form values
				let key = $(input).attr("name");
				let type = $(input).attr("type");
				if ( type == "radio")
				{
					if ($(input).is(":checked"))
					{
						$elf.data[ key ] = $(input).val();
					}													//if tis radio button, only get checked ones
					else
					{
						$elf.data[ key ] = null;														// radio not selected
						console.log("form radio input: "+key+" had no selected value");
					}
				}
				else if ( type == "checkbox")
				{
					if( typeof $elf.data[ key ] === "undefined" )
					{
						$elf.data[ key ] = [];
					}
					if ($(input).is(":checked"))
					{
						$elf.data[ key ].push( $(input).val() );
					}
				}
				else
				{
					$elf.data[ key ] = $(input).val();
				}
			});

			if(!$elf.selected_form.checkValidity() || $($elf.selected_form).data("valid") === false)
			{
				$($elf.selected_form).find(':input:visible[required="required"]').each(function()
				{
					if(!this.validity.valid)
					{
						$(this).focus();
						console.log("Form control does not look valid: ", this);
						$( this ).trigger( "Autform.Invalid" );
						$elf.valid = false;
					}
				});
			}
			return $elf.data;
		}
	};


	// Privileged functions - Exist outside of the constructed object's scope. Available to prototypes.
	let dispatch = {};

	$elf.init();
	return $elf;
};

export let Autoform = Approach.Autoform;
