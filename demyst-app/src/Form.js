import {Col, Container, Row,Form} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';



export default function FormPage(){

    const [isClicked, setIsClicked] = useState(true);
    const [showBalanceAlert, setShowBalanceAlert] = useState(false);
    const [showSubmitAlert, setShowSubmitAlert] = useState(false);
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [accProvider, setAccProvider] = useState('');
    const [profit, setProfit] = useState('');
    const [accountDetails, setAccountDetails] = useState([])
    const [accountDecision, setAccountDecision] = useState([])



    const handleSubmit = (event)=>{
        event.preventDefault();

        if(accProvider==''){
            alert('Please select an Accounting Provider')
            return;
        }

        if (accountDetails != null){

        fetch(`http://localhost:8000/makeDecision?name=${name}&year=${year}&assetsValue=${accountDetails[0]['assetsValue']}&loanValue=${profit}&profit=${accountDetails[0]['profitOrLoss']}`)
            .then((response)=>response.json())
            .then((responseData) => {
                setAccountDecision(responseData)
                setShowSubmitAlert(true)
        })
        .catch((error) => {
            console.error('Error:', error);
      });
      }
      else{
        alert('No balance sheet available so no decision');
      }
    }

    const handleCheckBalance = (event)=>{
        event.preventDefault();

        if(accProvider==''){
            alert('Please select an Accounting Provider')
            return;
        }

        fetch(`http://localhost:8000/getBalanceSheet?name=${name}&year=${year}&accounting_office=${accProvider}`)
        .then((response)=>response.json())
        .then((responseData) => {
            setAccountDetails(responseData['details'])
            setShowBalanceAlert(true);
            setIsClicked(false);
        })
        .catch((error) => {
            console.error('Error:', error);
      });
    }

    const handleValidate = (e) => {
        const inputValue = e.target.value;
        if (/^[0-9]*$/.test(inputValue)) {
            setProfit(inputValue)
        }

      };

    const handleBalanceAlertClose = () => setShowBalanceAlert(false);
    const handleSubmitAlertClose = () => {
        window.location.reload();
        setShowSubmitAlert(false);
    }


    return(
        <div style={{textAlign:"center",margin:"10px",padding:"5px"}}>
            <h2>Loan Application</h2>
            <Form onSubmit={handleCheckBalance}>
                
                <Row>
                    <Form.Label htmlFor="name">Name:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="name"     
                    />
                </Row>
                <Row>
                    <Form.Label htmlFor="year">Year:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="year"     
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        placeholder="year"
                    />
                </Row>
          <Row>
          <Form.Label htmlFor="profit">Loan Required:</Form.Label>
          
          <Form.Control
              required
              type="text"
              id="profit"
              placeholder="Enter Loan Value"
              value={profit}
            onChange={handleValidate}     
          />
          </Row>

          <Row>
          <Form.Label htmlFor="profit">Accounting provider:</Form.Label>
          <Form.Select
            class="form-control"
            id="accProvider"
            name="accProvider"
            value={accProvider}
            onChange={(event) => setAccProvider(event.target.value)}
            >
                <option value=''>Select accounting provider</option>
                <option value="Xero">Xero</option>
                <option value="MYOB">MYOB</option>
            </Form.Select>
            </Row>

            <Row>
            <div style={{textAlign:"center",margin:"10px",padding:"5px"}}>
              <Button type="submit">Check balance</Button>
            </div> 
          </Row>
        </Form>


        <Row>
            <div style={{textAlign:"center",margin:"10px",padding:"5px"}}>
            {/* <Button type="submit" disabled={isClicked}>Submit form</Button> */}
              <Button variant="primary"  onClick={handleSubmit} disabled={isClicked}>Submit</Button>
            </div>  
        </Row>


            


        <Modal show={showBalanceAlert} onHide={handleBalanceAlertClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                {accountDetails ? (
                    accountDetails.map((item) => (
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                    ))
                    ) : (
                        <p>No account details available.</p>
                )}

                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleBalanceAlertClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleBalanceAlertClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
      </Modal>

      <Modal show={showSubmitAlert} onHide={handleSubmitAlertClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                    {accountDecision ? (
                    accountDecision.map((item) => (
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                    ))
                    ) : (
                        <p>No account details available so no decision.</p>
                )}

                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleSubmitAlertClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmitAlertClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
      </Modal>

        </div>
        

    )
}