<?php
require './vendor/autoload.php';
include 'exchangeInfo.php';

class Money
{
    public $api = null;
    public $c = null;
    public $a = null; // price a
    public $b = null; // price b
    function __construct($Ec)
    {
        $this->api  = new Binance\API("3tCeYLtA6OA4fZges7JJiiR5LhCyzvJXPeB8l7DucvlPqmSl5ix7hqdKqFXTYpuu", "C9BzJJb8DNr9ZMd2lE9JDoy2Ox4eDlNi9zxxK1O4f4hOCfQgsQXUaM7BCvHp76qn");
        $this->c = $Ec;
        $this->a = (float) mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='Price'"))['value'];
        $this->b = (float) mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='StopLostPrice'"))['value'];
    }
    public function truncate_float($number, $places)
    {
        $power = pow(10, $places);
        if ($number > 0) {
            return floor($number * $power) / $power;
        } else {
            return ceil($number * $power) / $power;
        }
    }
    public function Selling()
    {
        global $info;

        $balances = json_decode($this->balance());
        foreach ($balances as $key => $value) {
            $key = $key . "USDT";

            $LOT_SIZE = null;
            $PRICE_FILTER = null;
            // for get the LOT_SIZE of coin 
            for ($z = 0; $z < sizeof($info->symbols); $z++) {
                if ($info->symbols[$z]->symbol == $key) {
                    $filters = $info->symbols[$z]->filters;
                    for ($j = 0; $j < sizeof($filters); $j++) {
                        if ($filters[$j]->filterType == "LOT_SIZE") {
                            $LOT_SIZE_position = strpos($filters[$j]->minQty, "1");
                            $LOT_SIZE = $LOT_SIZE_position - 1;
                        }
                        if ($filters[$j]->filterType == "PRICE_FILTER") {
                            $PRICE_FILTER_position = strpos($filters[$j]->minPrice, "1");
                            $PRICE_FILTER = $PRICE_FILTER_position - 1;
                        }
                    }
                }
            }
            $priceNow = $this->getPrices($key);
            //echo "$value" . truncate_float($value, $LOT_SIZE) . "<br />";
            $value = $this->truncate_float($value, $LOT_SIZE);
            $price = $this->truncate_float($priceNow * $this->a, $PRICE_FILTER);
            $StopLoss = $this->truncate_float($priceNow * $this->b, $PRICE_FILTER);

            $isAccept = $priceNow * $value; // should pass 10 doller
            if ($isAccept > 10) {
                echo "$key  ::: $value => $LOT_SIZE .... $price => $PRICE_FILTER ... $StopLoss => $PRICE_FILTER";
                $result = $this->addOrder("1", $key, $price, $value, null, $StopLoss);
                echo print_r($result);
                echo "1" . " ----- " . $key . " ----- " . $price . " ----- " . $value . " ----- " . null . " ----- " . $StopLoss;
            }
        }
    }
    public function balance()
    {
        $balance = array();
        $ticker = $this->api->prices(); // Make sure you have an updated ticker object for this to work
        $balances = $this->api->balances($ticker);

        foreach ($balances as $key => $value) {

            if ($value['available'] > 0) {
                $balance["$key"] = $value['available'];
                // echo "$key owned: " . $value['available'] . "<br />";
            }
        }
        return json_encode($balance);
    }
    public function CheckTheMoneyStatus($name)
    {

        $autoSelling = mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='autoSelling'"), true)['value'];
        if ($autoSelling == "false") return "off";
        try {
            //code...
            $this->Selling(); // for selling remains coins 
        } catch (\Throwable $th) {
            //throw $th;
        }
        $orders = $this->getAllOrders($name);
        foreach ($orders as $key => $value) {

            $id = $value['orderId'];
            $orderData = $this->getAllOrders($name, $id);
            // echo print_r($orderData);
            $priceOfCoinsNow = $this->api->price($name);
            $priceOfCoinsInOrder = $orderData['price'];
            $price_ = round($priceOfCoinsNow * $this->a, 3);
            $OrderLEss_ = round($priceOfCoinsNow * $this->b, 3);
            echo ($priceOfCoinsNow  . "=====" . $this->a . "=====" . $price_  . "=====" .  $priceOfCoinsInOrder);
            $HowMachTheCoinsPriceIncrease = ($price_ / $priceOfCoinsInOrder) * 100 - 100;
            if ($HowMachTheCoinsPriceIncrease > 0) {
                echo 'price now ' . $priceOfCoinsNow;
                echo '<br />';
                echo 'price in order  ' . $priceOfCoinsInOrder;
                echo '<br />';
                echo 'price after increase  ' . $price_;
                echo '<br />';
                echo "Increase  : " . $HowMachTheCoinsPriceIncrease . "%";

                // echo  $orderData['stopPrice'] == "0.00000000" ? '0' : '1' . "---" .
                //     $name . "---" .
                //     $price_ . "---" .
                //     $orderData['origQty'] . "---" .
                //     $orderData['side'] . "---" .
                //     $OrderLEss_;
                // echo '<br />';

                $this->cancelOrder($id, $name);
                $this->addOrder(
                    $orderData['stopPrice'] == "0.00000000" ? '0' : '1',
                    $name,
                    $price_,
                    $orderData['origQty'],
                    $orderData['side'],
                    $OrderLEss_
                );
            } else {
                echo '<br />';
                echo 'decease ' . $HowMachTheCoinsPriceIncrease .  '%';
                echo '<br />';
            }
        }
    }
    public function getAllOrders($name, $id = null)
    {
        $orders = $this->api->orders($name, 500, 0);
        $ShouldDelete = [];
        for ($i = 0; $i < sizeof($orders); $i++) {
            $value = $orders[$i];
            $key = $i;
            if ($value['status'] == "CANCELED" || $value['status'] == "FILLED") {
                array_splice($orders, $key, 1);
                $i = -1; // this $i++ will add one to it 
            }
        }
        foreach ($orders as $key => $value) {
            if ($id != null) {
                if ($value['orderId'] == $id) {
                    return $value;
                    break;
                }
                return;
            }
        }
        return ($orders);
    }
    public function cancelOrder($id, $name)
    {
        $response = $this->api->cancel($name, $id);
    }
    public function addOrder($type, $name, $price, $quantity, $type_, $stopLimit)
    {
        try {
            if ($type == "0") {
                // limit 
                if ($type_ == "BUY") {
                    $order = $this->api->buy($name, $quantity, $price);
                } else {
                    $order = $this->api->sell($name, $quantity, $price);
                }
            } else {
                $order = $this->api->sell($name, $quantity, $price, "STOP_LOSS_LIMIT", ["stopPrice" => $stopLimit]);
            }
            return [true];
        } catch (Exception  $e) {
            //throw $th;
            $message = str_replace("signedRequest error:", "", $e->getMessage());
            $respond = json_encode(array("res" => json_decode($message),  "success" => false));
            return [false, $respond];
        }
    }
    public function getPrices($name = null)
    {
        if ($name != null) {
            $price = $this->api->price($name);
            return $price;
        }
        $ticker = $this->api->prices();
        return (json_encode($ticker));
    }
}
