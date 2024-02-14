<?php
namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Node;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Stringable;

class Visual extends HTML{
    public function __construct(
        public null|string|Stringable $title = null,
        public null|bool $isTodo = false,
        public null|string|Stringable $id = null,
        null|string|array|Node|Attribute $classes = null,
        public null|array|Attribute $attributes = new Attribute,
        public null|string|Stringable|Stream|self $content = null,
        public array $styles = [],
        public bool $prerender = false,
        public bool $selfContained = false,
    ){
        //add .visual class to the classes array
        //make sure classes is not null
        if($classes === null){
            $classes = [];
        }
        $classes = array_merge($classes, [' visual']);

        $icon = new HTML('i', classes: ['icon ', 'bi ', 'bi-list-check']);
        $label = new HTML('label', content: 'Procedures');
        $expand = new HTML('i', classes: ['expand ', 'fa ', 'fa-angle-right']);

        parent::__construct(
            tag: 'div',
            id: $id,
            classes: $classes,
            attributes: $attributes,
            content: $icon . $label . $expand . $content,
            styles: $styles,
            prerender: $prerender,
            selfContained: $selfContained
        );
    }
} 
