<?php

/* 
 * A wrapper around the HTML node class to help create intent elements
 *
 * Usually, an intent is a node that has some data attributes that are used to
 * communicate with the server. This class is a wrapper around the HTML node
 *
 * Usage:
 *
 * $intent = new Intent(
 *  tag: 'button',
 *  id: 'myButton',
 *  classes: ['btn', 'btn-primary'],
 *  command: ['click' => 'doSomething'],
 *  context: ['id' => 123],
 *  api: '/api/v1/some-endpoint',
 *  method: 'POST',
 *  content: 'Click me'
 *  );
 * */

namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Approach\Render\Node;
use \Traversable;
use \Stringable;

/**
 * Class UserProfile
 * 
 * This class represents a user profile and extends the Render class.
 */
class Intent extends HTML
{
	 public function __construct(
        public null|string|Stringable $tag = NULL,
        public null|string|Stringable $id = null,
	    	null|string|array|Node|Attribute $classes = null,
        public null|array|Attribute $attributes = new Attribute,
        public null|string|Stringable|Stream|self $content = null,
        public array $styles = [],
        public bool $prerender = false,
        public bool $selfContained = false,

        public null|array $command = null,            // Intent Command { ClientAction : { Scope: ServerAction }
        public null|string $context = null,            // Intent Context: { anything you want to send to server action }
        public null|string|Stringable $api = null,    // URL of a Service endpoint
        public null|string|Stringable $method = null, // POST or GET usually, defaults to POST if not set
        public null|string|Stringable $role = null, // optional role
        public null|string|Stringable $action = null,   // optional custom js event to throw, defaults to click
        public null|string|Stringable $trigger = null,  // optional native js event that triggers the custom event to throw, eg mousemove, etc... 
    )
	{
    parent::__construct(
      tag: $this->tag, 
      id: $this->id, 
      attributes: $this->attributes, 
      content: $this->content, 
      styles: $this->styles, 
      prerender: $this->prerender, 
      selfContained: $this->selfContained
    );
	}

/**
  Apply the intent attributes to this node right before rendering the opening tag
*/
  public function RenderHead() : Traversable {
    if(is_array($this->command)){
      $this->attributes['data-command'] = json_encode($this->command);
    }
    if(is_array($this->context)){
      $this->attributes['data-context'] = $this->command;
    }
    if(NULL !== $this->api){
      $this->attributes['data-api'] = $this->api;
    }
    if(NULL !== $this->method){
      $this->attributes['data-method'] = $this->method;
    }
    if(NULL !== $this->role){
      $this->attributes['data-role'] = $this->role;
    }
    if(NULL !== $this->action){
      $this->attributes['data-action'] = $this->action;
    }
    if(NULL !== $this->trigger){
      $this->attributes['data-trigger'] = $this->trigger;
    }
    yield parent::RenderHead();
  }
}
