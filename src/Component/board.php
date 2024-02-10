<?php

namespace ClimbUI\Component;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use Approach\Render\HTML;

function displayBoards(array $json){
    $data = $json['Board'];

    $main = new HTML(tag: 'div', classes: ['container ', 'text-center ', 'mt-5']);
    $main[] = $row = new HTML(tag: 'div', classes: ['row ', ' row-cols-3']);

    foreach($data as $board){
        $row[] = $col = new HTML(tag: 'div', classes: ['col ', 'mb-4 ', 'shadow-sm ', 'mx-2 ', 'py-4']);
        $col[] = new HTML(tag: 'h5', classes: ['fw-bold'], content: $board['Title']);
    }

    return $main;
}
