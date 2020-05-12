import React from 'react';

class ProductCategory extends React.Component {

    render() {
        return (
            <tr>
                <td colSpan={2} style={{fontWeight:900, textAlign: 'center'}}>
                    {this.props.category}
                </td>
            </tr>
        );
    }

}

export default ProductCategory