<?php
error_reporting(0);
session_start();
require_once ("functions.php");

echo json_encode(generate_csrf_token());

