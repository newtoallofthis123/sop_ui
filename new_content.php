<?php

/* 
 * This is the main content that is rendered on the screen
 *
 * TODO: Split this into smaller components and use Render or Imprint Layer
 *
 */

namespace ClimbUI;

global $body, $menu;
require_once __DIR__ . '/support/lib/vendor/autoload.php';

require_once __DIR__ . '/layout.php';
require_once __DIR__ . '/head.php';
require_once __DIR__ . '/menu.php';

$body[] = $menu;
