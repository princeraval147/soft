import React,{useState} from 'react';
import styles from '../Styles/BarcodePrint.module.css'
import Axios from 'axios';

const BarcodePrint = () => {
    const [form, setForm] = useState({
        kapan: '',
        tag: '',
        from: '',
        to: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = async () => {
        const { kapan, tag, from, to } = form;
        if (!kapan || !tag || !from || !to) {
            alert("All fields are required.");
            return;
        }
        const fromInt = parseInt(from, 10);
        const toInt = parseInt(to, 10);
        if (fromInt > toInt) {
            alert("From value must be less than or equal to To value.");
            return;
        }
        const today = new Date().toISOString();
        for (let i = fromInt; i <= toInt; i++) {
            const barcode = `SK${String(i).padStart(6, '0')}`; // Adjust if your format is different
            const packet = {
                BARCODE: barcode,
                KAPAN: kapan,
                PKT: tag,
                IDATE: today
            };
            try {
                await Axios.post("http://localhost:3002/api/print-label", {
                    barcode: packet.BARCODE,
                    kapan: packet.KAPAN,
                    tag: packet.PKT,
                    date: packet.IDATE
                });
                console.log(`Printed ${packet.BARCODE}`);
            } catch (error) {
                console.error("Print failed for", packet.BARCODE, error);
            }
        }
        alert("Printing complete.");
    };


    
    return (
        <>
            <h1>Barcode Print</h1>
            <div className={styles.container}>
                <h2 className={styles.title}>Print Barcode Range</h2>
                <div className={styles.formGroup}>
                    <label>Kapan:</label>
                    <input type="text" name="kapan" value={form.kapan} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>Tag:</label>
                    <input type="text" name="tag" value={form.tag} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>From:</label>
                    <input type="text" name="from" value={form.from} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>To:</label>
                    <input type="text" name="to" value={form.to} onChange={handleChange} />
                </div>
                <button onClick={handlePrint} className={styles.printButton}>Print</button>
            </div>
        </>
    )
}

export default BarcodePrint
