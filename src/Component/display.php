<?php

namespace ClimbUI\Component;

require_once __DIR__ . '/../../support/lib/vendor/autoload.php';

use Approach\Render\HTML;

function displayAlbums(array $json){
    $data = $json['Albums'];

    $main = new HTML(tag: 'div', classes: ['container ', 'text-center ', 'mt-5']);
    $main[] = $row = new HTML(tag: 'div', classes: ['row ', ' row-cols-3']);

    foreach($data as $album){
        $row[] = $col = new HTML(tag: 'div', classes: ['col ', 'mb-4']);
        $col[] = new HTML(tag: 'div', classes: ['card']);
        $col[] = new HTML(tag: 'img', classes: ['card-img-top ', 'rounded'], attributes: ['src' => $album['Image']]);
        $col[] = new HTML(tag: 'div', classes: ['card-body']);
        $col[] = new HTML(tag: 'h5', classes: ['card-title'], content: $album['Title']);
        $col[] = new HTML(tag: 'p', classes: ['card-text'], content: $album['Description']);
    }

    return $main;
}
