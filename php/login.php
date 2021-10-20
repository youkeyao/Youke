<?php

if (!isset($_POST["user"]) || !isset($_POST["psw"])) {
    echo "<script> alert('Account or password is wrong!'); history.back(); </script>";
}
else {
    $db = new SQLite3('accounts.db');
    $sql = 'SELECT user FROM accounts WHERE user == "' .  $_POST["user"] . '" and psw == "' . $_POST["psw"] . '"';
    $result = $db->query($sql);
    if ($result->fetchArray()) {
        header('Location: ../icloud.html');
    }
    else {
        echo "<script> alert('Account or password is wrong!'); history.back(); </script>";
    }
}

?>