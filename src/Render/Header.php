<?php
namespace ClimbUI\Render;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use \Approach\Render\HTML;
use \Approach\Render\Node;
use \Approach\Render\Stream;
use \Approach\Render\Attribute;
use \Stringable;

class Header extends HTML{
    public function __construct(
        public null|array $crumbs = null,
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
        $classes = array_merge($classes, [' header']);

        $headerSection = new HTML(tag: 'section', classes: ['header']);

        $headerSection[] = $backBtn = new HTML(tag: 'button', classes: ['backBtn']);

        $backBtn[] = new HTML(tag: 'i', classes: ['expand ', 'fa ', 'fa-angle-left']);
        $headerSection[] = $menuBtn = new HTML(tag: 'button', classes: ['btn ', 'btn-secondary ', 'current-state ', 'ms-2 ', 'animate__animated ', 'animate__slideInDown'], attributes: ['id' => 'menuButton']);

        $menuBtn[] = new HTML(tag: 'span', attributes: ['id' => 'menuButtonText'], content: 'Location');
        $menuBtn[] = new HTML(tag: 'i', classes: ['fa ', 'fa-caret-down']);

        $headerSection[] = new HTML(tag: 'ul', classes: ['breadcrumbs'], attributes: ['style' => 'display: none']);

        //foreach($crumbs as $crumb){
        //    $headerSection[] = new HTML(tag: 'li', content: $crumb);
        //}

        $toolBar = new HTML(tag: 'ul', classes: ['Toolbar']);
        $signoutContent = <<<HTML
        <button>
            <p>
                <i class="bi bi-box-arrow-right"></i> SignOut
            </p>
        </button>
        HTML;
        $toolBar[] = $menuBtn;
        $toolBar[] = new HTML(tag: 'div', classes: ['signOut'], content: $signoutContent);
        
        parent::__construct(
            tag: 'section',
            id: $id,
            classes: $classes,
            attributes: $attributes,
            content: $toolBar . $content,
            styles: $styles,
            prerender: $prerender,
            selfContained: $selfContained
        );
    }
} 
