<?php
require_once("inc_connect.php");
require("class.krumo.php");

$query = "SELECT DISTINCT `version` FROM `fuel` ORDER BY `version`";

$result = mysqli_query($con, $query);
$num = mysqli_num_rows($result);

if (!$result)
  die("SQL Error: " . mysqli_error($con));

$i = 0;
while ($row = mysqli_fetch_assoc($result))
{
  $versions[$i] = $row["version"];
  $i++;
}

sleep(5);
echo json_encode($versions);
?>