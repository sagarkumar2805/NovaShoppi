import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component to display checkout steps with dynamic active/inactive styling based on props
export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      {/* Step 1: Sign-In */}
      <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
      {/* Step 2: Shipping */}
      <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
      {/* Step 3: Payment */}
      <Col className={props.step3 ? 'active' : ''}>Payment</Col>
      {/* Step 4: Place Order */}
      <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}
