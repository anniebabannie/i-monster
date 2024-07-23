import { useEffect, useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from '../../convex/_generated/api';
import type { Monster } from '../utils';

function ImageUpload() {
  // Create state to store file
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState("");
  const [monster, setMonster] = useState<Monster>();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file as Blob);
    const resp = await fetch(`http://localhost:5173/`, {
      method: "POST",
      body: file,
    })

    const response = await resp.json();
    const m = JSON.parse(response.monster);
    // await sendMonster(m);
    // await client.mutation(api.monsters.send, m);
    console.log(m);
    setMonster(m);
    setImage(response.image);
    console.log(response);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
      <div>
        <form onSubmit={handleSubmit} action="index">
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <img src={image} alt="" />
      </div>
  );
}

export default ImageUpload;