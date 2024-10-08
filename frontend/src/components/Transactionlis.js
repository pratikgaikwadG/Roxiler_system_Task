import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "react-bootstrap";
import BarChartComponent from "./Barchart"; 
import CategoryPieChart from "./Piechart"; 

import "./style.css";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState("2022");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalSales, setTotalSales] = useState(0);
  const [soldItems, setSoldItems] = useState(0);
  const [notSoldItems, setNotSoldItems] = useState(0);

  const rowsPerPage = 10;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2021", "2022"];

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/transaction/getAllTransactions`);
      const transactions = response.data.data;
      setTransactions(transactions);
      setFilteredTransactions(transactions);
      setTotalPages(Math.ceil(transactions.length / rowsPerPage)); 
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async (selectedMonth, selectedYear) => {
    try {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const response = await axios.get(
        `http://localhost:5001/api/transaction/getStatistics?month=${monthIndex}&year=${selectedYear}`
      );
      const { totalSalesAmount, totalSoldItems, totalNotSoldItems } = response.data;
      setTotalSales(totalSalesAmount);
      setSoldItems(totalSoldItems);
      setNotSoldItems(totalNotSoldItems);
    } catch (error) {
      setTotalSales(0);
      setSoldItems(0);
      setNotSoldItems(0);
    }
  };

  const filterTransactionsByMonthYear = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      const transactionMonth = transactionDate.toLocaleString("default", { month: "long" });
      const transactionYear = transactionDate.getFullYear().toString();
      return transactionMonth === month && transactionYear === year;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1); 
    fetchStatistics(month, year);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    if (searchValue === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(searchValue) ||
          transaction.description.toLowerCase().includes(searchValue) ||
          transaction.price.toString().includes(searchValue) ||
          transaction.category.toString().includes(searchValue) ||
          transaction.year.toString().includes(searchValue)
      );
      setFilteredTransactions(filtered);
    }
    setCurrentPage(1);
  };

  const paginateTransactions = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
    return paginatedData;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTransactions.length / rowsPerPage));
  }, [filteredTransactions]);

  return (
    <div className="table-container">
      <div className="search-filter-container">
        <InputGroup className="search-box">
          <Form.Control
            placeholder="Search transactions"
            value={searchText}
            onChange={handleSearch}
          />
        </InputGroup>

        <div className="dropdown-container">
          <Form.Select value={month} onChange={(e) => setMonth(e.target.value)} className="mb-3 dropdown-select">
            {months.map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </Form.Select>

          <Form.Select value={year} onChange={(e) => setYear(e.target.value)} className="mb-3 dropdown-select">
            {years.map((y, index) => (
              <option key={index} value={y}>{y}</option>
            ))}
          </Form.Select>

          <Button className="search-button" onClick={filterTransactionsByMonthYear}>
            Search
          </Button>
        </div>
      </div>

      <div className="chart-and-table-container">
        {/* Bar Chart */}
        <div className="chart-column">
          <div className="bar-chart-container">
            <BarChartComponent selectedMonth={month} selectedYear={year} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-column pie-chart-column">
          <div className="pie-chart-container">
            <CategoryPieChart selectedMonth={month} selectedYear={year} />
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-column">
          <div className="statistics-container">
            <p><strong>Total Sale Amount:</strong> {totalSales}</p>
            <p><strong>Total Sold Items:</strong> {soldItems}</p>
            <p><strong>Not Sold Items:</strong> {notSoldItems}</p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <Table bordered className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {paginateTransactions().map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="pagination-container">
        <div className={`pagination-arrows ${currentPage === 1 ? "disabled" : ""}`} onClick={handlePrevious}>
          <FaArrowLeft /> Previous
        </div>
        <div className="page-number">
          Page {currentPage} of {totalPages}
        </div>
        <div className={`pagination-arrows ${currentPage === totalPages ? "disabled" : ""}`} onClick={handleNext}>
          Next <FaArrowRight />
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
