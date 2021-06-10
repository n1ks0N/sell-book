<?php
// несколько получателей
// $to  = 'aidan@example.com' . ', ';  // обратите внимание на запятую
// $to .= 'wez@example.com';
$to = 'gromyakov05@mail.ru';

// тема письма
$subject = 'Заявка на вывод средств';

// текст письма
$message = 'Пользователь' . $_POST['wallet'];

// Для отправки HTML-письма должен быть установлен заголовок Content-type
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; 

// Дополнительные заголовки
$headers .= 'To: Иван <gromyakov05@mail.ru>' . "\r\n"; // Свое имя и email
$headers .= 'From: '  . $_POST['wallet'] . '<' . $_POST['email'] . '>' . "\r\n";


// Отправляем
mail($to, $subject, $message, $headers);
?>