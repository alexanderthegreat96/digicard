<?php
use dthtoolkit;
require 'Boot.php';

Session::initSession();
$sessionParams = ['custom_params' =>  ['key' => 'value','key1' => 'value1','key2' => 'value2']];
Session::sendTheseToSession($sessionParams);
Debugger::var_dump(Requests::getArguments());