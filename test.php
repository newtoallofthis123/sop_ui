<?php
namespace ClimbUI;

use ClimbUI\Render\Header;
use ClimbUI\Render\ListEle;
use ClimbUI\Render\Pearl;
use ClimbUI\Render\Visual;

require_once __DIR__ . '/support/lib/vendor/autoload.php';
require_once __DIR__ . '/layout.php';
require_once __DIR__ . '/head.php';
global $body;

$someBtn = new Visual(title: 'button');
$list = new ListEle(visual: $someBtn);

$body[] = new Pearl(visual: 'This is a list', lists: [$list]);

$body[] = new Header(
    crumbs: ['Home', 'About', 'Contact'],
    content: 'This is a header'
);

echo $webpage->render();
