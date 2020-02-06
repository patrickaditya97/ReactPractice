import React from 'react';


class ProductRow extends React.Component {

    render() {
        return (
            <tr>
                <td style={!this.props.stocked ? { color: 'red' } : { color: '' }} >
                    {this.props.name}
                </td>
                <td style={!this.props.stocked ? { color: 'red' } : { color: '' }} >
                    {this.props.price}
                </td>
            </tr>
        );
    }

}


export default ProductRow