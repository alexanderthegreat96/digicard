<?php
session_start();
require_once (__DIR__."/../php/functions.php");

echo json_encode(get_app_settings());