<?php


namespace Tests\Acceptance;

use Tests\Support\AcceptanceTester;

class ServerCest
{
    public function checkService(AcceptanceTester $I)
    {
        $I->amOnPage('/');
        $I->tryToSendAjaxPostRequest('/service', ['json' => 'json="{\"support\":{\"_response_target\":\"#some_content\"},\"command\":{\"REFRESH\":{\"Climb\":\"New\"}}}"']);
    }
}
