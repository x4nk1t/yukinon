<?php
if(isset($_GET['pass'])){
    if($_GET['pass'] == "mys3cr3tk3y"){
        create_file_if_not_exist();
        $json_data = file_get_contents('php://input');
                
        if(isset($_GET['get'])){
            $content = file_get_contents('lastSync.txt');
            echo $content;
        } else if($json_data != "" || $json_data != null){
            file_put_contents('lastSync.txt', $json_data);
            echo jsonFormat(0, 'ok');
        } else {
            echo jsonFormat(1, 'Not good argument');
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

function create_file_if_not_exist(){
    if(!file_exists('lastSync.txt')){
        $file = fopen('lastSync.txt', 'w');
        fclose($file);
    }
}
?>