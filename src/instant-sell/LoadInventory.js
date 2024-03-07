import React, { useState, useEffect } from 'react';

const LoadInventory = async (user) => {
  const response = await fetch('http://localhost:5001/api/get-inventory', {
    credentials: 'include', // Necessary for cookies, authorization headers with HTTPS
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.assets; // Assuming 'assets' is the part of the data you want to work with

};

export default LoadInventory;
