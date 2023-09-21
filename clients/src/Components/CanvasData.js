import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CanvasDataComponent() {
    const [data, setData] = useState([]);
    let g = 9

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:5000/canvasEndpoint');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [g]);

    return (
        <div>
            {data}
        </div>
    );
}

export default CanvasDataComponent;