import React from 'react'
import "../Styles/Polish.css"

const Polish = () => {
    return (
        <>
            <h1>Polish</h1>
            <table border='1'>
                <thead>
                    {/* <tr className='inputs'>
                        <td>
                            <input type="text" />
                        </td>
                        <td>
                            <input type="text" />
                        </td>
                        <td>
                            <input type="text" />
                        </td>
                        <td>
                            <input type="text" />
                        </td>
                    </tr> */}
                    <tr>
                        <th>Barcode</th>
                        <th>Kapan</th>
                        <th>Lots</th>
                        <th>Tag</th>
                        <th>Weight</th>
                        <th>
                            <select name="" id="">
                                <option value="">Shape</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">Color</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">Clarity</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">Cut</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">Pol</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">Sym</option>
                            </select>
                        </th>
                        <th>
                            <select name="" id="">
                                <option value="">FL</option>
                            </select>
                        </th>
                        <th>EWgt</th>
                        <th>RWgt</th>
                        <th>Rap</th>
                        <th>Back</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Merge</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
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
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Polish
