import React, { useEffect, useState } from "react";
import { fetchCustomers, fetchTransactions } from "./api";
import {
  Table,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modal, setModal] = useState(false);
  const [chartData, setChartData] = useState(null); // State for chart data

  useEffect(() => {
    fetchCustomers().then((response) => {
      setCustomers(response.data);
    });
    fetchTransactions().then((response) => {
      setTransactions(response.data);
    });
  }, []);

  const getTransactionsForCustomer = (customer) => {
    return transactions.filter((t) => t.customer_id === customer.id);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    updateChartData(customer); // Update chart data when customer is selected
    setModal(true);
  };

  const updateChartData = (customer) => {
    const transactionsForCustomer = getTransactionsForCustomer(customer);
    const chartData = {
      labels: transactionsForCustomer.map((t) => t.date),
      datasets: [
        {
          label: "Transaction Amount",
          data: transactionsForCustomer.map((t) => t.amount),
          borderColor: "rgba(75,192,192,1)",
          fill: false,
        },
      ],
    };
    setChartData(chartData);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  const handleAmountFilterChange = (event) => {
    setAmountFilter(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    const transactionsForCustomer = getTransactionsForCustomer(customer);
    const totalAmount = transactionsForCustomer.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return (
      customer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (!amountFilter || totalAmount === parseFloat(amountFilter))
    );
  });

  return (
    <div className="App container">
      <h1>Customer Transactions</h1>
      <Row>
        <Col md={6}>
          <Input
            type="text"
            value={nameFilter}
            onChange={handleNameFilterChange}
            placeholder="Filter by customer name"
          />
        </Col>
        <Col md={6}>
          <Input
            type="number"
            value={amountFilter}
            onChange={handleAmountFilterChange}
            placeholder="Filter by exact total amount"
          />
        </Col>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Number of Transactions</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => {
            const transactionsForCustomer =
              getTransactionsForCustomer(customer);
            const totalAmount = transactionsForCustomer.reduce(
              (sum, transaction) => sum + transaction.amount,
              0
            );
            return (
              <tr key={customer.id}>
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleRowClick(customer)}
                >
                  {customer.name}
                </td>
                <td>{transactionsForCustomer.length}</td>
                <td>{totalAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {selectedCustomer && (
        <Modal isOpen={modal} toggle={() => setModal(false)}>
          <ModalHeader toggle={() => setModal(false)}>
            {selectedCustomer.name}'s Transactions
          </ModalHeader>
          <ModalBody>
            <Table striped>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {getTransactionsForCustomer(selectedCustomer).map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.amount}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
            {chartData && (
              <div>
                <h3>Total Transaction Amount per Day</h3>
                {/* Render chart here */}
              </div>
            )}
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default App;
