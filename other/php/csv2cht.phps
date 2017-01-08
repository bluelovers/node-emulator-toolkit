<?php
    /*
     * PHP csv2cht encoder
     * Copyright (C) 2005 emuWorks
     * by John David Ratliff
     * Licensed under the GNU GPL
     * See http://www.gnu.org for more information
     */
     
    /*
     * Revision History
     *   1.1  - Fixed bug in cht_encode routine
     *          Changed name padding from spaces to NUL characters
     *   1.0  - Initial Public Release
     */    

    // the following two lines are not necessary if posting this
    // script to another site. They are solely to frame the page within
    // emuWorks layout
    $page_title = "CSV 2 CHT Converter";
    include ("../includes/header.inc");
    
    function cht_encode($code, $name) {
        $dec = hexdec($code);
        
        $cht = "";
        $cht .= chr(0);
        $cht .= chr($dec & 0xFF);
        $cht .= chr(($dec >> 8) & 0xFF);
        $cht .= chr(($dec >> 16) & 0xFF);
        $cht .= chr(($dec >> 24) & 0xFF);
        $cht .= chr(0);
        $cht .= chr(254);
        $cht .= chr(252);
        $cht .= $name;
        $cht .= chr(0);
        $cht .= chr(0);
                                                
        return $cht;
    }
?>

<h2>
    CSV 2 CHT Converter<br>
    Copyright &copy; 2005 emuWorks
</h2>

<h3><a href="index.phps" target="_blank">Click here for the Source Code</a></h3>

<?php
    $action = $_POST['action'];
    
    if ($action == "encode") {
        $codes = $_POST['codes'];
        
        $codes = preg_split("/\n/", $codes);
        $count = count($codes);
        
        $dark = true;
        
        $txtdir = "/chtdecoder/php/txt/";
        $wwwpath = $_SERVER['DOCUMENT_ROOT'] . $txtdir;
        $filename = tempnam($wwwpath, "cht") . ".cht";
        
        preg_match("/\/([A-Za-z0-9]*)\.cht\$/", $filename, $matches);
        $chtpath = $txtdir . $matches[1] . ".cht";
        
        $fd = fopen($filename, "wb");
?>
<table border="1">
    <tr>
        <td bgcolor="#0000FF" align="center">
            <font color="#FFFFFF" size="+1"><b>Name</b></font>
        </td>
        
        <td bgcolor="#0000FF" align="center">
            <font color="#FFFFFF" size="+1"><b>Code</b></font>
        </td>
    </tr>
<?php
        for ($i = 0; $i < $count; $i++) {
            if (preg_match("/([A-Fa-f0-9]{1,6}),([A-Fa-f0-9]{1,2}),(.{1,18})/", $codes[$i], $match)) {
                $code = str_pad($match[1], 6, "0", STR_PAD_LEFT) . str_pad($match[2], 2, "0", STR_PAD_LEFT);
                $name = str_pad($match[3], 18, chr(0));
                
                $chtdata = cht_encode($code, $name);
                fwrite($fd, $chtdata);
                
                if ($dark) {
                    $bgcolor = "#CDCDCD";
                } else {
                    $bgcolor = "#DEDEDE";
                }
                
                $dark = !$dark;
?>

    <tr>
        <td bgcolor="<?= $bgcolor; ?>">
            &nbsp;&nbsp;&nbsp;
            <?= $name; ?>
            &nbsp;&nbsp;&nbsp;
        </td>
        
        <td bgcolor="<?= $bgcolor; ?>">
            &nbsp;&nbsp;&nbsp;
            <font face="Courier New"><?= $code; ?></font>
            &nbsp;&nbsp;&nbsp;
        </td>
    </tr>
<?php
            }
        }
        
        fclose($fd);
?>

    <tr>
        <td colspan="2">
            &nbsp;<a href="<?= $chtpath; ?>">Download .CHT File</a>
        </td>
    </tr>
</table>
<?php
    }
?>

<form method="post" action="index.php">
    <input type="hidden" name="action" value="encode">

    <p>
        Enter your CSV codes below.<br>
        One per line in the form AAAAAA,VV,NNNNNNNNNNNNNNNNNN.<br>
        A = the address (6 characters max).<br>
        V = the value (2 characters max)<br>
        N is the name (18 characters max).<br>
        A and V must be in hex.<br>
        Example: 7E1D2C,07,Gau Rage Pack 1/32
    </p>
    
    <p>
        <textarea rows="10" cols="50" name="codes"></textarea>
    </p>
    
    <p>
        <input type="submit" value="Convert to CHT">
        <input type="reset" value="Clear">
    </p>
</form>

<?php
    // this include is not necessary if this script is used on another
    // website. It is solely to frame the page within emuWorks layout.
    include ("../includes/footer.inc");
?>
