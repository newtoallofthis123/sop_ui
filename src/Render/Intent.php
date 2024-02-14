<?php
namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Approach\Render\Node;
use \Traversable;
use \Stringable;


trait IntentProperties{
	public null|array $intent = null;            // Intent Command { ClientAction : { Scope: ServerAction }
	public null|array $context = null;            // Intent Context: { anything you want to send to server action }
	public null|string|Stringable $api = null;    // URL of a Service endpoint
	public null|string|Stringable $method = null; // POST or GET usually, defaults to POST if not set
	public null|string|Stringable $role = null;   // optional role
	public null|string|Stringable $action = null; // optional custom js event to throw, defaults to click
	public null|string|Stringable $trigger = null; 
	
	public function RenderHead(): Traversable|\Approach\Render\Stream|string|\Stringable
	{
		if (is_array($this->intent)) {
			$this->attributes['data-intent'] = htmlentities( 
        json_encode($this->intent), 
        ENT_QUOTES, 
        'UTF-8', 
        false 
      );
		}
		if (is_array($this->context)) {
			$this->attributes['data-context'] = htmlentities(
        json_encode($this->context),
        ENT_QUOTES,
        'UTF-8',
        false
      );
		}
		if (NULL !== $this->api) {
			$this->attributes['data-api'] = $this->api;
		}
		if (NULL !== $this->method) {
			$this->attributes['data-method'] = $this->method;
		}
		if (NULL !== $this->role) {
			$this->attributes['data-role'] = $this->role;
		}
		if (NULL !== $this->action) {
			$this->attributes['data-action'] = $this->action;
		}
		if (NULL !== $this->trigger) {
			$this->attributes['data-trigger'] = $this->trigger;
		}
		// parent::RenderHead() is a Traversable
    // yield from parent::RenderHead();

		$doesContainControl = false;		
		foreach ($this->classes as $class){
			if ($class == 'control'){
				$doesContainControl = true;
				break;
			}
		}

		if (!$doesContainControl){
			$this->classes[] = new Node('control');
		}

    foreach (parent::RenderHead() as $value) {
      yield $value;
    }
	}
}
/**
 * Class UserProfile
 * 
 * This class represents a user profile and extends the Render class.
 */
/**
 * Represents an Intent class that extends the HTML class.
 * 
 * This class allows you to create an Intent object that can be used to handle
 * 
 * @package ClimbUI\Render
 * @version 1.0.0
 * @since 1.0.0
 * @see HTML
 * 
 * @property null|array $intent Intent Command { ClientAction : { Scope: ServerAction }
 * @property null|array $context Intent Context: { anything you want to send to server action }
 * @property null|string|Stringable $api URL of a Service endpoint
 * @property null|string|Stringable $method POST or GET usually, defaults to POST if not set
 * @property null|string|Stringable $role optional role
 * @property null|string|Stringable $trigger optional native js event that triggers the custom event to throw, eg mousemove, etc...
 * @property null|string|Stringable $action optional custom js event to throw, defaults to click
 * 
 * 
 */
class Intent extends HTML
{
	use IntentProperties;

  public function __construct(
      public null|string|Stringable $tag = NULL,
      public null|string|Stringable $id = null,
      null|string|array|Node|Attribute $classes = null,
      public null|array|Attribute $attributes = new Attribute,
      public null|string|Stringable|Stream|self $content = null,
      public array $styles = [],
      public bool $prerender = false,
      public bool $selfContained = false,

      null|array $context = null,            // Intent Context: { anything you want to send to server action }
      null|array $intent = null,            // Intent Command { ClientAction : { Scope: ServerAction }
      null|string|Stringable $api = null,    // URL of a Service endpoint
      null|string|Stringable $method = null, // POST or GET usually, defaults to POST if not set
      null|string|Stringable $role = null,    // optional role
      null|string|Stringable $trigger = null, // optional native js event that triggers the custom event to throw, eg mousemove, etc... 
      null|string|Stringable $action = null,  // optional custom js event to throw, defaults to click
  )
	{
		
		$this->intent = $intent ?? $this->intent ;
		$this->context = $context ?? $this->context ;
		$this->api = $api ?? $this->api ;
		$this->method = $method ?? $this->method ;
		$this->role = $role ?? $this->role ;
		$this->trigger = $trigger ?? $this->trigger ;
		$this->action = $action ?? $this->action ;
		
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
}
