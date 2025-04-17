import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

const DailyStock = () => {

    const [stocks, setStocks] = useState([]);
    const [searchStock, setSearchStock] = useState("");
    const Navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            Axios.get("http://localhost:3002/api/dailyStock")
                .then((response) => {
                    setStocks(response.data);
                })
                .catch((error) => {
                    console.log("Error Fetching Data : ", error);
                })
        }
        fetchData();
    }, []);


    // Filter stocks based on searchStock
    const filteredStocks = stocks.filter((stock) =>
        stock.clientName.toLowerCase().includes(searchStock.toLowerCase())
    );

    return (
        <>
            <h1>Daily Stock</h1>
            <form action="">
                <label htmlFor="search">Search : </label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="search Party"
                    value={searchStock}
                    onChange={(e) => setSearchStock(e.target.value)}
                />
                <button>Kharcha</button>

                <br /><br /><br />
                <table border='1'>
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Rough</th>
                            <th>Polish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredStocks.map((stock) => (
                                <tr key={stock.clientName}>
                                    <td onClick={() => Navigate('/party')} style={{ cursor: "pointer" }}> {stock.clientName} </td>
                                    <td onClick={() => Navigate('/rough')} style={{ cursor: "pointer" }}> {stock.rough} </td>
                                    <td onClick={() => Navigate('/polish')} style={{ cursor: "pointer" }} > {stock.polish} </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
            <br /><br /><br /><br />
            <NavLink to='manager-issue'>Manager Issue</NavLink>
            <br />
            <NavLink to='bank'>Bank Master</NavLink>
            <br />
            <NavLink to='labour-process'>Labour Process</NavLink>
        </>
    )
}

export default DailyStock
