<?php
if(isset($_GET['pass'])){
    $pass = $_GET['pass'];
    if($pass == "mys3cr3tk3y"){
        $json_data = file_get_contents('php://input');
                
        if(isset($_GET['get'])){
            $content = file_get_contents('lastSync.txt');
            echo $content;
            return;
        } else if($json_data != "" || $json_data != null){
            file_put_contents('lastSync.txt', $json_data);
            echo 'ok';
        } else {
            echo 'notok';
        }
    } else {
        echo 'notok';
    }
} else {
    echo 'notok';
}
?>