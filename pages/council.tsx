import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react';
import ButtonModal from '../components/button-modal';
import IssueListItem from '../components/issue-list-item';
import PageHero from '../components/page-hero';
import { Form } from "react-bootstrap";

export default function PageCouncil() {
const [show, setShow] = useState<boolean>(false);
const [value, setValue] = useState<string>('');
    function handleShow() {
        setShow(true);
    }
    function handleHide() {
        setShow(false);
        setValue('');
    }
    function sendMessage(){
        console.log('Message', value)
        setShow(false)
    }
    function handleShowIssue(){
        setValue("Remove all getContract functions from Application and instead functions from Application and instead")
        setShow(true)
    }
    function issueList(){
        return ['1','2','3'].map(key => (
        <div className="col-md-10" key={key} onClick={handleShowIssue}>
            <IssueListItem state='ready'></IssueListItem>
        </div>
        ))
    }
  return (
    <div>
      <PageHero title="Ready to Propose"></PageHero>
      <div className="container mb-3">
        <div className="row justify-content-center">
            <div className="col-md-10">
            <ButtonModal
                title="Modal"
                disabled={false}
                className="btn btn-primary"
                show={show}
                onClick={handleShow}
                onHide={handleHide}
                footer={
                    <>  
                        <button type="button" className="btn btn-md btn-opac" onClick={handleHide}>Cancel</button>
                        <button type="button" className="btn btn-md btn-primary" onClick={sendMessage}>OK</button>
                    </>
                }>
                <>
                    <p className="text-center fs-6 text fw-bold">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    </p>
                    <Form.Control as="textarea" placeholder="Type testing" value={value} onChange={e => setValue(e.target.value)}></Form.Control>
                </>

            </ButtonModal>
            </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
            {issueList()}
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}