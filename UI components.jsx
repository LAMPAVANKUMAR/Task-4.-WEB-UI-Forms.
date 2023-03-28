import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

const SERVER_API_URL = 'http://localhost:8080/api/servers';

function App() {
  const [servers, setServers] = useState([]);
  const [newServer, setNewServer] = useState({ name: '', id: '', language: '', framework: '' });

  useEffect(() => {
    axios.get(SERVER_API_URL)
      .then(response => {
        setServers(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewServer({ ...newServer, [name]: value });
  };

  const handleCreate = event => {
    event.preventDefault();
    axios.post(SERVER_API_URL, newServer)
      .then(response => {
        setServers([...servers, response.data]);
        setNewServer({ name: '', id: '', language: '', framework: '' });
      })
      .catch(error => console.error(error));
  };

  const handleDelete = id => {
    axios.delete(`${SERVER_API_URL}/${id}`)
      .then(() => {
        setServers(servers.filter(server => server.id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <Router>
      <Container>
        <Row>
          <Col>
            <h1>Server List</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Language</th>
                  <th>Framework</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {servers.map(server => (
                  <tr key={server.id}>
                    <td>{server.id}</td>
                    <td><Link to={`/servers/${server.id}`}>{server.name}</Link></td>
                    <td>{server.language}</td>
                    <td>{server.framework}</td>
                    <td><Button variant="danger" onClick={() => handleDelete(server.id)}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Switch>
          <Route path="/servers/new">
            <Row>
              <Col>
                <h2>Create Server</h2>
                <Form onSubmit={handleCreate}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={newServer.name} onChange={handleInputChange} />
                  </Form.Group>
                  <Form.Group controlId="formId">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text"
