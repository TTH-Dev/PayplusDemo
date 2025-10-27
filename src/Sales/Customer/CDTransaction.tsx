import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { message } from "antd";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";
import axios from "axios";
import moment from "moment";

interface CDTransaction {
  id?: string;
}

const CDTransaction: React.FC<CDTransaction> = () => {
  const { id } = useParams();

  const [quatotionsData, setQuatotionsData] = useState<any>([]);
  const [invoiceData, setInvoiceData] = useState<any>([]);
  const [receiptData, setReceiptData] = useState<any>([]);


  const fetchOverAll = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      if (!token) {
        message.error("Please login!");
        return;
      }
      const res = await axios.get(`${API_URL}/api/customer/overall/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const quatotions = res.data.data.quatotions.map((val: any, index: number) => {
        return {
          date: moment(val.quotationDate).format("DD-MM-YYYY"),
          number: val.quotationNo,
          amount: val.total,
          status: val.status
        }
      });
      const invoice = res.data.data.invoice.map((val: any, index: number) => {
        return {
          date: moment(val.invoiceDate).format("DD-MM-YYYY"),
          number: val.invoiceNo,
          amount: val.total,
          status: val.latestAmount
        }
      });

      const reciept = res.data.data.receipt.map((val: any, index: number) => {
        return {
          date: moment(val.receiptDate).format("DD-MM-YYYY"),
          number: val.receiptNo,
          amount: val.totalReceivedAmount,
          status: val.totalBalancedAmount
        }
      });
      setReceiptData(reciept);
      setInvoiceData(invoice);
      setQuatotionsData(quatotions);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOverAll()
  }, []);

  const transactions = [
    {
      title: "Quotes",
      headers: ["Date", "Quote Number", "Amount", "Status"],
      data: quatotionsData
    },
    {
      title: "Invoices",
      headers: ["Date", "Invoice Number", "Payment Amt", "Outstanding"],
      data: invoiceData,
    },
    {
      title: "Payments Received",
      headers: ["Date", "Receipt Number", "Payment Amt", "Balance Amt"],
      data: receiptData
    },
  ];

  return (
    <Box sx={{ margin: "auto", mt: 3, mb: 5 }}>
      <Typography fontWeight={600} sx={{ mb: 2 }}>
        Transaction
      </Typography>

      {transactions.map((section, index) => (
        <Accordion key={index} elevation={0}>
          <AccordionSummary className="my-0"
            sx={{
              "& .MuiAccordionSummary-content.Mui-expanded": { margin: "0  !important" },
              "&.Mui-expanded": { minHeight: "30px " }
            }}>
            <Typography sx={{ color: "#353535" }} className="p-14 my-0 ms-3">{section.title} <IoIosArrowDown /></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer  >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {section.headers.map((head) => (
                      <TableCell key={head} style={{ color: "#666666", fontSize: "14px", fontWeight: "400" }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.data.map((row: any, rowIndex: any) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((cell: any, cellIndex) => (
                        <TableCell key={cellIndex} style={{ borderBottom: "none", color: "#353535" }} className="p-14">{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CDTransaction;
