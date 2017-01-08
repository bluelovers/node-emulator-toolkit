################################################################################
# Perl CHTDecoder 1.0
# Copyright (C) 2004 emuWorks (http://games.technoplaza.net)
# by John David Ratliff
#

if ($#ARGV == -1) {
    die qq|syntax: perl chtdecoder.pl cht_file[, cht_file2, ...]\n|;
}

foreach $arg (@ARGV) {
    if (is_valid_cht_file($arg)) {
        decode_cht_file($arg);
    } else {
        print "error: ${arg} does not seem to be a valid .CHT file.\n";
    }
}

################################################################################
# checks for a valid .CHT file
#

sub is_valid_cht_file($) {
    my ($chtfile) = @_;
    my (@stats);

    # it must be a regular file
    if (! -f $chtfile) {
        return 0;
    }
    
    # it must end in .cht
    if (($chtfile =~ m/\.cht$/i) == 0) {
        return 0;
    }
    
    # filesize must be a multiple of 28 (the record size)
    @stats = stat($chtfile);
    
    if (($stats[7] % 28) != 0) {
#        return 0;
    }
    
    # if we're here, it is likely a pretty good candidate
    return 1;
}

################################################################################
# decodes a cht record into the name, address, and active pieces
#

sub decode_cht_data($) {
    my ($chtdata, @data, $pos) = @_;
    my ($active, $address, $value, $code, $name);
    
    @data = split(//, $chtdata);
    
    # parse the active bit (0 = active, 4 = inactive)
    if (ord($data[0]) == 0) {
        $active = 1;
    } else {
        $active = 0;
    }

    # parse the code (address + value)
    $address = 0;

    for ($pos = 4; $pos > 1; $pos--) {
        $address <<= 8;
        $address |= (ord($data[$pos]) & 0xFF);
    }

    $value = ord($data[1]) & 0xFF;
    $code = sprintf("%06X:%02X", $address, $value);

    # parse the name
    $name = "";

    for ($pos = 8; $pos < 26; $pos++) {
        if (ord($data[$pos]) == 0) {
            last;
        }

        $name .= $data[$pos];
    }

    return ($name, $code, $active);
}

################################################################################
# decodes the cht file to a txt file
#

sub decode_cht_file($) {
    my ($chtfile) = @_;
    my ($txtfile, @stats, $codes, $count);
    my ($chtdata, $cht_name, $cht_code, $cht_active);
    
    $txtfile = $chtfile . ".txt";
    
#    if (-e $txtfile) {
#        print "error: ${txtfile} exists. I won't overwrite an existing file!\n";
#        return;
#    }
    
    open(CHT, $chtfile);
    binmode(CHT);
    open(TXT, ">$txtfile");
    
    @stats = stat($chtfile);
    $codes = $stats[7] / 28;
    
    print(TXT "Decoding ${chtfile} into ${codes} PAR codes.\n\n");
    
    for ($count = 0; $count < $codes; $count++) {
        read(CHT, $chtdata, 28);
        ($cht_name, $cht_code, $cht_active) = decode_cht_data($chtdata);
        printf(TXT "%2d: %-18s %s %-8s\n", ($count + 1), $cht_name, $cht_code, 
               ($cht_active ? "active" : "inactive"));
    }
    
    close(CHT);
    close(TXT);
    
    print "wrote the decoded output of ${chtfile} to ${txtfile}.\n";
}

#
# end of script
################################################################################
