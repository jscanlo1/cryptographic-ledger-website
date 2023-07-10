import { useState } from "react";
import server from "./server";

function Ledger({lastLedgerUpdate, setLastLedgerUpdate}){
    //Update Ledger
    const [ledger, setLedger] = useState([]);
    async function onNewTransaction() {
        const newLedgerData = await server.get(`ledger/${lastLedgerUpdate}`);
        setLastLedgerUpdate(Date.now());
        console.log(newLedgerData);
        for(let newRow in newLedgerData){
            //Organise data appropriately with a mpaping
            console.log(newRow);
            setLedger([...ledger, newRow]);
        }

        console.log(ledger);

    }


    //Set ut up so that tbody is update with ledger state
    return (
        <div className="container ledger">
            <h1>Ledger</h1>
            <table className="ledger-table">
                <thead>
                    <tr>
                        <td>Sender</td>
                        <td>Receiver</td>
                        <td>Amount</td>
                        <td>Timestamp</td>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr>
                        <td>Me</td>
                        <td>you</td>
                        <td>1,000,000</td>
                        <td>0/0/0</td>
                    </tr>

                    <tr>
                        <td>Me</td>
                        <td>you</td>
                        <td>1,000</td>
                        <td>1/0/0</td>
                    </tr>
                </tbody>
            </table>

            <button className="button"  onClick={onNewTransaction} >Update Ledger</button>
        </div>
    );
}

export default Ledger;