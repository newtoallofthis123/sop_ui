<?php

namespace Approach\Imprint\test\hellotoken;
use \Approach\Render as ProjectRender;
use \Approach\Render;

/**
* 	This class was generated by Approach\Imprint::Mint()
*	It can be used to create a new Render tree based on the original Pattern
*/

class hello extends Render\Node
{
	public array $tokens = [];
	public array $token_nodes = [];

	public function __construct(array $tokens = [])
	{
		$Node_0 = new Render\Node( );
			$Node_0[] = $document = new Render\HTML( );
				$document[] = $HTML_1 = new Render\HTML( );



		foreach($tokens as $key => $value)
		{
			if(isset($tokens[$key]))
				$this->tokens[$key]->content = $tokens[$key];
		}
	}
}
