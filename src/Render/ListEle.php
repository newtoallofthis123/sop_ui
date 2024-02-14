<?php
namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Node;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Stringable;

class ListEle extends HTML{
    public function __construct(
        // Passing in Visual creates a sort of heirarchy that can be used to create a visual representation of the list
        public null|string|Stringable $visual = null,
    
        public null|bool $isControl = false,

        public null|string|Stringable $id = null,
        null|string|array|Node|Attribute $classes = null,
        public null|array|Attribute $attributes = new Attribute,
        public null|string|Stringable|Stream|self $content = null,
        public array $styles = [],
        public bool $prerender = false,
        public bool $selfContained = false,
    ){
        $ul = new HTML(tag: 'ul', classes: ['controls']);

        if($this->isControl){
            if($classes == null){
                $classes = [];
            }
            $classes = array_merge($classes, ['control']);
        }

        parent::__construct(
            tag: 'li',
            id: $id,
            classes: $classes,
            attributes: $attributes,
            styles: $styles,
            content: ($visual ? $visual : null) . $ul . $content,
            prerender: $prerender,
            selfContained: $selfContained
        );
    }
} 
