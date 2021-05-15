import React from 'react';
import { Card } from 'react-bootstrap';

const Block = (props) => {
    const { blockData } = props;
    return (
        <Card style={{ marginTop: 20 }}>
            <Card.Header>Block #{blockData.index}</Card.Header>
            <Card.Body>
                <p>
                    Hash: <code>{blockData.hash}</code>
                </p>
                <p>
                    Timestamp: <code>{blockData.timestamp}</code>
                </p>
                <p>Nonce: {blockData.nonce}</p>
            </Card.Body>
            <Card.Footer>
                Previous hash:{' '}
                <code>
                    {blockData.previousHash !== '' ? blockData.previousHash : 'GENESIS BLOCK'}
                </code>
            </Card.Footer>
        </Card>
    );
};

export default Block;
