import React from "react";
import { useState,useEffect } from "react";

const TopRegionsCard = (metrics) => {
  const [count, setcount] = useState(0);
  const [users,setusers]=useState([]);
  useEffect(()=>{
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(res=>res.json())
    .then(setusers)
  },[]);
  return (
    <>
      <h1>This is sample code {metrics.name}</h1>
      <h2>count increases:{count}</h2>
      <button style={{backgroundColor:"lightblue"}}onClick={()=>setcount(count+1)}>click me</button>
      <ul>
       {users.map(user=><li key={user.id}>{user.name}</li>)}
      </ul>
    </>

  );

}

export default TopRegionsCard;