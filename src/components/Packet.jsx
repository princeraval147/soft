import React, { useState, useEffect, useRef } from 'react';
import styles from '../Styles/Packet.module.css'; // Optional styling
import Axios from 'axios';

const Packet = () => {
    const weightRef = useRef(null);

    const [pktCounter, setPktCounter] = useState(1);
    const [packetDisplay, setPacketDisplay] = useState([]);
    const [formData, setFormData] = useState({
        party: '',
        kapan: '',
        pcs: '',
        carat: '',
        avgSize: '',
        type: '',
        date: ''
    });

    const [packetEntry, setPacketEntry] = useState({
        lot: '1',
        weight: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePacketEntryChange = (e) => {
        const { name, value } = e.target;
        setPacketEntry(prev => ({ ...prev, [name]: value }));
    };

    // const fetchPacket = () => {
    //     Axios.get("http://localhost:3002/api/packet")
    //         .then((response) => {
    //             setPacketDisplay(response.data);
    //             const maxPkt = response.data.reduce((max, pkt) => Math.max(max, pkt.PKT || 0), 0);
    //             setPktCounter(maxPkt + 1); // sets pktCounter for barcode + UI
    //             // const maxPkt = response.data.reduce((max, pkt) => Math.max(max, pkt.PKT || 0), 0);
    //             // setPktCounter(maxPkt + 1); // Auto-increment based on existing entries
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching Packet:", error);
    //         });
    // }
    const fetchAllPacket = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/packet");
            const lastPkt = response.data.length > 0
                ? parseInt(response.data[response.data.length - 1].PKT) || 0
                : 0;
            // console.log("Last PKT from DB = ", lastPkt);
            setPktCounter(lastPkt + 1);
        } catch (error) {
            console.error("Server error at Full Packet", error);
        }
    }

    const fetchPacket = (kapanID) => {
        if (!kapanID) return;
        Axios.get(`http://localhost:3002/api/packet/${kapanID}`)
            .then((response) => {
                setPacketDisplay(response.data);
                // const maxPkt = response.data.reduce((max, pkt) => Math.max(max, pkt.PKT || 0), 0);
                // console.log("DB PKT = ", maxPkt);
                // setPktCounter(maxPkt + 1); // ensures unique PKT/barcode per Kapan

                // const lastPkt = response.data.length > 0
                //     ? parseInt(response.data[response.data.length - 1].PKT) || 0
                //     : 0;
                // console.log("Last PKT from DB = ", lastPkt);
                // setPktCounter(lastPkt + 1);
                fetchAllPacket();
            })
            .catch((error) => {
                console.error("Error fetching Packet:", error);
            });
    };



    const fetchKapanDetails = async (kapanValue) => {
        try {
            const response = await Axios.get(`http://localhost:3002/api/rough/${kapanValue}`);
            const { ID, PARTY, PCS, WEIGHT, TYPE, IDATE } = response.data[0] || {};

            await fetchPacket(ID);

            const avgSize = PCS && WEIGHT
                ? (parseFloat(WEIGHT) / parseInt(PCS)).toFixed(2)
                : '';

            setFormData(prev => ({
                ...prev,
                party: PARTY || '',
                kapan: ID || '',
                pcs: PCS || '',
                carat: WEIGHT || '',
                type: TYPE || '',
                date: IDATE || '',
                avgSize: avgSize
            }));

            // 👇 Auto-focus to weight input
            weightRef.current?.focus();


        } catch (error) {
            console.error("Error fetching Kapan data:", error);
        }
    };


    // const getNextBarcode = async () => {
    //     try {
    //         const response = await Axios.get("http://localhost:3002/api/max-barcode");
    //         const lastBarcode = response.data?.BARCODE || "SK000000";
    //         const lastNumber = parseInt(lastBarcode.replace("SK", ""));
    //         const nextNumber = lastNumber + 1;
    //         return `SK${nextNumber.toString().padStart(6, '0')}`;
    //     } catch (error) {
    //         console.error("Error getting next barcode:", error);
    //         return "SK000001"; // fallback
    //     }
    // };
    // const getNextBarcode = async () => {
    //     try {
    //         const response = await Axios.get("http://localhost:3002/api/max-barcode");

    //         const lastBarcode = response.data;
    //         const lastNumber = parseInt(lastBarcode.replace("SK", ""));
    //         console.log("Last Barcode = ", lastNumber)
    //         const nextNumber = lastNumber + 1;
    //         return `SK${nextNumber.toString().padStart(6, '0')}`;
    //     } catch (error) {
    //         console.error("Error getting next barcode:", error);
    //         return "SK000001"; // fallback
    //     }
    // };

    const getNextBarcode = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/max-barcode");
            // const lastBarcode = response.data?.lastBarcode || "SK000000";
            const lastBarcode = response.data?.Barcode || "SK000000";
            console.log(lastBarcode);
            const lastNumber = parseInt(lastBarcode.replace("SK", ""));
            const nextNumber = lastNumber + 1;
            return `SK${nextNumber.toString().padStart(6, '0')}`;
        } catch (error) {
            console.error("Error getting next barcode:", error);
            return "SK000001"; // Fallback to a default value
        }
    };


    const handleRowSubmit = async (e) => {
        e.preventDefault();

        const pcsAvailable = parseInt(formData.pcs);
        if (pktCounter > pcsAvailable) {
            alert(`You can't add more than ${pcsAvailable} packets.`);
            return;
        }

        const enteredWeight = parseFloat(packetEntry.weight);
        const totalCaratLimit = parseFloat(formData.carat);
        const maxAllowed = totalCaratLimit * 0.02; // 2% of total carat
        if (enteredWeight > maxAllowed) {
            alert(`You can’t enter more than 2% of ${totalCaratLimit} carat (Max: ${maxAllowed.toFixed(2)}).`);
            return;
        }

        // const generateBarcode = () => {
        //     const pktPart = pktCounter.toString().padStart(6, '0');
        //     return `SK${pktPart}`;
        // };
        // Fetch the latest barcode before submitting the data
        const Barcode = await getNextBarcode();
        console.log("Generated Barcode = ", Barcode);
        // const Barcode = await getNextBarcode();
        // console.log("Barcode = ", Barcode);

        const dataToSend = {
            Party: formData.party,
            Kapan: formData.kapan,
            Packet: packetEntry.lot,
            Carat: packetEntry.weight,
            Pkt: pktCounter,
            Tag: "A",
            Process: "MFG",
            Original: "Y",
            Color: "E",
            Type: formData.type,
            IDate: formData.date,
            Barcode: Barcode
        };

        Axios.post("http://localhost:3002/api/add-packet", dataToSend)
            .then(() => {
                // alert("Packet data added successfully!");
                // fetchPacket();
                fetchPacket(formData.kapan);
                // 👇 Auto-increment lot number
                const nextLot = parseInt(packetEntry.lot) + 1;
                setPacketEntry({
                    lot: nextLot.toString(),
                    weight: ''
                });
                // setPacketEntry({ lot: '', weight: '' }); // Clear inputs

            })
            .catch((error) => {
                console.error("Error adding Packet data:", error);
                alert("Failed to add Packet data.");
            });
    };

    const totalCarat = packetDisplay.reduce((total, pkt) => total + parseFloat(pkt.CARAT || 0), 0).toFixed(2);

    useEffect(() => {
        // fetchAllPacket();
        fetchPacket();
        if (formData.kapan) {
            fetchPacket(formData.kapan);
        }
    }, []);

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <h2>Packet Creation</h2>

                <label>Kapan:
                    <input
                        type="text"
                        name="kapan"
                        value={formData.kapan}
                        onChange={handleChange}
                        onBlur={(e) => fetchKapanDetails(e.target.value)}
                    />
                </label>

                <label>Pcs:
                    <input readOnly type="number" name="pcs" value={formData.pcs} />
                </label>

                <label>Carat:
                    <input readOnly type="number" step="0.01" name="carat" value={formData.carat} />
                </label>

                <label>Avg Size:
                    <input readOnly type="text" name="avgSize" value={formData.avgSize} />
                </label>
            </form>

            <div className={styles.tableContainer}>
                <form onSubmit={handleRowSubmit}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td>
                                    <input
                                        readOnly
                                        type="text"
                                        name="lot"
                                        placeholder="Lot"
                                        value={packetEntry.lot}
                                        onChange={handlePacketEntryChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="weight"
                                        placeholder="Weight"
                                        value={packetEntry.weight}
                                        onChange={handlePacketEntryChange}
                                        ref={weightRef}
                                    />
                                </td>
                                <td>
                                    <button style={{ display: "none" }} type="submit">Add</button>
                                </td>
                            </tr>
                            <tr>
                                <th>Lot</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                packetDisplay.map((packet, index) => (
                                    <tr key={index + 1}>
                                        <td>{packet.PACKET}</td>
                                        <td>{packet.CARAT}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Total</td>
                                <td style={{ fontWeight: 'bold' }}>{totalCarat}</td>
                            </tr>
                        </tfoot>

                    </table>
                </form>
            </div>
        </div>
    );
};

export default Packet;
