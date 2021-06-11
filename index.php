<?php
// несколько получателей
// $to  = 'aidan@example.com' . ', ';  // обратите внимание на запятую
// $to .= 'wez@example.com';
// $to = 'gromyakov05@mail.ru';

// // тема письма
// $subject = 'Заявка на вывод средств';

// // текст письма
// $message = 'Пользователь' . $_POST['wallet'];

// // Для отправки HTML-письма должен быть установлен заголовок Content-type
// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; 

// // Дополнительные заголовки
// $headers .= 'To: Иван <gromyakov05@mail.ru>' . "\r\n"; // Свое имя и email
// $headers .= 'From: '  . $_POST['wallet'] . '<' . $_POST['email'] . '>' . "\r\n";


// // Отправляем
// mail($to, $subject, $message, $headers);

require_once('PHPMailer/PHPMailer.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$wallet = $_POST['wallet'];
$email = $_POST['email'];

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mail.ru';  																							// Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'dzharuzov@mail.ru'; // Ваш логин от почты с которой будут отправляться письма
$mail->Password = '$dk820&123'; // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465; // TCP port to connect to / этот порт может отличаться у других провайдеров

$mail->setFrom('dzharuzov@mail.ru'); // от кого будет уходить письмо?
$mail->addAddress('gromyakov05@mail.ru');     // Кому будет уходить письмо 
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Заявка с тестового сайта';
$mail->Body    = '' .$wallet . ' оставил заявку, его телефон <br>Почта этого пользователя: ' .$email;
$mail->AltBody = '';

if(!$mail->send()) {
    
} else {

}
?>