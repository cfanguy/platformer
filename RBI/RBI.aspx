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
        <img id="lava" src="img/lava.png" alt="lava" style="display:none"/>
        <img id="lava_ball" src="img/lava_ball.png" alt="lava_ball" style="display:none"/>
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
        <div style="width:600px;margin-left:auto;margin-right:auto;">
            <canvas id="screen" width="600" height="400"></canvas>
        </div>
        <div style="position:absolute;top:125px;left:20px;">
            <a id="left" onmousedown="javascript:res.direction.left = true;" onmouseup="javascript:res.direction.left = false;"
                onmouseout="javascript:res.direction.left = false;" style="background-color:white;cursor:pointer;font-size:32px;color:black;height:50px;width:135px;">
                &nbsp;&nbsp;&lt;&lt; (A)&nbsp;&nbsp;
            </a>
            <br /><br /><br />
            <a id="right" onmousedown="javascript:res.direction.right = true;" onmouseup="javascript:res.direction.right = false;"
                onmouseout="javascript:res.direction.right = false;" style="background-color:white;cursor:pointer;font-size:32px;color:black;height:50px;width:135px;">
                &nbsp;&nbsp;(D) &gt;&gt;&nbsp;&nbsp;&nbsp;
            </a>
        </div>
        <div style="position:absolute;top:165px;right:20px;">
            <a id="jump" onmousedown="javascript:res.direction.up = true;" onmouseup="javascript:res.direction.up = false;"
                onmouseout="javascript:res.direction.up = false;" style="background-color:white;cursor:pointer;font-size:32px;color:black;height:50px;width:135px;">
                &nbsp;Jump (W)&nbsp;
            </a>
        </div>
        <div style="width:800px;margin-left:auto;margin-right:auto;">
            <div style="text-align: center;">
                <span style="font-size:30px;color:white;">Blocks:&nbsp;</span>
                <span style="font-size:30px;color:white;" id="blockNum"></span>
            </div>
            <div style="text-align:center;">
                <span style="font-size:30px;color:white;" id="scoreLevel">Level:&nbsp;</span>
                <span style="font-size:30px;color:white;" id="levelNum"></span>
            </div>
        </div>
        <div style="width:800px;margin-left:auto;margin-right:auto;margin-top:40px;">
            <div style="margin-bottom:50px;text-align:center">
                <input type="button" id="reset" onmousedown="javascript:resetLevel();" value="Reset Level"
                    style="background-color:white;cursor:pointer;font-size:30px;color:black;height:60px;"/>
            </div>

            <div style="width:800px;">
                <input id="fish" type="button" onmousedown="javascript:fishLevel();" value="Fish Level"
                    style="background-color:white;cursor:pointer;font-size:30px;color:black;float:left;height:60px;"/>
                <input id="cave" type="button" onmousedown="javascript:res.level=1;nextLevel();" value="Cave Levels"
                    style="background-color:white;cursor:pointer;font-size:30px;color:black;float:right;height:60px;"/>
                <br /><br /><br /><br /><br />
                <input id="lavaLvl" type="button" onmousedown="javascript:lavaLevel();" value="Lava Levels"
                    style="background-color:white;cursor:pointer;font-size:30px;color:black;float:right;height:60px;"/>
            </div>
        </div>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="scripts/game.min.js?v=1.5"></script>
    </div>
    </form>
</body>
</html>
