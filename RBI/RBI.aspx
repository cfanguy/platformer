<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RBI.aspx.cs" Inherits="RBI.RBI" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>
        RBI
    </title>
</head>
<body style="background-color: black;">
    <form id="form1" runat="server">
    <div>
        <img id="player_r" src="img/player_r.png" alt="r_pl" style="display:none"/>
        <img id="player_l" src="img/player_l.png" alt="l_pl" style="display:none"/>
        <img id="player_dead" src="img/player_dead.png" alt="d_pl" style="display:none"/>
        <img id="diamond" src="img/diamond_end.png" alt="diamond" style="display:none"/>
        <img id="spike" src="img/spikes.png" alt="spike" style="display:none"/>
        <img id="snake_l" src="img/snake1.png" alt="snake" style="display: none"/>
        <img id="snake_r" src="img/snake1_r.png" alt="snake" style="display: none"/>
        <img id="fish_r" src="img/fish_r.png" alt="fish" style="display:none"/>
        <img id="fish_l" src="img/fish.png" alt="fish" style="display:none"/>
        <img id="block" src="img/block.jpg" alt="block" style="display:none"/>
        <img id="created" src="img/created.jpg" alt="created" style="display:none"/>
        <img id="next_level" src="img/next_level.png" alt="comp" style="display:none"/>
        <img id="complete" src="img/complete.png" alt="comp" style="display:none"/>
        <img id="gameOver" src="img/gameover.png" alt="go" style="display:none"/>  
        <img id="gameOverFish" src="img/gameover_fish.png" alt="go" style="display:none"/>
        <div id="canvasDiv" style="width:600px;margin-left:auto;margin-right:auto;">
            <canvas id="screen" width="600" height="400"></canvas>
            <div style="width:135px;margin-left:auto;margin-right:auto;">
                <span style="font-size:30px;color:white;">Blocks:&nbsp;</span>
                <span style="font-size:30px;color:white;" id="blockNum"></span>
                <br/>
                <span style="font-size:30px;color:white;" id="scoreLevel">Level:&nbsp;</span>
                <span style="font-size:30px;color:white;" id="levelNum"></span>
            </div>
        </div>
        <div style="width:600px;margin-left:auto;margin-right:auto;">
            <input id="left" type="button" onmousedown="javascript:res.direction.left = true;" onmouseup="javascript:res.direction.left = false;" style="background-color:white;cursor:pointer;font-size: 50px;float:left;color: black;" value="&lt;&lt;" />
            <input id="right" type="button" onmousedown="javascript:res.direction.right = true;" onmouseup="javascript:res.direction.right = false;" style="background-color:white;cursor:pointer;font-size: 50px;float:left;color: black;" value="&gt;&gt;" />
            <input id="jump" type="button" onmousedown="javascript:res.direction.up = true;" onmouseup="javascript:res.direction.up = false;" style="background-color:white;cursor:pointer;font-size: 50px;float:right;color: black;" value="Jump" />
        </div>

        <div style="width:600px;margin-left:auto;margin-right:auto;margin-top:120px;">
            <input id="cave" type="button" onmousedown="javascript:res.level=1;nextLevel();" value="Cave Levels" style="margin-left:10px;background-color:white;cursor:pointer;font-size: 30px;float:left;color: black;"/>
            <input id="fish" type="button" onmousedown="javascript:fishLevel();" value="Fish Level" style="margin-left:30px;background-color:white;cursor:pointer;font-size: 30px;float:left;color: black;"/>
            <input id="reset" type="button" onmousedown="javascript:reset();" value="Reset Level" style="margin-left:30px;background-color:white;cursor:pointer;font-size: 30px;float:left;color: black;"/>
        </div>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="scripts/game.js"></script>
    </div>
    </form>
</body>
</html>
