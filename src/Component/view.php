<?php

namespace ClimbUI\Component;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use Approach\Render\HTML;

// Function that returns the information of a climb
function getTabsInfo(array $json)
{
    $data = $json['Sop'];

    $main = new HTML(tag: 'div', classes: ['p-3 ', 'container']);

    $main[] = $titleRow = new HTML(tag: 'div', classes: ['d-flex ', 'justify-content-between ', 'align-items-center']);

    $titleRow[] = new HTML(tag: 'h1', classes: ['fs-3 ', 'fw-bold'], content: $data['title']);
    $titleRow[] = new HTML(tag: 'button', classes: ['btn ', ' btn-success'], content: 'Mark Complete');

    $main[] = new HTML(tag: 'div', classes: ['d-flex ', 'justify-content-between ', 'align-items-center ', 'pt-2'], content: $data['description']);
    
    $main[] = new HTML(tag: 'h4', classes: ['pt-3 ', 'fs-5'], content: 'Comments');
    $main[] = new HTML(tag: 'div', classes: ['d-flex ', 'justify-content-between ', 'align-items-center ', 'pt-1'], content: $data['comments']);

    return $main;
}
