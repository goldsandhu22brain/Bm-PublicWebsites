<?php
extract($_REQUEST);
$to = "mail2ravi003@gmail.com";
$subject = "HTML email";

$message = '
<html>
<head>
<title>TYest Email</title>
</head>
<tr>
<th>First Bame</th>
<th>Last Name</th>
<th>Email</th>
<th>Message</th>
</tr>
<tr>
<td>'.$first_name.'</td>
<td>'.$last_name.'</td>
<td>'.$email.'</td>
<td>'.$mesg.'/td>
</tr>
</table>
</body>
</html>';

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <mail2ravi003@gmail.com' . "\r\n";
//$headers .= 'Cc: myboss@example.com' . "\r\n";

mail($to,$subject,$message,$headers);
$_SESSION['sess_msg=']='Thanks for your contribution. our team will contact you soon'
header('location:contact.php');
EXIT;
?>