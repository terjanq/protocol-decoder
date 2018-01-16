<?php
    function newest($a, $b){ return filemtime($b) - filemtime($a); }

    $dir = glob('Captures/*'); uasort($dir, "newest");
    $captures = "";
    foreach($dir as $file){ $captures .= '<li><a href=#>'. basename($file).'</a></li>'; }

?>
<html>

<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<script src="./jquery.selection.js"></script>
<link rel="stylesheet" href="analyse.css">

</head>


<body>
<div class="packets">
    <ul>
    </ul>
</div>


<div class="packetInfo">
    <div class="subinfo Int32">
        <h3>Int32</h3>
        <p></p>
    </div>
    <div class="subinfo Float64">
        <h3>Float64</h3>
        <p></p>
    </div>
    <div class="subinfo Int16">
        <h3>Int16</h3>
        <p></p>
    </div>

    <div style="width:370px;margin-right:10px;float:left; display:block">
        <div class="subinfo UTF8">
            <h3>UTF8</h3>
            <p></p>
        </div>
        <div style="display:none" class="subinfo colors">
            <h3> Colors </h3>
            <p></p>
        </div>
    </div>
    <div class="subinfo Uint32">
        <h3>Uint32</h3>
        <p></p>
    </div>




</div>


<div class = "captures">
<ul><?=$captures?></ul>
</div>


<p class="tooltip">13</p>




<script src="analyse.js"></script>
<body>


</html>