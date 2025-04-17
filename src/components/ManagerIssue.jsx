import React, { useState } from 'react'
import "../Styles/Missue.css"
import Axios from 'axios';

const ManagerIssue = () => {

    const [data, setData] = useState({
        No: '',
        Barcode: '',
        Kapan: '',
        Lot: '',
        Tag: '',
        MWgt: '',
        Shape: '',
        Color: '',
        Clarity: '',
        Cut: '',
        Pol: '',
        Sym: '',
        EWgt: '',
        PWgt: ''
    });

    const handlerChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const insertData = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post("http://localhost:3002/api/manager/issue", data);
            console.log("Data Saved Successfully : ", response.data);
            // setData({ ...});
        } catch (error) {
            console.error("Error While submit Form : ", error);
            alert("Error while Submit Form, Please Try again");
        }
    }

    return (
        <>
            <h1>Manage Issue</h1>
            <div className="mIsuue">
                <label htmlFor="">Manager : </label>
                <input type="text" />
                <br /><br />
                <input type="radio" name='Missue' id='issue' />
                <label htmlFor="issue">Issue</label>
                <input type="radio" name='Missue' id='return' />
                <label htmlFor="return">Return</label>
                <br /><br /><br />
                <form action="" onSubmit={insertData}>
                    <table border='1' className='managerTable'>
                        <thead>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name='No'
                                        value={data.No}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Barcode'
                                        value={data.Barcode}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Kapan'
                                        value={data.Kapan}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Lot'
                                        value={data.Lot}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Tag'
                                        value={data.Tag}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='MWgt'
                                        value={data.MWgt}
                                        onChange={handlerChange}
                                    />
                                </td>
                                {/* <td>
                                <select name="" id="">
                                    <option value="">Shape</option>
                                </select>
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">Color</option>
                                </select>
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">Clarity</option>
                                </select>
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">
                                        Cut
                                    </option>
                                </select>
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">Pol</option>
                                </select>
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">Sym</option>
                                </select>
                            </td> */}
                                <td>
                                    <input
                                        type="text"
                                        name='Shape'
                                        value={data.Shape}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Color'
                                        value={data.Color}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Clarity'
                                        value={data.Clarity}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Cut'
                                        value={data.Cut}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Pol'
                                        value={data.Pol}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='Sym'
                                        value={data.Sym}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='EWgt'
                                        value={data.EWgt}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name='PWgt'
                                        value={data.PWgt}
                                        onChange={handlerChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="submit"
                                    />
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>No</th>
                                <th>Barcode</th>
                                <th>Kapan</th>
                                <th>Lot</th>
                                <th>Tag</th>
                                <th>M Wgt</th>
                                <th>Shape</th>
                                <th>Color</th>
                                <th>Clarity</th>
                                <th>Cut</th>
                                <th>Pol</th>
                                <th>Sym</th>
                                <th>E Wgt</th>
                                <th>P Wgt</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table >
                </form>
            </div >
        </>
    )
}

export default ManagerIssue
