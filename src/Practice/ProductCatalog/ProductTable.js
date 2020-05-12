import React from 'react';
import ProductCategory from './ProductCategory'
import ProductRow from './ProductRow'


class ProductTable extends React.Component {

    render() {

        let productArr = []

        let inStockItems = this.props.products      //.filter((item) => {

        //     return item.stocked === isStocked && isStocked || !isStocked

        // })

        // inStockItems.map((item, index) => {

        //     productArr.push(
        //         <ProductRow key={index + 1} stocked={item.stocked} name={item.name} price={item.price} />
        //     )
        // })

        let id = 0

        inStockItems.groupBy(item => item.category).entrySeq().forEach(([key, value]) => {
            
            productArr.push(
                <ProductCategory key={id+3/2} category={key}/>
            )
            
            value.toJS().forEach((item) => {
            
                productArr.push(
                    <ProductRow key={id++} stocked={item.stocked} name={item.name} price={item.price} />
                )
            
            })
			
		})


        return (
            <table responsive="true" style={{width: 200+'px', margin: 'auto', marginTop:20}}>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Price
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {productArr}

                </tbody>
            </table>
        )
    }
}

export default ProductTable