<?php
session_start();

error_reporting(E_ALL && ~E_WARNING && ~E_DEPRECATED);
require_once('php/functions.php');

createUser('admin','admin');
