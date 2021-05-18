import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaReceipt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BlockItem = (props) => {
    const { blockData } = props;
    return (
        <Card style={{ marginTop: 20 }}>
            <Card.Header style={{ display: 'flex' }} className="justify-content-between">
                <span>Block #{blockData.index}</span>
                <Link to={`/blocks/${blockData.id}`}>
                    <FaReceipt size={20} />
                </Link>
            </Card.Header>
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

export default BlockItem;
