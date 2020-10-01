<?php
class admin
{
    public $c = null;
    function __construct($Ec)
    {
        $this->c = $Ec;
    }
    public function isLogIn($key)
    {
        $q = "SELECT * FROM `logincookessession` WHERE `loginkey`='" . $key . "'";
        $r = mysqli_query($this->c, $q);
        $d = mysqli_fetch_array($r, true);
        if ($r->num_rows  > 0) {
            return true;
        }
        return false;
    }
    public function ChangePassword($newPassword, $currectpassword, $key)
    {
        if ($this->isLogIn($key)) {
            $id  = $this->id($key);
            $q = "SELECT * FROM `admin` WHERE `id`='$id' and `pass`='$currectpassword'";
            $r = mysqli_query($this->c, $q);
            // $d = mysqli_fetch_array($r, true);
            if ($r->num_rows  > 0) {
                $q = "UPDATE `admin` SET `pass`='$newPassword' WHERE `id`='$id'";
                mysqli_query($this->c, $q);
                return true;
            }
        }
        return false;
    }
    public function Login($email, $pass, $key)
    {
        $q = "SELECT * FROM `admin` WHERE `email`='" . $email . "' and `pass`='" . $pass . "'";
        $r = mysqli_query($this->c, $q);
        $d = mysqli_fetch_array($r, true);
        if ($r->num_rows  > 0) {
            // success
            $id = $d['id'];
            // delete the old
            mysqli_query($this->c, "DELETE FROM `logincookessession` WHERE `userId`='$id'");

            $q = "INSERT INTO `logincookessession`( `userId`, `loginkey`) VALUES ('$id','$key')";
            mysqli_query($this->c, $q);
            return '{ "success": true }';
        }
        return '{ "success": false }';
    }
    public function LogOut($key)
    {
        $q = "DELETE FROM `logincookessession` WHERE `loginkey`='" . $key . "'";
        mysqli_query($this->c, $q);
    }
    public function id($key)
    {
        if ($key) {
            $q = "SELECT * FROM `logincookessession` WHERE `loginkey`='$key'";
            $r = mysqli_query($this->c, $q);
            return $id = mysqli_fetch_array($r, true)['userId'];
        }
    }
    public function settingupload($key, $price, $StopLostPrice, $autoSelling)
    {
        mysqli_query($this->c, "UPDATE `setting` SET`value`='$price' WHERE `name`='Price'");
        mysqli_query($this->c, "UPDATE `setting` SET`value`='$StopLostPrice' WHERE `name`='StopLostPrice'");
        mysqli_query($this->c, "UPDATE `setting` SET`value`='$autoSelling' WHERE `name`='autoSelling'");

        return true;
    }
    public function returnSetting($key)
    {
        $price = mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='Price'"), true)['value'];
        $StopLostPrice = mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='StopLostPrice'"), true)['value'];
        $autoSelling = mysqli_fetch_array(mysqli_query($this->c, "SELECT * FROM `setting` WHERE `name`='autoSelling'"), true)['value'];

        return json_encode(
            array(
                "price" => $price,
                "StopLostPrice" => $StopLostPrice,
                "autoSelling" => $autoSelling
            )
        );
    }
}
