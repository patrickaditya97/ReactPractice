import React from 'react';
import AddProducts from './AddProducts'
import DisplayProducts from './ProductDisplay'


class ProductKartContainer extends React.Component
{ 
    render() {
        return (
            <div>
                <AddProducts/>
                <DisplayProducts/>
            </div>
        );
    }
}

export default ProductKartContainer