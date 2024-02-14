<?php
namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Node;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Stringable;

class Osyter extends HTML{
    public function __construct(
        // Again, passing in the lists and the visual creates a nodal heirarchy
        public null|string|Stringable $header = null,
        public null|array|Node $pearls = null,

        public null|string|Stringable $id = null,
        null|string|array|Node|Attribute $classes = null,
        public null|array|Attribute $attributes = new Attribute,
        public null|string|Stringable|Stream|self $content = null,
        public array $styles = [],
        public bool $prerender = false,
        public bool $selfContained = false,
    ){
        $ele = null;
        foreach($pearls as $pearl){
            $ele .= $pearl;
        }

        parent::__construct(
            tag: 'ul',
            id: $id,
            classes: $classes,
            attributes: $attributes,
            styles: $styles,
            content: $header . $ele . $content,
            prerender: $prerender,
            selfContained: $selfContained
        );
    }
} 
