<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

# Instantiate the client.
$mgClient = new Mailgun('key-876128f00dd3b8f6b1342a0e2f4a3559');
$domain = "sandbox4d406773781c40679713598e873fc6f2.mailgun.org";

# Make the call to the client.
$result = $mgClient->sendMessage("$domain",
                  array('from'    => 'Mailgun Sandbox <postmaster@sandbox4d406773781c40679713598e873fc6f2.mailgun.org>',
                        'to'      => 'Kevin Miguta <migutak@gmail.com>',
                        'subject' => 'Hello Kevin Miguta',
                        'text'    => 'Congratulations MarginIQ, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.'));
    
/*$rslt = $mgClient->get("$domain/log", array('limit' => 25, 
                                        'skip'  => 0));

$httpResponseCode = $rslt->http_response_code;
$httpResponseBody = $rslt->http_response_body;

# Iterate through the results and echo the message IDs.
$logItems = $rslt->http_response_body->items;
foreach($logItems as $logItem){
    echo $logItem->message_id . "\n";
}*/

if(!$result->http_response_body) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $result->ErrorInfo;
} else {
    echo 'Message has been sent';
}
?>