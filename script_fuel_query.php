<?php
require_once("inc_connect.php");
require("krumo/class.krumo.php");

$version = "8.3.0.0 (1.6.4)";

$query = "SELECT * FROM fuel WHERE version = '$version' ORDER BY 'name'";

$result = mysqli_query($con, $query);

if ($result)
{
  if (mysqli_num_rows($result) > 0)
  {
    while ($row = mysqli_fetch_assoc($result))
    {
      $fuels[$row['fuel_id']] = array("name" => $row['name'], "burn_time" => $row['burn_time'], "state" => $row['state'], "stacksize" => $row['stacksize'], "source" => $row['source'], "icon" => $row['icon']);
    }

    echo json_encode($fuels);
    return;
  }
  else
    echo "Found no fuel.";
}
else
  echo mysqli_error($con);
?>