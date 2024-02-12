<?php

/*
 * Entry point for the ClimbUI application
 * 
*/

namespace ClimbUI;

global $webpage;
require_once __DIR__ . '/support/lib/vendor/autoload.php';

require_once __DIR__ . '/layout.php';
require_once __DIR__ . '/head.php';
require_once __DIR__ . '/content.php';

echo $webpage->render();
