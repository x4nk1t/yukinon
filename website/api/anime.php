<?php
if(isset($_GET['pass'])){
    if($_GET['pass'] == "mys3cr3tk3y"){
        if(isset($_GET['username'])){
            $username = strtolower($_GET['username']);
            $file = __DIR__ .'/anime/'. $username.'.txt';
            if($username == "yukinon" || $username == "baccano"){
                create_file_if_not_exist($username, $file);
                $json_data = file_get_contents('php://input');
            
                if(isset($_GET['get'])){
                    $content = file_get_contents($file);
                    echo $content;
                } else if($json_data != "" || $json_data != null){
                    file_put_contents($file, $json_data);
                    echo jsonFormat(0, 'ok');
                } else {
                    echo jsonFormat(1, 'Not good argument');
                }
            } else {
                echo jsonFormat(1, 'Wrong username');
            }
        } else {
            echo jsonFormat(1, 'Username not found');
        }
    } else {
         echo jsonFormat(1, 'Wrong password');
    }
} else {
    echo jsonFormat(1, 'Dead');
}

function jsonFormat($status, $message){
    return json_encode(['status' => $status, 'message' => $message]);
}

function create_file_if_not_exist($username, $filePath){
    if(!file_exists($filePath)){
        $file = fopen($filePath, 'w');
        fclose($file);
    }
}
?>