<?php
 $string = "test_merchant;www.market.ua;DH783023;1415379863;1547.36;UAH;Процессор Intel Core i5-4670 3.4GHz;Память Kingston DDR3-1600 4096MB PC3-12800;1;1;1000;547.36";
 $key = "dhkq3vUi94{Z!5frxs(02ML";
 $hash = hash_hmac("md5",$string,$key);
?>