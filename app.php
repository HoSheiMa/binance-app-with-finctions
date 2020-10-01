<?php
header('Access-Control-Allow-Origin: *');
require './vendor/autoload.php';
$api = new Binance\API("3tCeYLtA6OA4fZges7JJiiR5LhCyzvJXPeB8l7DucvlPqmSl5ix7hqdKqFXTYpuu", "C9BzJJb8DNr9ZMd2lE9JDoy2Ox4eDlNi9zxxK1O4f4hOCfQgsQXUaM7BCvHp76qn");

require 'class/orders.php';
require 'class/admin.php';
require './config.php';

// $trades = $api->aggTrades("BTCUSDT");
// echo json_encode($trades);
// return;

$m = new Money($c);
$a = new admin($c);


if (!isset($_GET['q'])) return;



$q = $_GET['q'];



switch ($q) {
    case 'getAllOrders':
        if (!isset($_GET['name'])) return;
        $name = $_GET['name'];
        echo json_encode($m->getAllOrders($name));
        break;
    case 'cancelOrder':
        if (!isset($_GET['name'])) return;
        if (!isset($_GET['id'])) return;
        $name = $_GET['name'];
        $id = $_GET['id'];
        echo json_encode($m->cancelOrder($id, $name));
        break;
    case 'addNewOrder':
        if (!isset($_GET['type'])) return;
        $type = $_GET['type'];
        if (!isset($_GET['name'])) return;
        $name = $_GET['name'];
        if (!isset($_GET['price'])) return;
        $price = $_GET['price'];
        if (!isset($_GET['quantity'])) return;
        $quantity = $_GET['quantity'];
        if (!isset($_GET['type_'])) return;
        $type_ = $_GET['type_'];
        if (!isset($_GET['stopLimit'])) return;
        $stopLimit = $_GET['stopLimit'];
        $l = $m->addOrder($type, $name, $price, $quantity, $type_, $stopLimit);
        echo $l[0] ? '{ "success": true }' : $l[1];
        break;
    case 'getAllPrices':
        if (isset($_GET['name'])) {
            $name = $_GET['name'];
            echo $m->getPrices(
                $name
            );
            return;
        }
        echo $m->getPrices();

        break;

    case 'CheckTheMoneyStatus':
        if (!isset($_GET['name'])) return;
        $name = $_GET['name'];
        echo $m->CheckTheMoneyStatus(
            $name
        );
    case 'login':
        if (!isset($_GET['email'])) return;
        $email = $_GET['email'];
        if (!isset($_GET['pass'])) return;
        $pass = $_GET['pass'];
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        echo $a->Login($email, $pass, $key);
        return;
    case 'logout':
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        echo $a->LogOut($key);
        return;
    case 'islogin':
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        $l = $a->isLogIn($key);
        echo $l ? '{ "success": true }' : '{ "success": false }';
        return;
    case 'settingupload':
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        if (!isset($_GET['price'])) return;
        $price = $_GET['price'];
        if (!isset($_GET['StopLostPrice'])) return;
        $StopLostPrice = $_GET['StopLostPrice'];
        if (!isset($_GET['autoSelling'])) return;
        $autoSelling = $_GET['autoSelling'];
        $l = $a->settingupload($key, $price, $StopLostPrice, $autoSelling);
        echo $l ? '{ "success": true }' : '{ "success": false }';
        return;
    case 'getSetting':
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        echo $a->returnSetting($key);

    case 'changepass':
        if (!isset($_GET['cpass'])) return;
        $cpass = $_GET['cpass'];
        if (!isset($_GET['npass'])) return;
        $npass = $_GET['npass'];
        if (!isset($_GET['key'])) return;
        $key = $_GET['key'];
        $l = $a->ChangePassword($npass, $cpass, $key);
        echo $l ? '{ "success": true }' : '{ "success": false }';
        return;
    case 'balance':
        echo $m->balance();
}
