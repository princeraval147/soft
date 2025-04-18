import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import Party from './components/Party'
import DailyStock from "./components/DailyStock";
import Rough from "./components/Rough";
import Polish from "./components/Polish";
import Error from "./components/Error"
import Report from "./components/Reports/Report";
import ManagerIssue from "./components/ManagerIssue";
import EmpMaster from "./components/EmpMaster";
import BankMaster from "./components/BankMaster";
import LabourProcess from "./components/LabourProcess";
import Packet from "./components/Packet";
import Issue from "./components/Issue";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<DailyStock />} />
            <Route path="party" element={<Party />} />
            <Route path="bank" element={<BankMaster />} />
            <Route path="emp" element={<EmpMaster />} />
            <Route path="rough" element={<Rough />} />
            <Route path="packet" element={<Packet />} />
            <Route path="Issue" element={<Issue />} />
            <Route path="polish" element={<Polish />} />
            <Route path="manager-issue" element={<ManagerIssue />} />
            <Route path="labour-process" element={<LabourProcess />} />
            <Route path="*" element={<Error />} />
            <Route path="report" element={<Report />} />
        </Route>
    ),
    {
        future: {
            v7_startTransition: true
        }
    }
)

export default router;