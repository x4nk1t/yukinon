<?php
if(isset($_GET['pass'])){
    if($_GET['pass'] == "mys3cr3tk3y"){
        create_file_if_not_exist();
        $content = file_get_contents('AnimeReleaseChannels.txt');
        if(isset($_GET['getAnimeReleaseChannels'])){
            echo $content;
        } else if(isset($_GET['addAnimeReleaseChannel'])){
            $channelId = $_GET['addAnimeReleaseChannel'];
            
            $channels = json_decode($content);
            if($channels == null){
                $channels = [];
            }
            if(!in_array($channelId, $channels)){
                $channels[] = $channelId;
                file_put_contents('AnimeReleaseChannels.txt', json_encode($channels));
                echo jsonFormat(0, 'ok');
            } else {
                echo jsonFormat(1, 'This channel is already added.');
            }
        } elseif (isset($_GET['removeAnimeReleaseChannel'])){
            $channelId = $_GET['removeAnimeReleaseChannel'];
            
            $channels = json_decode($content);
            if($channels == null){
                $channels = [];
            }
            if(in_array($channelId, $channels)){
                $key = array_search($channelId, $channels);
                
                unset($channels[$key]);
                
                file_put_contents('AnimeReleaseChannels.txt', json_encode($channels));
                echo jsonFormat(0, 'ok');
                
            } else {
                echo jsonFormat(1, 'This channel is not found.');
            }
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
    if(!file_exists('AnimeReleaseChannels.txt')){
        $file = fopen('AnimeReleaseChannels.txt', 'w');
        fclose($file);
    }
}
?>