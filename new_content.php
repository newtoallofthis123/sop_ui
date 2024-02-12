<?php

/* 
 * This is the main content that is rendered on the screen
 *
 * TODO: Split this into smaller components and use Render or Imprint Layer
 *
 */

namespace ClimbUI;

use Approach\Render\HTML;

global $body, $menu;
require_once __DIR__ . '/support/lib/vendor/autoload.php';

require_once __DIR__ . '/layout.php';
require_once __DIR__ . '/head.php';
require_once __DIR__ . '/menu.php';

$body[] = $menu;
$body[] = $content = new HTML(tag: 'div', classes: ['ViewPort']);
$content[] = $someContent = new HTML(tag: 'div', classes: ['some_content']);
$someContent[] = new HTML(tag: 'div');
