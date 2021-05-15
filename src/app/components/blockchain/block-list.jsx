import React from 'react';
import Block from './block';

const BlockList = (props) => {
    const { data } = props;

    return (
        <>
            {data.reverse().map((value, index) => {
                return <Block blockData={value} />;
            })}
        </>
    );
};

export default BlockList;
